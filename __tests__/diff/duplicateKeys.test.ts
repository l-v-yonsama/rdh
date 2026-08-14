/**
 * compare keyの重複キー検出に関する回帰テスト。
 */
import {
  CompareKey,
  GeneralColumnType,
  RdhKey,
  ResultSetDataBuilder,
  createRdhKey,
  diff,
} from "../../src";
import {
  buildRdb,
  idValKeys,
  primaryCompareKey,
  runners,
} from "./diffTestSupport";

describe("duplicate compare key handling", () => {
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

      // 重複検出時も非破壊
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

  it("does not treat two different Invalid Date compare keys as duplicates just because they hash to the same bucket", () => {
    // Invalid Dateはgetffime()がNaNになり、compareKeyのエンコードもすべて
    // 同じ表現に潰れる。しかし比較(comparePartEquals)はDateをgetTime()の
    // 厳密等価で見るため、Invalid Date同士は互いに等しくない。エンコード
    // (バケット)が衝突しても、実値が等しくない限り重複キー扱いにしては
    // いけない。
    const keys: RdhKey[] = [
      createRdhKey({ name: "k", type: GeneralColumnType.TIMESTAMP }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ];
    const compareKey: CompareKey = { kind: "primary", names: ["k"] };
    const rdb1 = buildRdb(
      keys,
      [
        { k: new Date(NaN), val: "a" },
        { k: new Date(NaN), val: "b" },
      ],
      [compareKey]
    );
    const rdb2 = buildRdb(keys, [], [compareKey]);

    const result = diff(rdb1.rs, rdb2.rs);

    expect(result.ok).toBe(true);
    expect(result.message).not.toMatch(/Duplicate/);
    expect(result.deleted).toBe(2);
  });

  it("reports a clear compare-key error (not a confusing duplicate-key error) when rdh2 is missing the compare key column", () => {
    const rdb1 = buildRdb(
      idValKeys,
      [{ id: 1, val: "a" }, { id: 2, val: "b" }],
      [primaryCompareKey]
    );
    // rdh2にはidが存在しない(スキーマが噛み合っていない想定)
    const rdb2 = new ResultSetDataBuilder([
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ]);
    rdb2.addRow({ val: "a" });
    rdb2.addRow({ val: "b" });

    const result = diff(rdb1.rs, rdb2.rs);

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/rdh2/i);
    expect(result.message).not.toMatch(/Duplicate/);
  });
});
