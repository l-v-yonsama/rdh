/**
 * diff()が入力rdhを一切書き換えないことの回帰テスト。
 */
import {
  GeneralColumnType,
  RdhKey,
  ResultSetDataBuilder,
  createRdhKey,
  diff,
} from "../../src";
import { buildRdb, idValKeys, primaryCompareKey } from "./diffTestSupport";

describe("non-destructive guarantees", () => {
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
