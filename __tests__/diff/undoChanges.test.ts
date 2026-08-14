/**
 * diffToUndoChanges()固有の回帰テスト(conditions/valuesの内容、複合キー、
 * 重複キー時のエラー、mutationからの隔離)。
 */
import {
  CompareKey,
  GeneralColumnType,
  RdhKey,
  ResultSetDataBuilder,
  createRdhKey,
  diffToUndoChanges,
} from "../../src";
import { buildRdb, idValKeys, primaryCompareKey } from "./diffTestSupport";

describe("diffToUndoChanges specifics", () => {
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
