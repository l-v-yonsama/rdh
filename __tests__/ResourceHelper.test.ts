import {
  CompareKey,
  GeneralColumnType,
  RdhRow,
  ResultSetDataBuilder,
  RowHelper,
  asyncDiff,
  createRdhKey,
  diff,
  diffToUndoChanges,
} from "../src";

const primaryCompareKey: CompareKey = { kind: "primary", names: ["id"] };

const createBuilder = (
  rows: { id: number; val: string | null }[]
): ResultSetDataBuilder => {
  const rdb = new ResultSetDataBuilder([
    createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
    createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
  ]);
  rows.forEach((row) => rdb.addRow(row));
  return rdb;
};

const findRow = (rdb: ResultSetDataBuilder, id: number): RdhRow => {
  const row = rdb.rs.rows.find((r) => r.values.id === id);
  if (!row) {
    throw new Error(`row not found: id=${id}`);
  }
  return row;
};

const createMixedPair = (): {
  rdb1: ResultSetDataBuilder;
  rdb2: ResultSetDataBuilder;
} => {
  const rdb1 = createBuilder([
    { id: 1, val: "a" },
    { id: 2, val: "b" },
    { id: 3, val: "c" },
  ]);
  rdb1.updateMeta({ compareKeys: [primaryCompareKey] });

  const rdb2 = createBuilder([
    { id: 1, val: "a" },
    { id: 2, val: "B" },
    { id: 4, val: "d" },
  ]);
  rdb2.updateMeta({ compareKeys: [primaryCompareKey] });

  return { rdb1, rdb2 };
};

describe("ResourceHelper", () => {
  describe.each([
    ["diff", diff],
    ["diffToUndoChanges", diffToUndoChanges],
  ] as const)("%s", (_name, fn) => {
    it("returns an error when compareKeys is missing", () => {
      const rdb1 = createBuilder([{ id: 1, val: "a" }]);
      const rdb2 = createBuilder([{ id: 1, val: "a" }]);

      const result = fn(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(false);
      expect(result.message).toBe("Missing compare key (Primary or uniq key).");
    });

    it("returns an error when the compare key type is not supported", () => {
      const rdb1 = new ResultSetDataBuilder([
        createRdhKey({ name: "id", type: GeneralColumnType.BLOB }),
        createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
      ]);
      rdb1.addRow({ id: Buffer.from([1]), val: "a" });
      rdb1.updateMeta({
        compareKeys: [{ kind: "primary", names: ["id"] }],
      });
      const rdb2 = ResultSetDataBuilder.from(rdb1);

      const result = fn(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(false);
      expect(result.message).toMatch(/^Not supported compare keys/);
    });

    it('reports "No changes" when both sides are identical', () => {
      const rdb1 = createBuilder([{ id: 1, val: "a" }]);
      rdb1.updateMeta({ compareKeys: [primaryCompareKey] });
      const rdb2 = createBuilder([{ id: 1, val: "a" }]);
      rdb2.updateMeta({ compareKeys: [primaryCompareKey] });

      const result = fn(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.message).toBe("No changes");
    });
  });

  describe("diff", () => {
    it("detects updated/deleted/inserted rows and annotates the source rdh", () => {
      const { rdb1, rdb2 } = createMixedPair();

      const result = diff(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.updated).toBe(1);
      expect(result.updatedColumns).toBe(1);
      expect(result.deleted).toBe(1);
      expect(result.inserted).toBe(1);

      const row1_2 = findRow(rdb1, 2);
      const updAnno = RowHelper.getFirstAnnotationOf(row1_2, "val", "Upd");
      expect(updAnno?.values?.otherValue).toBe("B");

      const row1_3 = findRow(rdb1, 3);
      expect(RowHelper.hasAnnotation(row1_3, "Del")).toBe(true);

      const row2_4 = findRow(rdb2, 4);
      expect(RowHelper.hasAnnotation(row2_4, "Add")).toBe(true);
    });
  });

  describe("asyncDiff", () => {
    it("produces the same counts as the sync diff", async () => {
      const { rdb1, rdb2 } = createMixedPair();

      const result = await asyncDiff(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.updated).toBe(1);
      expect(result.updatedColumns).toBe(1);
      expect(result.deleted).toBe(1);
      expect(result.inserted).toBe(1);

      const row1_2 = findRow(rdb1, 2);
      const updAnno = RowHelper.getFirstAnnotationOf(row1_2, "val", "Upd");
      expect(updAnno?.values?.otherValue).toBe("B");
    });

    it("stops early and reports Cancelled when the cancel token is set", async () => {
      const { rdb1, rdb2 } = createMixedPair();

      const result = await asyncDiff(rdb1.rs, rdb2.rs, {
        isCancellationRequested: true,
      });

      expect(result.ok).toBe(false);
      expect(result.message).toBe("Cancelled.");
    });

    it("actually yields to the event loop during the scan, not only after it finishes", async () => {
      // 1000行ごとに await setImmediate() する実装なので、3000行あれば
      // i=0,1000,2000 で計3回yieldするはず。その間に、別途スケジュールした
      // setImmediateが挟み込まれるかどうかで「本当にyieldしているか」を検証する。
      const rowCount = 3000;
      const rdb1 = new ResultSetDataBuilder([
        createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
        createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
      ]);
      for (let i = 0; i < rowCount; i++) {
        rdb1.addRow({ id: i, val: "a" });
      }
      rdb1.updateMeta({ compareKeys: [primaryCompareKey] });
      const rdb2 = createBuilder([]);
      rdb2.updateMeta({ compareKeys: [primaryCompareKey] });

      let ticks = 0;
      let scheduling = true;
      const scheduleTick = (): void => {
        if (!scheduling) return;
        setImmediate(() => {
          ticks++;
          scheduleTick();
        });
      };
      scheduleTick();

      await asyncDiff(rdb1.rs, rdb2.rs);
      scheduling = false;

      // 完全に同期的に3000行を回しきってから初めてawaitするような実装なら、
      // このtickerは1回も(あるいはほぼ)割り込めずticksは0のままになるはず。
      expect(ticks).toBeGreaterThanOrEqual(2);
    });
  });

  describe("diffToUndoChanges", () => {
    it("builds toBeUpdated/toBeInserted/toBeDeleted from the diff", () => {
      const { rdb1, rdb2 } = createMixedPair();

      const result = diffToUndoChanges(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.toBeUpdated).toEqual([
        { conditions: { id: 2 }, values: { val: "b" } },
      ]);
      expect(result.toBeInserted).toEqual([
        { values: { id: 3, val: "c" } },
      ]);
      expect(result.toBeDeleted).toEqual([{ conditions: { id: 4 } }]);
    });
  });
});
