/**
 * compare keyの型制約(JSON/ARRAY/ENUM等)に関する回帰テスト。
 */
import {
  GeneralColumnType,
  RdhKey,
  createRdhKey,
  diff,
  diffToUndoChanges,
} from "../../src";
import { buildRdb } from "./diffTestSupport";

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
