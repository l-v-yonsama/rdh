/**
 * diff() / asyncDiff() / diffToUndoChanges() の行突合ロジックに関する回帰テスト。
 *
 * misc/full-review-remediation-plan-2026-08-13.md のPhase 1/Phase 2に対応する。
 * 特に4.7(比較キーの衝突)は、修正前は誤って「同じ行」に突合されてしまう
 * ケースを網羅する最重要項目。
 */
import {
  CompareKey,
  DiffResult,
  DiffToUndoChangesResult,
  GeneralColumnType,
  RdhKey,
  RdhRow,
  ResultSetData,
  ResultSetDataBuilder,
  RowHelper,
  asyncDiff,
  createRdhKey,
  diff,
  diffToUndoChanges,
} from "../src";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const idValKeys: RdhKey[] = [
  createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
  createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
];

const primaryCompareKey: CompareKey = { kind: "primary", names: ["id"] };

function buildRdb(
  keys: RdhKey[],
  rows: Record<string, any>[],
  compareKeys: CompareKey[]
): ResultSetDataBuilder {
  const rdb = new ResultSetDataBuilder(keys);
  rows.forEach((row) => rdb.addRow(row));
  rdb.updateMeta({ compareKeys });
  return rdb;
}

function findRow(rdh: ResultSetData, id: number): RdhRow {
  const row = rdh.rows.find((r) => r.values.id === id);
  if (!row) {
    throw new Error(`row not found: id=${id}`);
  }
  return row;
}

type Counts = { updated: number; inserted: number; deleted: number };

function normalizeCounts(
  fnName: string,
  result: DiffResult | DiffToUndoChangesResult
): Counts {
  if (fnName === "diffToUndoChanges") {
    // diffToUndoChangesはrdh2をrdh1へ戻す操作を返すため、意味が反転する:
    // - rdh1にしかない行(diffでいう"deleted") -> 復元のためtoBeInsertedに入る
    // - rdh2にしかない行(diffでいう"inserted") -> 取り消しのためtoBeDeletedに入る
    const r = result as DiffToUndoChangesResult;
    return {
      updated: r.toBeUpdated.length,
      inserted: r.toBeDeleted.length,
      deleted: r.toBeInserted.length,
    };
  }
  const r = result as DiffResult;
  return { updated: r.updated, inserted: r.inserted, deleted: r.deleted };
}

/** diff/asyncDiff/diffToUndoChangesを同一シグネチャで呼べるようにしたもの。 */
const runners: [
  string,
  (a: ResultSetData, b: ResultSetData) => Promise<DiffResult | DiffToUndoChangesResult> | (DiffResult | DiffToUndoChangesResult),
][] = [
  ["diff", (a, b) => diff(a, b)],
  ["asyncDiff", (a, b) => asyncDiff(a, b)],
  ["diffToUndoChanges", (a, b) => diffToUndoChanges(a, b)],
];

// ---------------------------------------------------------------------------
// 4.6 基本動作(3関数で共通化したテーブル駆動テスト)
// ---------------------------------------------------------------------------

describe("4.6 basic matching (shared across diff/asyncDiff/diffToUndoChanges)", () => {
  const cases: [
    string,
    { id: number; val: string | null }[],
    { id: number; val: string | null }[],
    Counts,
  ][] = [
    ["no changes", [{ id: 1, val: "a" }], [{ id: 1, val: "a" }], { updated: 0, inserted: 0, deleted: 0 }],
    ["update only", [{ id: 1, val: "a" }], [{ id: 1, val: "b" }], { updated: 1, inserted: 0, deleted: 0 }],
    [
      "insert only",
      [{ id: 1, val: "a" }],
      [{ id: 1, val: "a" }, { id: 2, val: "b" }],
      { updated: 0, inserted: 1, deleted: 0 },
    ],
    [
      "delete only",
      [{ id: 1, val: "a" }, { id: 2, val: "b" }],
      [{ id: 1, val: "a" }],
      { updated: 0, inserted: 0, deleted: 1 },
    ],
    [
      "update + insert + delete mixed",
      [{ id: 1, val: "a" }, { id: 2, val: "b" }, { id: 3, val: "c" }],
      [{ id: 1, val: "a" }, { id: 2, val: "B" }, { id: 4, val: "d" }],
      { updated: 1, inserted: 1, deleted: 1 },
    ],
    ["both sides empty", [], [], { updated: 0, inserted: 0, deleted: 0 }],
    ["left side empty", [], [{ id: 1, val: "a" }], { updated: 0, inserted: 1, deleted: 0 }],
    ["right side empty", [{ id: 1, val: "a" }], [], { updated: 0, inserted: 0, deleted: 1 }],
    [
      "row order differs between sides",
      [{ id: 2, val: "b" }, { id: 1, val: "a" }],
      [{ id: 1, val: "a" }, { id: 2, val: "b" }],
      { updated: 0, inserted: 0, deleted: 0 },
    ],
    [
      "all non-key columns null on both sides",
      [{ id: 1, val: null }],
      [{ id: 1, val: null }],
      { updated: 0, inserted: 0, deleted: 0 },
    ],
    [
      "null changing to a value is an update",
      [{ id: 1, val: null }],
      [{ id: 1, val: "x" }],
      { updated: 1, inserted: 0, deleted: 0 },
    ],
  ];

  describe.each(runners)("%s", (name, fn) => {
    it.each(cases)("%s", async (_label, rows1, rows2, expected) => {
      const rdb1 = buildRdb(idValKeys, rows1, [primaryCompareKey]);
      const rdb2 = buildRdb(idValKeys, rows2, [primaryCompareKey]);

      const result = await fn(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(true);
      expect(normalizeCounts(name, result)).toEqual(expected);
    });
  });

  it("ignores non-key columns that are unrelated to the change (compare key + many columns)", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "c1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "c2", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "c3", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "c4", type: GeneralColumnType.BOOLEAN }),
    ];
    const rdb1 = buildRdb(
      keys,
      [{ id: 1, c1: "a", c2: "b", c3: 1, c4: true }],
      [primaryCompareKey]
    );
    const rdb2 = buildRdb(
      keys,
      [{ id: 1, c1: "a", c2: "CHANGED", c3: 1, c4: true }],
      [primaryCompareKey]
    );

    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.updated).toBe(1);
    expect(result.updatedColumns).toBe(1);
    const row1 = findRow(result.rdh1!, 1);
    expect(RowHelper.getFirstAnnotationOf(row1, "c2", "Upd")).toBeDefined();
    expect(RowHelper.getFirstAnnotationOf(row1, "c1", "Upd")).toBeUndefined();
    expect(RowHelper.getFirstAnnotationOf(row1, "c3", "Upd")).toBeUndefined();
    expect(RowHelper.getFirstAnnotationOf(row1, "c4", "Upd")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 4.7 比較キーの衝突回帰テスト(最重要)
// ---------------------------------------------------------------------------

describe("4.7 compare key collision regression", () => {
  const singleKeyDef: RdhKey[] = [
    createRdhKey({ name: "k", type: GeneralColumnType.TEXT }),
    createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
  ];
  const singleKey: CompareKey = { kind: "primary", names: ["k"] };

  function expectDistinctRows(
    rdb1: ResultSetDataBuilder,
    rdb2: ResultSetDataBuilder
  ): DiffResult {
    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(true);
    expect(result.deleted).toBe(1);
    expect(result.inserted).toBe(1);
    expect(result.updated).toBe(0);
    expect(RowHelper.hasAnnotation(result.rdh1!.rows[0], "Del")).toBe(true);
    expect(RowHelper.hasAnnotation(result.rdh2!.rows[0], "Add")).toBe(true);
    return result;
  }

  function expectSameRow(rdb1: ResultSetDataBuilder, rdb2: ResultSetDataBuilder): DiffResult {
    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(true);
    expect(result.deleted).toBe(0);
    expect(result.inserted).toBe(0);
    return result;
  }

  it("treats null and empty string as different rows", () => {
    const rdb1 = buildRdb(singleKeyDef, [{ k: null, val: "a" }], [singleKey]);
    const rdb2 = buildRdb(singleKeyDef, [{ k: "", val: "a" }], [singleKey]);
    expectDistinctRows(rdb1, rdb2);
  });

  it("treats undefined and empty string as different rows", () => {
    const rdb1 = buildRdb(singleKeyDef, [{ val: "a" }], [singleKey]); // k omitted -> undefined
    const rdb2 = buildRdb(singleKeyDef, [{ k: "", val: "a" }], [singleKey]);
    expectDistinctRows(rdb1, rdb2);
  });

  it("treats null and undefined as different rows", () => {
    const rdb1 = buildRdb(singleKeyDef, [{ k: null, val: "a" }], [singleKey]);
    const rdb2 = buildRdb(singleKeyDef, [{ val: "a" }], [singleKey]); // k omitted -> undefined
    expectDistinctRows(rdb1, rdb2);
  });

  it("treats numeric 1 and string \"1\" as different rows", () => {
    const rdb1 = buildRdb(singleKeyDef, [{ k: 1, val: "a" }], [singleKey]);
    const rdb2 = buildRdb(singleKeyDef, [{ k: "1", val: "a" }], [singleKey]);
    expectDistinctRows(rdb1, rdb2);
  });

  it('treats ("x|:|y","z") and ("x","y|:|z") as different composite keys', () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "k2", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k1", "k2"] };
    const rdb1 = buildRdb(keys, [{ k1: "x|:|y", k2: "z", val: "a" }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ k1: "x", k2: "y|:|z", val: "a" }], [compareKey]);
    expectDistinctRows(rdb1, rdb2);
  });

  it("does not confuse values that look like the internal key encoding format", () => {
    // エンコード後の内部表現("<型タグ>:<内容>")と紛らわしい文字列でも、
    // 実際の型(string)と数値100(type)を混同しない。
    const rdb1 = buildRdb(singleKeyDef, [{ k: "4:100", val: "a" }], [singleKey]);
    const rdb2 = buildRdb(singleKeyDef, [{ k: 100, val: "a" }], [singleKey]);
    expectDistinctRows(rdb1, rdb2);
  });

  it("treats an empty-string key component as distinct from a non-empty one at another position", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "k2", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k1", "k2"] };
    const rdb1 = buildRdb(keys, [{ k1: "", k2: "x", val: "a" }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ k1: "y", k2: "", val: "a" }], [compareKey]);
    expectDistinctRows(rdb1, rdb2);
  });

  it("still matches rows whose composite key legitimately contains an empty string on both sides", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "k2", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k1", "k2"] };
    const rdb1 = buildRdb(keys, [{ k1: "", k2: "x", val: "a" }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ k1: "", k2: "x", val: "b" }], [compareKey]);
    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.updated).toBe(1);
    expect(result.deleted).toBe(0);
    expect(result.inserted).toBe(0);
  });

  it("matches Date keys with the same instant and separates different instants", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k", type: GeneralColumnType.TIMESTAMP }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k"] };

    const same1 = buildRdb(keys, [{ k: new Date("2024-01-01T00:00:00.000Z"), val: "a" }], [compareKey]);
    const same2 = buildRdb(keys, [{ k: new Date("2024-01-01T00:00:00.000Z"), val: "b" }], [compareKey]);
    const sameResult = diff(same1.rs, same2.rs);
    expect(sameResult.updated).toBe(1);
    expect(sameResult.deleted).toBe(0);
    expect(sameResult.inserted).toBe(0);

    const diff1 = buildRdb(keys, [{ k: new Date("2024-01-01T00:00:00.000Z"), val: "a" }], [compareKey]);
    const diff2 = buildRdb(keys, [{ k: new Date("2024-01-02T00:00:00.000Z"), val: "a" }], [compareKey]);
    expectDistinctRows(diff1, diff2);
  });

  it("supports BigInt compare keys and distinguishes them from equal-looking numbers", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k", type: GeneralColumnType.BIGINT }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k"] };

    const matched1 = buildRdb(keys, [{ k: BigInt(123), val: "a" }], [compareKey]);
    const matched2 = buildRdb(keys, [{ k: BigInt(123), val: "b" }], [compareKey]);
    const matchedResult = diff(matched1.rs, matched2.rs);
    expect(matchedResult.updated).toBe(1);
    expect(matchedResult.deleted).toBe(0);
    expect(matchedResult.inserted).toBe(0);

    const differentBigints1 = buildRdb(keys, [{ k: BigInt(123), val: "a" }], [compareKey]);
    const differentBigints2 = buildRdb(keys, [{ k: BigInt(456), val: "a" }], [compareKey]);
    expectDistinctRows(differentBigints1, differentBigints2);

    // bigint 123n と number 123 は型が異なるため別行として扱う
    const crossType1 = buildRdb(keys, [{ k: BigInt(123), val: "a" }], [compareKey]);
    const crossType2 = buildRdb(keys, [{ k: 123, val: "a" }], [compareKey]);
    expectDistinctRows(crossType1, crossType2);
  });

  describe("NaN / Infinity / -Infinity / -0 semantics", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k", type: GeneralColumnType.DOUBLE_PRECISION }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k"] };

    it("NaN matches NaN (SameValueZero) instead of being treated as delete+insert", () => {
      const rdb1 = buildRdb(keys, [{ k: NaN, val: "a" }], [compareKey]);
      const rdb2 = buildRdb(keys, [{ k: NaN, val: "b" }], [compareKey]);
      const result = expectSameRow(rdb1, rdb2);
      expect(result.updated).toBe(1);
    });

    it("Infinity matches Infinity, and does not match -Infinity", () => {
      const rdb1 = buildRdb(keys, [{ k: Infinity, val: "a" }], [compareKey]);
      const rdb2 = buildRdb(keys, [{ k: Infinity, val: "b" }], [compareKey]);
      const result = expectSameRow(rdb1, rdb2);
      expect(result.updated).toBe(1);

      const other1 = buildRdb(keys, [{ k: Infinity, val: "a" }], [compareKey]);
      const other2 = buildRdb(keys, [{ k: -Infinity, val: "a" }], [compareKey]);
      expectDistinctRows(other1, other2);
    });

    it("-0 matches 0 (SameValueZero, consistent with native Map/Set key semantics)", () => {
      const rdb1 = buildRdb(keys, [{ k: -0, val: "a" }], [compareKey]);
      const rdb2 = buildRdb(keys, [{ k: 0, val: "b" }], [compareKey]);
      const result = expectSameRow(rdb1, rdb2);
      expect(result.updated).toBe(1);
    });

    it("NaN does not match an ordinary number", () => {
      const rdb1 = buildRdb(keys, [{ k: NaN, val: "a" }], [compareKey]);
      const rdb2 = buildRdb(keys, [{ k: 1, val: "a" }], [compareKey]);
      expectDistinctRows(rdb1, rdb2);
    });
  });

  it("matches only when all columns of a 3+ column composite key are equal", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "k2", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "k3", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k1", "k2", "k3"] };

    const rdb1 = buildRdb(keys, [{ k1: "a", k2: 1, k3: "x", val: "orig" }], [compareKey]);
    const rdb2same = buildRdb(keys, [{ k1: "a", k2: 1, k3: "x", val: "changed" }], [compareKey]);
    const sameResult = diff(rdb1.rs, rdb2same.rs);
    expect(sameResult.updated).toBe(1);
    expect(sameResult.deleted).toBe(0);
    expect(sameResult.inserted).toBe(0);

    // k3だけが異なる -> 別の行として扱われる(削除+追加)
    const rdb2diff = buildRdb(keys, [{ k1: "a", k2: 1, k3: "y", val: "orig" }], [compareKey]);
    expectDistinctRows(
      buildRdb(keys, [{ k1: "a", k2: 1, k3: "x", val: "orig" }], [compareKey]),
      rdb2diff
    );
  });

  it("handles unicode, newline, and NUL characters in string keys", () => {
    const weirdKey = "こんにちは\n 世界";
    const rdb1 = buildRdb(singleKeyDef, [{ k: weirdKey, val: "a" }], [singleKey]);
    const rdb2 = buildRdb(singleKeyDef, [{ k: weirdKey, val: "b" }], [singleKey]);
    const result = expectSameRow(rdb1, rdb2);
    expect(result.updated).toBe(1);

    const rdb1b = buildRdb(singleKeyDef, [{ k: "a b", val: "a" }], [singleKey]);
    const rdb2b = buildRdb(singleKeyDef, [{ k: "a c", val: "a" }], [singleKey]);
    expectDistinctRows(rdb1b, rdb2b);
  });
});

// ---------------------------------------------------------------------------
// 4.1 / 4.5 compare keyの型制約・重複キー
// ---------------------------------------------------------------------------

describe("compare key type restrictions", () => {
  it("rejects a JSON-typed compare key column", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.JSON }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const rdb1 = buildRdb(keys, [{ id: { a: 1 }, val: "a" }], [{ kind: "primary", names: ["id"] }]);
    const rdb2 = buildRdb(keys, [{ id: { a: 1 }, val: "b" }], [{ kind: "primary", names: ["id"] }]);

    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/^Not supported compare keys/);
  });

  it("rejects an ARRAY-typed compare key column", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.ARRAY }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const rdb1 = buildRdb(keys, [{ id: [1, 2], val: "a" }], [{ kind: "primary", names: ["id"] }]);
    const rdb2 = buildRdb(keys, [{ id: [1, 2], val: "b" }], [{ kind: "primary", names: ["id"] }]);

    const result = diffToUndoChanges(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/^Not supported compare keys/);
  });

  it("allows an ENUM-typed compare key column (single scalar value, unlike SET types)", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.ENUM }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const rdb1 = buildRdb(keys, [{ id: "ACTIVE", val: "a" }], [{ kind: "primary", names: ["id"] }]);
    const rdb2 = buildRdb(keys, [{ id: "ACTIVE", val: "b" }], [{ kind: "primary", names: ["id"] }]);

    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(true);
    expect(result.updated).toBe(1);
  });
});

describe("4.5 duplicate compare key handling", () => {
  const longValue = "x".repeat(500);

  describe.each(runners)("%s", (_name, fn) => {
    it("fails with ok:false when rdh1 has duplicate compare key values, without leaking the value", async () => {
      const rdb1 = buildRdb(
        idValKeys,
        [{ id: 1, val: longValue }, { id: 1, val: "other" }],
        [primaryCompareKey]
      );
      const rdb2 = buildRdb(idValKeys, [{ id: 1, val: "a" }], [primaryCompareKey]);
      const before1 = ResultSetDataBuilder.from(rdb1).build();
      const before2 = ResultSetDataBuilder.from(rdb2).build();

      const result = await fn(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(false);
      expect(result.message).toMatch(/rdh1/);
      expect(result.message).not.toContain(longValue);

      // 重複検出時も非破壊(4.9)
      expect(rdb1.rs).toEqual(before1);
      expect(rdb2.rs).toEqual(before2);
    });

    it("fails with ok:false when rdh2 has duplicate compare key values, without leaking the value", async () => {
      const rdb1 = buildRdb(idValKeys, [{ id: 1, val: "a" }], [primaryCompareKey]);
      const rdb2 = buildRdb(
        idValKeys,
        [{ id: 1, val: longValue }, { id: 1, val: "other" }],
        [primaryCompareKey]
      );

      const result = await fn(rdb1.rs, rdb2.rs);

      expect(result.ok).toBe(false);
      expect(result.message).toMatch(/rdh2/);
      expect(result.message).not.toContain(longValue);
    });
  });
});

// ---------------------------------------------------------------------------
// 4.8 アノテーションのテスト
// ---------------------------------------------------------------------------

describe("4.8 annotations", () => {
  it("preserves existing Cod/Rul/Lnt/Stl/Fil annotations while adding Upd", () => {
    const rdb1 = buildRdb(idValKeys, [{ id: 1, val: "a" }], [primaryCompareKey]);
    const rdb2 = buildRdb(idValKeys, [{ id: 1, val: "b" }], [primaryCompareKey]);

    const row1 = rdb1.rs.rows[0];
    RowHelper.pushAnnotation(row1, "val", {
      type: "Cod",
      values: { label: "Label", isUndefined: false },
    });
    RowHelper.pushAnnotation(row1, "val", {
      type: "Rul",
      values: { name: "r1", message: "m", conditionValues: {} },
    });
    RowHelper.pushAnnotation(row1, "val", {
      type: "Lnt",
      values: { ruleId: "l1", message: "m", fix: "f" },
    });
    RowHelper.pushAnnotation(row1, "val", { type: "Stl", values: { b: "#fff" } });
    RowHelper.pushAnnotation(row1, "val", {
      type: "Fil",
      values: {
        name: "a.txt",
        size: 1,
        lastModified: new Date("2024-01-01"),
        contentTypeInfo: {
          contentType: "text/plain",
          isTextValue: true,
          renderType: "Text",
          fileName: "a.txt",
        },
      },
    });

    const result = diff(rdb1.rs, rdb2.rs);
    const outRow1 = findRow(result.rdh1!, 1);

    expect(RowHelper.getFirstAnnotationOf(outRow1, "val", "Upd")).toBeDefined();
    expect(RowHelper.getFirstAnnotationOf(outRow1, "val", "Cod")).toBeDefined();
    expect(RowHelper.getFirstAnnotationOf(outRow1, "val", "Rul")).toBeDefined();
    expect(RowHelper.getFirstAnnotationOf(outRow1, "val", "Lnt")).toBeDefined();
    expect(RowHelper.getFirstAnnotationOf(outRow1, "val", "Stl")).toBeDefined();
    expect(RowHelper.getFirstAnnotationOf(outRow1, "val", "Fil")).toBeDefined();
  });

  it("annotates Del on every supported column of a removed row and Add on every column of an inserted row", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "c1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "c2", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["id"] };
    const rdb1 = buildRdb(keys, [{ id: 1, c1: "a", c2: "b" }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ id: 2, c1: "x", c2: "y" }], [compareKey]);

    const result = diff(rdb1.rs, rdb2.rs);
    const removed = findRow(result.rdh1!, 1);
    expect(RowHelper.filterAnnotationByKeyOf(removed, "id", "Del")).toHaveLength(1);
    expect(RowHelper.filterAnnotationByKeyOf(removed, "c1", "Del")).toHaveLength(1);
    expect(RowHelper.filterAnnotationByKeyOf(removed, "c2", "Del")).toHaveLength(1);

    const inserted = findRow(result.rdh2!, 2);
    expect(RowHelper.filterAnnotationByKeyOf(inserted, "id", "Add")).toHaveLength(1);
    expect(RowHelper.filterAnnotationByKeyOf(inserted, "c1", "Add")).toHaveLength(1);
    expect(RowHelper.filterAnnotationByKeyOf(inserted, "c2", "Add")).toHaveLength(1);
  });

  it("reports correct updated/updatedColumns counts when multiple columns change on multiple rows", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "c1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "c2", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["id"] };
    const rdb1 = buildRdb(
      keys,
      [{ id: 1, c1: "a", c2: "b" }, { id: 2, c1: "a", c2: "b" }],
      [compareKey]
    );
    const rdb2 = buildRdb(
      keys,
      [{ id: 1, c1: "A", c2: "B" }, { id: 2, c1: "a", c2: "B" }],
      [compareKey]
    );

    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.updated).toBe(2);
    expect(result.updatedColumns).toBe(3); // row1: c1,c2 / row2: c2
  });
});

// ---------------------------------------------------------------------------
// 4.9 非破壊性のテスト
// ---------------------------------------------------------------------------

describe("4.9 non-destructive guarantees", () => {
  it("leaves inputs untouched when the compare key error path is taken", () => {
    const rdb1 = buildRdb(idValKeys, [{ id: 1, val: "a" }], []); // compareKeysなし
    const rdb2 = buildRdb(idValKeys, [{ id: 1, val: "a" }], []);
    const before1 = ResultSetDataBuilder.from(rdb1).build();
    const before2 = ResultSetDataBuilder.from(rdb2).build();

    const result = diff(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(false);
    expect(rdb1.rs).toEqual(before1);
    expect(rdb2.rs).toEqual(before2);
  });

  it("leaves inputs untouched when the unsupported compare key type error path is taken", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.JSON }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const rdb1 = buildRdb(keys, [{ id: { a: 1 }, val: "a" }], [{ kind: "primary", names: ["id"] }]);
    const rdb2 = buildRdb(keys, [{ id: { a: 1 }, val: "a" }], [{ kind: "primary", names: ["id"] }]);
    const before1 = ResultSetDataBuilder.from(rdb1).build();

    diff(rdb1.rs, rdb2.rs);
    expect(rdb1.rs).toEqual(before1);
  });

  it("mutating diff()'s returned rows does not affect the source rdh", () => {
    const rdb1 = buildRdb(idValKeys, [{ id: 1, val: "a" }], [primaryCompareKey]);
    const rdb2 = buildRdb(idValKeys, [{ id: 1, val: "b" }], [primaryCompareKey]);

    const result = diff(rdb1.rs, rdb2.rs);
    result.rdh1!.rows[0].values.val = "mutated";
    result.rdh1!.rows[0].meta.val = [];

    expect(rdb1.rs.rows[0].values.val).toBe("a");
  });
});

// ---------------------------------------------------------------------------
// 4.10 asyncDiff固有テスト
// ---------------------------------------------------------------------------

describe("4.10 asyncDiff cancellation", () => {
  /**
   * cancelTokenのisCancellationRequestedを「n回読み取られた後」からtrueに
   * 切り替えるトークンを作る。asyncDiffの実装はcancelTokenを決まった順序
   * (開始直後→クローン後→索引構築中→左側走査中→右側走査中)で読み取る
   * ため、タイマー等に頼らずどの段階でキャンセルされるかを正確に指定できる。
   */
  function cancelAfterChecks(n: number): { isCancellationRequested: boolean } {
    let count = 0;
    return {
      get isCancellationRequested() {
        count++;
        return count > n;
      },
    };
  }

  const rowCount = 50;

  function buildLargePair(): { rdb1: ResultSetDataBuilder; rdb2: ResultSetDataBuilder } {
    const rows1 = [];
    const rows2 = [];
    for (let i = 0; i < rowCount; i++) {
      rows1.push({ id: i, val: `v${i}` });
      rows2.push({ id: i, val: `v${i}` });
    }
    return {
      rdb1: buildRdb(idValKeys, rows1, [primaryCompareKey]),
      rdb2: buildRdb(idValKeys, rows2, [primaryCompareKey]),
    };
  }

  it("cancels before any work starts", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    const result = await asyncDiff(rdb1.rs, rdb2.rs, { isCancellationRequested: true });
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("cancels while building the rdh1 index", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    const before1 = ResultSetDataBuilder.from(rdb1).build();
    // checks: 1=start, 2=post-clone, 3..(2+rowCount)=rdh1 index build
    const token = cancelAfterChecks(2 + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
    expect(rdb1.rs).toEqual(before1);
  });

  it("cancels while building the rdh2 index", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    // checks 3..(2+rowCount) cover rdh1 index build; pick a check well inside
    // the rdh2 index build range that follows.
    const token = cancelAfterChecks(2 + rowCount + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("cancels while scanning rdh1 rows for matches", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    // checks 3..(2+2*rowCount) cover both index builds; the match scan over
    // rows1 starts right after.
    const token = cancelAfterChecks(2 + 2 * rowCount + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("cancels while scanning rdh2 rows for unmatched inserts", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    // both index builds (2*rowCount checks) + matching rows1 (rowCount checks)
    // happen before the rows2 unmatched-scan begins.
    const token = cancelAfterChecks(2 + 3 * rowCount + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("agrees with the sync diff() on a randomized dataset", async () => {
    const rows1 = [];
    const rows2 = [];
    for (let i = 0; i < 733; i++) {
      rows1.push({ id: i, val: `v${i}` });
      if (i % 4 !== 0) {
        rows2.push({ id: i, val: i % 7 === 0 ? `v${i}-changed` : `v${i}` });
      }
    }
    rows2.push({ id: 100000, val: "brand-new" });

    const rdbSync1 = buildRdb(idValKeys, rows1, [primaryCompareKey]);
    const rdbSync2 = buildRdb(idValKeys, rows2, [primaryCompareKey]);
    const syncResult = diff(rdbSync1.rs, rdbSync2.rs);

    const rdbAsync1 = buildRdb(idValKeys, rows1, [primaryCompareKey]);
    const rdbAsync2 = buildRdb(idValKeys, rows2, [primaryCompareKey]);
    const asyncResult = await asyncDiff(rdbAsync1.rs, rdbAsync2.rs);

    expect(asyncResult.ok).toBe(syncResult.ok);
    expect(asyncResult.updated).toBe(syncResult.updated);
    expect(asyncResult.inserted).toBe(syncResult.inserted);
    expect(asyncResult.deleted).toBe(syncResult.deleted);
    expect(asyncResult.updatedColumns).toBe(syncResult.updatedColumns);
    expect(asyncResult.message).toBe(syncResult.message);
  });
});

// ---------------------------------------------------------------------------
// 4.11 diffToUndoChanges固有テスト
// ---------------------------------------------------------------------------

describe("4.11 diffToUndoChanges specifics", () => {
  it("UPDATE conditions contain only the compare key columns, and values contain only changed columns", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "c1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "c2", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "c3", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["id"] };
    const rdb1 = buildRdb(keys, [{ id: 1, c1: "a", c2: "b", c3: "c" }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ id: 1, c1: "a", c2: "CHANGED", c3: "c" }], [compareKey]);

    const result = diffToUndoChanges(rdb1.rs, rdb2.rs);
    expect(result.toBeUpdated).toEqual([
      { conditions: { id: 1 }, values: { c2: "b" } },
    ]);
  });

  it("builds correct composite-key conditions for UPDATE/DELETE", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "k1", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "k2", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k1", "k2"] };
    const rdb1 = buildRdb(keys, [{ k1: "a", k2: 1, val: "orig" }], [compareKey]);
    const rdb2 = buildRdb(
      keys,
      // k1="c",k2=3 の行はrdh1に存在しない = 追加された行 = undoではDELETE対象
      [{ k1: "a", k2: 1, val: "changed" }, { k1: "c", k2: 3, val: "new" }],
      [compareKey]
    );

    const result = diffToUndoChanges(rdb1.rs, rdb2.rs);
    expect(result.toBeUpdated).toEqual([
      { conditions: { k1: "a", k2: 1 }, values: { val: "orig" } },
    ]);
    expect(result.toBeDeleted).toEqual([{ conditions: { k1: "c", k2: 3 } }]);
  });

  it("does not produce a wrong UPDATE when compare keys collide (fails instead)", () => {
    const rdb1 = buildRdb(
      idValKeys,
      [{ id: 1, val: "left-a" }, { id: 1, val: "left-b" }],
      [primaryCompareKey]
    );
    const rdb2 = buildRdb(idValKeys, [{ id: 1, val: "right" }], [primaryCompareKey]);

    const result = diffToUndoChanges(rdb1.rs, rdb2.rs);
    expect(result.ok).toBe(false);
    expect(result.toBeUpdated).toEqual([]);
    expect(result.toBeInserted).toEqual([]);
    expect(result.toBeDeleted).toEqual([]);
  });

  it("keeps Date and BigInt values intact in toBeUpdated.values", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "d", type: GeneralColumnType.TIMESTAMP }),
      createRdhKey({ name: "big", type: GeneralColumnType.BIGINT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["id"] };
    const oldDate = new Date("2024-01-01T00:00:00.000Z");
    const newDate = new Date("2024-06-01T00:00:00.000Z");
    const rdb1 = buildRdb(keys, [{ id: 1, d: oldDate, big: BigInt(111) }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ id: 1, d: newDate, big: BigInt(222) }], [compareKey]);

    const result = diffToUndoChanges(rdb1.rs, rdb2.rs);
    expect(result.toBeUpdated).toHaveLength(1);
    const values = result.toBeUpdated[0].values;
    expect(values.d instanceof Date).toBe(true);
    expect((values.d as Date).getTime()).toBe(oldDate.getTime());
    expect(values.big).toBe(BigInt(111));
  });

  it("does not let mutation of the returned values/conditions affect the source rdh", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["id"] };
    const rdb1 = buildRdb(keys, [{ id: 1, val: "a" }, { id: 2, val: "b" }], [compareKey]);
    const rdb2 = buildRdb(keys, [{ id: 1, val: "changed" }], [compareKey]);
    const before1 = ResultSetDataBuilder.from(rdb1).build();

    const result = diffToUndoChanges(rdb1.rs, rdb2.rs);
    result.toBeUpdated[0].values.val = "mutated-update";
    result.toBeUpdated[0].conditions.id = 999;
    result.toBeInserted[0].values.val = "mutated-insert";

    expect(rdb1.rs).toEqual(before1);
  });
});

// ---------------------------------------------------------------------------
// 4.12 ランダム化・性質テスト
// ---------------------------------------------------------------------------

/** 決定的な擬似乱数生成器(mulberry32)。同じseedなら常に同じ列を生成する。 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type RandomRow = { id: number; val: string };

function buildRandomScenario(
  n: number,
  rnd: () => number
): { rows1: RandomRow[]; rows2: RandomRow[] } {
  const rows1: RandomRow[] = [];
  const rows2: RandomRow[] = [];
  for (let id = 0; id < n; id++) {
    const r = rnd();
    const val1 = `v${id}-orig`;
    if (r < 0.55) {
      // unchanged
      rows1.push({ id, val: val1 });
      rows2.push({ id, val: val1 });
    } else if (r < 0.75) {
      // updated
      rows1.push({ id, val: val1 });
      rows2.push({ id, val: `v${id}-changed-${Math.floor(rnd() * 1000)}` });
    } else if (r < 0.88) {
      // deleted (rdh1のみ)
      rows1.push({ id, val: val1 });
    } else {
      // inserted (rdh2のみ)
      rows2.push({ id, val: `v${id}-new` });
    }
  }
  return { rows1, rows2 };
}

/** rows1/rows2から独立に計算した「素朴な」期待値(本番実装は一切使わない)。 */
function referenceDiffCounts(rows1: RandomRow[], rows2: RandomRow[]): Counts {
  const map1 = new Map(rows1.map((r) => [r.id, r.val]));
  const map2 = new Map(rows2.map((r) => [r.id, r.val]));
  let updated = 0;
  let deleted = 0;
  let inserted = 0;
  for (const [id, val1] of map1) {
    if (!map2.has(id)) {
      deleted++;
    } else if (map2.get(id) !== val1) {
      updated++;
    }
  }
  for (const id of map2.keys()) {
    if (!map1.has(id)) {
      inserted++;
    }
  }
  return { updated, deleted, inserted };
}

describe("4.12 randomized matching against an independent reference implementation", () => {
  const seeds = [1, 2, 3, 4, 5];

  it.each(seeds)("matches a Map-based reference implementation (seed=%i)", async (seed) => {
    const rnd = mulberry32(seed);
    const { rows1, rows2 } = buildRandomScenario(300, rnd);
    const expected = referenceDiffCounts(rows1, rows2);

    const rdb1 = buildRdb(idValKeys, shuffle(rows1, rnd), [primaryCompareKey]);
    const rdb2 = buildRdb(idValKeys, shuffle(rows2, rnd), [primaryCompareKey]);

    const syncResult = diff(rdb1.rs, rdb2.rs);
    expect(syncResult.ok).toBe(true);
    expect({
      updated: syncResult.updated,
      inserted: syncResult.inserted,
      deleted: syncResult.deleted,
    }).toEqual(expected);

    const asyncResult = await asyncDiff(rdb1.rs, rdb2.rs);
    expect({
      updated: asyncResult.updated,
      inserted: asyncResult.inserted,
      deleted: asyncResult.deleted,
    }).toEqual(expected);
  });

  it("produces the same result regardless of row order (shuffle invariance)", () => {
    const rnd = mulberry32(42);
    const { rows1, rows2 } = buildRandomScenario(200, rnd);
    const expected = referenceDiffCounts(rows1, rows2);

    const unshuffled = diff(
      buildRdb(idValKeys, rows1, [primaryCompareKey]).rs,
      buildRdb(idValKeys, rows2, [primaryCompareKey]).rs
    );
    const shuffled = diff(
      buildRdb(idValKeys, shuffle(rows1, rnd), [primaryCompareKey]).rs,
      buildRdb(idValKeys, shuffle(rows2, rnd), [primaryCompareKey]).rs
    );

    const pick = (r: DiffResult): Counts => ({
      updated: r.updated,
      inserted: r.inserted,
      deleted: r.deleted,
    });
    expect(pick(unshuffled)).toEqual(expected);
    expect(pick(shuffled)).toEqual(expected);
  });
});
