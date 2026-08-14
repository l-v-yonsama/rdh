/**
 * diff() / asyncDiff() / diffToUndoChanges() の基本動作(3関数で共通化した
 * テーブル駆動テスト)。
 */
import { GeneralColumnType, RdhKey, RowHelper, createRdhKey, diff } from "../../src";
import {
  Counts,
  buildRdb,
  findRow,
  idValKeys,
  normalizeCounts,
  primaryCompareKey,
  runners,
} from "./diffTestSupport";

describe("basic matching (shared across diff/asyncDiff/diffToUndoChanges)", () => {
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
