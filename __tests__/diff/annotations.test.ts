/**
 * diff()がrowへ付与するannotation(Upd/Del/Add等)に関する回帰テスト。
 */
import {
  CompareKey,
  GeneralColumnType,
  RdhKey,
  RowHelper,
  createRdhKey,
  diff,
} from "../../src";
import {
  buildRdb,
  findRow,
  idValKeys,
  primaryCompareKey,
} from "./diffTestSupport";

describe("annotations", () => {
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
