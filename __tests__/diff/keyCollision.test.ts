/**
 * 比較キーの衝突回帰テスト(最重要)。
 * 修正前は誤って「同じ行」に突合されてしまうケースを網羅する。
 */
import {
  CompareKey,
  DiffResult,
  GeneralColumnType,
  RdhKey,
  ResultSetDataBuilder,
  RowHelper,
  createRdhKey,
  diff,
} from "../../src";
import { buildRdb } from "./diffTestSupport";

describe("compare key collision regression", () => {
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
    const weirdKey = "こんにちは\n\u0000世界";
    const rdb1 = buildRdb(singleKeyDef, [{ k: weirdKey, val: "a" }], [singleKey]);
    const rdb2 = buildRdb(singleKeyDef, [{ k: weirdKey, val: "b" }], [singleKey]);
    const result = expectSameRow(rdb1, rdb2);
    expect(result.updated).toBe(1);

    const rdb1b = buildRdb(singleKeyDef, [{ k: "a\u0000b", val: "a" }], [singleKey]);
    const rdb2b = buildRdb(singleKeyDef, [{ k: "a\u0000c", val: "a" }], [singleKey]);
    expectDistinctRows(rdb1b, rdb2b);
  });
});
