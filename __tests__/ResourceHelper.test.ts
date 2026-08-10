import {
  CompareKey,
  GeneralColumnType,
  RdhRow,
  ResultSetData,
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

const findRow = (rdh: ResultSetData, id: number): RdhRow => {
  const row = rdh.rows.find((r) => r.values.id === id);
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

/** id(PK, INTEGER)とv(DOUBLE_PRECISION)を持つペアを、vの値だけ変えて作る。 */
const createNumericPair = (
  v1: number,
  v2: number
): { rdb1: ResultSetDataBuilder; rdb2: ResultSetDataBuilder } => {
  const keys = [
    createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
    createRdhKey({ name: "v", type: GeneralColumnType.DOUBLE_PRECISION }),
  ];
  const rdb1 = new ResultSetDataBuilder(keys);
  rdb1.addRow({ id: 1, v: v1 });
  rdb1.updateMeta({ compareKeys: [primaryCompareKey] });

  const rdb2 = new ResultSetDataBuilder(keys);
  rdb2.addRow({ id: 1, v: v2 });
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
    it("detects updated/deleted/inserted rows and annotates a returned clone, not the source rdh", () => {
      const { rdb1, rdb2 } = createMixedPair();
      const before1 = ResultSetDataBuilder.from(rdb1).build();
      const before2 = ResultSetDataBuilder.from(rdb2).build();

      const result = diff(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.updated).toBe(1);
      expect(result.updatedColumns).toBe(1);
      expect(result.deleted).toBe(1);
      expect(result.inserted).toBe(1);

      const row1_2 = findRow(result.rdh1!, 2);
      const updAnno = RowHelper.getFirstAnnotationOf(row1_2, "val", "Upd");
      expect(updAnno?.values?.otherValue).toBe("B");

      const row1_3 = findRow(result.rdh1!, 3);
      expect(RowHelper.hasAnnotation(row1_3, "Del")).toBe(true);

      const row2_4 = findRow(result.rdh2!, 4);
      expect(RowHelper.hasAnnotation(row2_4, "Add")).toBe(true);

      // 引数rdh1/rdh2そのものは一切変更されない(非破壊)
      expect(rdb1.rs).toEqual(before1);
      expect(rdb2.rs).toEqual(before2);
    });

    it("does not accumulate stale Upd/Del/Add when diffing an already-annotated input", () => {
      const { rdb1, rdb2 } = createMixedPair();

      const first = diff(rdb1.rs, rdb2.rs);
      expect(first.ok).toBe(true);

      // 1回目の出力(アノテーション付き)を、2回目の入力としてそのまま使い回す
      // (db-notebookが「前回のdiff結果」を次回の比較対象として再利用する運用を想定)
      const second = diff(first.rdh1!, first.rdh2!);

      expect(second.ok).toBe(true);
      expect(second.updated).toBe(1);
      expect(second.deleted).toBe(1);
      expect(second.inserted).toBe(1);

      const row1_2 = findRow(second.rdh1!, 2);
      expect(RowHelper.filterAnnotationByKeyOf(row1_2, "val", "Upd")).toHaveLength(1);

      const row1_3 = findRow(second.rdh1!, 3);
      expect(RowHelper.filterAnnotationByKeyOf(row1_3, "val", "Del")).toHaveLength(1);

      const row2_4 = findRow(second.rdh2!, 4);
      expect(RowHelper.filterAnnotationByKeyOf(row2_4, "val", "Add")).toHaveLength(1);
    });
  });

  describe("asyncDiff", () => {
    it("produces the same counts as the sync diff without mutating the source rdh", async () => {
      const { rdb1, rdb2 } = createMixedPair();
      const before1 = ResultSetDataBuilder.from(rdb1).build();
      const before2 = ResultSetDataBuilder.from(rdb2).build();

      const result = await asyncDiff(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.updated).toBe(1);
      expect(result.updatedColumns).toBe(1);
      expect(result.deleted).toBe(1);
      expect(result.inserted).toBe(1);

      const row1_2 = findRow(result.rdh1!, 2);
      const updAnno = RowHelper.getFirstAnnotationOf(row1_2, "val", "Upd");
      expect(updAnno?.values?.otherValue).toBe("B");

      expect(rdb1.rs).toEqual(before1);
      expect(rdb2.rs).toEqual(before2);
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
    it("builds toBeUpdated/toBeInserted/toBeDeleted from the diff without mutating the source rdh", () => {
      const { rdb1, rdb2 } = createMixedPair();
      const before1 = ResultSetDataBuilder.from(rdb1).build();
      const before2 = ResultSetDataBuilder.from(rdb2).build();

      const result = diffToUndoChanges(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.toBeUpdated).toEqual([
        { conditions: { id: 2 }, values: { val: "b" } },
      ]);
      expect(result.toBeInserted).toEqual([
        { values: { id: 3, val: "c" } },
      ]);
      expect(result.toBeDeleted).toEqual([{ conditions: { id: 4 } }]);

      expect(rdb1.rs).toEqual(before1);
      expect(rdb2.rs).toEqual(before2);
    });

    it("strips notSupportedKeyNames columns in the output without mutating rdh1.values", () => {
      const keys = [
        createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
        createRdhKey({ name: "payload", type: GeneralColumnType.BLOB }),
      ];
      const rdb1 = new ResultSetDataBuilder(keys);
      rdb1.addRow({ id: 1, payload: Buffer.from([1]) });
      rdb1.addRow({ id: 2, payload: Buffer.from([2]) }); // rdh2に存在しない = removed
      rdb1.updateMeta({ compareKeys: [primaryCompareKey] });

      const rdb2 = new ResultSetDataBuilder(keys);
      rdb2.addRow({ id: 1, payload: Buffer.from([1]) });
      rdb2.updateMeta({ compareKeys: [primaryCompareKey] });

      const before1 = ResultSetDataBuilder.from(rdb1).build();

      const result = diffToUndoChanges(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      // 出力側では、diff非対応型(payload)のカラムは除去される(従来通りの挙動)
      expect(result.toBeInserted).toEqual([{ values: { id: 2 } }]);

      // 一方、引数rdh1自身のvaluesからpayloadが消えてはいけない(非破壊)
      expect(rdb1.rs).toEqual(before1);
      const row1_2 = rdb1.rs.rows.find((r) => r.values.id === 2);
      expect(row1_2?.values.payload).toEqual(Buffer.from([2]));
    });
  });

  // resolveDiffContextが内部でResultSetDataBuilder.from()によるクローンを比較・
  // 戻り値の両方に使うため、そのクローンがNaN/Infinity/-0等を破壊すると、実際には
  // 変更があるのに「変更なし」と誤判定してしまう(ResultSetDataBuilder.from側の
  // 修正で解消される問題への回帰テスト)。
  describe("special numeric values (NaN/Infinity/-0)", () => {
    it("detects Infinity -> null as an update", () => {
      const { rdb1, rdb2 } = createNumericPair(Infinity, null as any);
      const result = diff(rdb1.rs, rdb2.rs);
      expect(result.updated).toBe(1);

      const row1 = findRow(result.rdh1!, 1);
      expect(row1.values.v).toBe(Infinity);
      const updAnno = RowHelper.getFirstAnnotationOf(row1, "v", "Upd");
      expect(updAnno?.values?.otherValue).toBe(null);

      const row2 = findRow(result.rdh2!, 1);
      expect(row2.values.v).toBe(null);
    });

    it("detects Infinity -> -Infinity as an update", () => {
      const { rdb1, rdb2 } = createNumericPair(Infinity, -Infinity);
      const result = diff(rdb1.rs, rdb2.rs);
      expect(result.updated).toBe(1);
      expect(findRow(result.rdh1!, 1).values.v).toBe(Infinity);
      expect(findRow(result.rdh2!, 1).values.v).toBe(-Infinity);
    });

    it("detects NaN -> null as an update", () => {
      const { rdb1, rdb2 } = createNumericPair(NaN, null as any);
      const result = diff(rdb1.rs, rdb2.rs);
      expect(result.updated).toBe(1);
      expect(Number.isNaN(findRow(result.rdh1!, 1).values.v)).toBe(true);
    });

    it("asyncDiff agrees with the sync diff for special numeric values", async () => {
      const { rdb1, rdb2 } = createNumericPair(Infinity, -Infinity);
      const result = await asyncDiff(rdb1.rs, rdb2.rs);
      expect(result.updated).toBe(1);
      expect(findRow(result.rdh1!, 1).values.v).toBe(Infinity);
      expect(findRow(result.rdh2!, 1).values.v).toBe(-Infinity);
    });

    it("diffToUndoChanges keeps special numeric values in toBeUpdated without mutating the inputs", () => {
      const { rdb1, rdb2 } = createNumericPair(Infinity, -Infinity);
      const before1 = ResultSetDataBuilder.from(rdb1).build();
      const before2 = ResultSetDataBuilder.from(rdb2).build();

      const result = diffToUndoChanges(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(result.toBeUpdated).toEqual([
        { conditions: { id: 1 }, values: { v: Infinity } },
      ]);
      expect(rdb1.rs).toEqual(before1);
      expect(rdb2.rs).toEqual(before2);
    });
  });
});
