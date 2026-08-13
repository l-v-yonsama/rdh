/**
 * resolveCodeLabel() のテスト。
 */
import {
  CodeItem,
  GeneralColumnType,
  RdhKey,
  ResultSetDataBuilder,
  RowHelper,
  createRdhKey,
  resolveCodeLabel,
} from "../src";

function buildRdb(
  keys: RdhKey[],
  rows: Record<string, any>[],
  codeItems: CodeItem[],
  tableName?: string
): ResultSetDataBuilder {
  const rdb = new ResultSetDataBuilder(keys);
  rows.forEach((row) => rdb.addRow(row));
  rdb.updateMeta({ codeItems, tableName });
  return rdb;
}

describe("resolveCodeLabel", () => {
  it("resolves matching codes to labels and unmatched-but-truthy values to Undefined", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const codeItems: CodeItem[] = [
      {
        title: "status codes",
        resource: { column: { regex: false, pattern: "status" } },
        details: [
          { code: "A", label: "Active" },
          { code: "B", label: "Blocked" },
        ],
      },
    ];
    const rdb = buildRdb(
      keys,
      [{ status: "A" }, { status: "B" }, { status: "C" }],
      codeItems
    );

    const resolved = await resolveCodeLabel(rdb.rs);
    expect(resolved).toBe(true);

    const a = RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "status", "Cod");
    expect(a?.values).toEqual({ label: "Active", isUndefined: false });

    const b = RowHelper.getFirstAnnotationOf(rdb.rs.rows[1], "status", "Cod");
    expect(b?.values).toEqual({ label: "Blocked", isUndefined: false });

    const c = RowHelper.getFirstAnnotationOf(rdb.rs.rows[2], "status", "Cod");
    expect(c?.values).toEqual({ label: "Undefined", isUndefined: true });
  });

  it("does not accumulate Cod annotations when run twice with the same definition", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const codeItems: CodeItem[] = [
      {
        title: "status codes",
        resource: { column: { regex: false, pattern: "status" } },
        details: [{ code: "A", label: "Active" }],
      },
    ];
    const rdb = buildRdb(keys, [{ status: "A" }], codeItems);

    await resolveCodeLabel(rdb.rs);
    await resolveCodeLabel(rdb.rs);

    const annos = RowHelper.filterAnnotationByKeyOf(rdb.rs.rows[0], "status", "Cod");
    expect(annos).toHaveLength(1);
    expect(annos[0].values).toEqual({ label: "Active", isUndefined: false });
  });

  it("replaces the label after the code definition changes, instead of keeping the stale one", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const rdb = buildRdb(keys, [{ status: "A" }], [
      {
        title: "v1",
        resource: { column: { regex: false, pattern: "status" } },
        details: [{ code: "A", label: "old-label" }],
      },
    ]);

    await resolveCodeLabel(rdb.rs);
    let annos = RowHelper.filterAnnotationByKeyOf(rdb.rs.rows[0], "status", "Cod");
    expect(annos.map((a) => a.values?.label)).toEqual(["old-label"]);

    rdb.rs.meta.codeItems = [
      {
        title: "v2",
        resource: { column: { regex: false, pattern: "status" } },
        details: [{ code: "A", label: "new-label" }],
      },
    ];
    await resolveCodeLabel(rdb.rs);

    annos = RowHelper.filterAnnotationByKeyOf(rdb.rs.rows[0], "status", "Cod");
    expect(annos.map((a) => a.values?.label)).toEqual(["new-label"]);
  });

  it("clears stale Cod annotations even if the new codeItems definition matches nothing", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const rdb = buildRdb(keys, [{ status: "A" }], [
      {
        title: "v1",
        resource: { column: { regex: false, pattern: "status" } },
        details: [{ code: "A", label: "old-label" }],
      },
    ]);
    await resolveCodeLabel(rdb.rs);
    expect(
      RowHelper.filterAnnotationByKeyOf(rdb.rs.rows[0], "status", "Cod")
    ).toHaveLength(1);

    rdb.rs.meta.codeItems = [
      {
        title: "v2-unrelated",
        resource: { column: { regex: false, pattern: "some_other_column" } },
        details: [{ code: "A", label: "irrelevant" }],
      },
    ];
    const resolved = await resolveCodeLabel(rdb.rs);

    expect(resolved).toBe(false);
    expect(
      RowHelper.filterAnnotationByKeyOf(rdb.rs.rows[0], "status", "Cod")
    ).toHaveLength(0);
  });

  describe("0 / false / empty string / null / undefined handling", () => {
    it("0 gets a real label when a matching code exists, but no annotation at all when it doesn't (falsy fallback is skipped)", async () => {
      const keys: RdhKey[] = [
        createRdhKey({ name: "n_has_zero", type: GeneralColumnType.INTEGER }),
        createRdhKey({ name: "n_no_zero", type: GeneralColumnType.INTEGER }),
      ];
      const rdb = buildRdb(keys, [{ n_has_zero: 0, n_no_zero: 0 }], [
        {
          title: "has-zero",
          resource: { column: { regex: false, pattern: "n_has_zero" } },
          details: [{ code: "0", label: "Zero" }],
        },
        {
          title: "no-zero",
          resource: { column: { regex: false, pattern: "n_no_zero" } },
          details: [{ code: "1", label: "One" }],
        },
      ]);

      await resolveCodeLabel(rdb.rs);

      const hasZero = RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "n_has_zero", "Cod");
      expect(hasZero?.values).toEqual({ label: "Zero", isUndefined: false });

      const noZero = RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "n_no_zero", "Cod");
      expect(noZero).toBeUndefined();
    });

    it("false behaves like 0 (numeric coercion), matching only a \"0\"/\"1\"-coded detail", async () => {
      const keys: RdhKey[] = [createRdhKey({ name: "b", type: GeneralColumnType.BOOLEAN })];
      const withMatch = buildRdb(keys, [{ b: true }], [
        {
          title: "bool codes",
          resource: { column: { regex: false, pattern: "b" } },
          details: [{ code: "1", label: "Yes" }],
        },
      ]);
      await resolveCodeLabel(withMatch.rs);
      expect(
        RowHelper.getFirstAnnotationOf(withMatch.rs.rows[0], "b", "Cod")?.values
      ).toEqual({ label: "Yes", isUndefined: false });

      const withoutMatch = buildRdb(keys, [{ b: false }], [
        {
          title: "bool codes",
          resource: { column: { regex: false, pattern: "b" } },
          details: [{ code: "1", label: "Yes" }],
        },
      ]);
      await resolveCodeLabel(withoutMatch.rs);
      expect(
        RowHelper.getFirstAnnotationOf(withoutMatch.rs.rows[0], "b", "Cod")
      ).toBeUndefined();
    });

    it('an empty string can still match a literal "" code (falsy-ness only skips the Undefined fallback)', async () => {
      const keys: RdhKey[] = [
        createRdhKey({ name: "with_empty_code", type: GeneralColumnType.TEXT }),
        createRdhKey({ name: "without_empty_code", type: GeneralColumnType.TEXT }),
      ];
      const rdb = buildRdb(
        keys,
        [{ with_empty_code: "", without_empty_code: "" }],
        [
          {
            title: "has-empty-code",
            resource: { column: { regex: false, pattern: "with_empty_code" } },
            details: [{ code: "", label: "Empty" }],
          },
          {
            title: "no-empty-code",
            resource: { column: { regex: false, pattern: "without_empty_code" } },
            details: [{ code: "X", label: "X-label" }],
          },
        ]
      );

      await resolveCodeLabel(rdb.rs);

      expect(
        RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "with_empty_code", "Cod")?.values
      ).toEqual({ label: "Empty", isUndefined: false });
      expect(
        RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "without_empty_code", "Cod")
      ).toBeUndefined();
    });

    it("null and undefined never resolve to a label or to Undefined", async () => {
      const keys: RdhKey[] = [
        createRdhKey({ name: "n", type: GeneralColumnType.TEXT }),
        createRdhKey({ name: "u", type: GeneralColumnType.TEXT }),
      ];
      const rdb = buildRdb(keys, [{ n: null }], [
        {
          title: "codes",
          resource: { column: { regex: true, pattern: "^(n|u)$" } },
          details: [{ code: "null", label: "should-not-match" }],
        },
      ]);

      await resolveCodeLabel(rdb.rs);

      expect(RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "n", "Cod")).toBeUndefined();
      expect(RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "u", "Cod")).toBeUndefined();
    });
  });

  it("does not throw when tableName is missing and a codeItem has a table condition, and still resolves items without one", async () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "status", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "flag", type: GeneralColumnType.TEXT }),
    ];
    const codeItems: CodeItem[] = [
      {
        title: "needs table",
        resource: {
          table: { regex: false, pattern: "orders" },
          column: { regex: false, pattern: "status" },
        },
        details: [{ code: "A", label: "Active" }],
      },
      {
        title: "no table condition",
        resource: { column: { regex: false, pattern: "flag" } },
        details: [{ code: "X", label: "Flagged" }],
      },
    ];
    // tableNameを渡さない(RdhMeta.tableNameがundefinedのケース)
    const rdb = buildRdb(keys, [{ status: "A", flag: "X" }], codeItems);

    await expect(resolveCodeLabel(rdb.rs)).resolves.toBe(true);

    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "status", "Cod")
    ).toBeUndefined();
    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "flag", "Cod")?.values
    ).toEqual({ label: "Flagged", isUndefined: false });
  });

  it("supports regex table and column conditions", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const codeItems: CodeItem[] = [
      {
        title: "regex conditions",
        resource: {
          table: { regex: true, pattern: "^orders" },
          column: { regex: true, pattern: "^stat" },
        },
        details: [{ code: "A", label: "Active" }],
      },
    ];
    const rdb = buildRdb(keys, [{ status: "A" }], codeItems, "orders_2024");

    await resolveCodeLabel(rdb.rs);

    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "status", "Cod")?.values
    ).toEqual({ label: "Active", isUndefined: false });
  });

  it("treats an invalid regex pattern as never matching, without throwing, and does not affect other codeItems", async () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "broken", type: GeneralColumnType.TEXT }),
      createRdhKey({ name: "ok", type: GeneralColumnType.TEXT }),
    ];
    const codeItems: CodeItem[] = [
      {
        title: "invalid regex",
        resource: { column: { regex: true, pattern: "(" } },
        details: [{ code: "A", label: "should-not-match" }],
      },
      {
        title: "valid",
        resource: { column: { regex: false, pattern: "ok" } },
        details: [{ code: "A", label: "Fine" }],
      },
    ];
    const rdb = buildRdb(keys, [{ broken: "A", ok: "A" }], codeItems);

    await expect(resolveCodeLabel(rdb.rs)).resolves.toBe(true);

    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "broken", "Cod")
    ).toBeUndefined();
    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "ok", "Cod")?.values
    ).toEqual({ label: "Fine", isUndefined: false });
  });

  it("applies multiple codeItems that target the same column, each contributing its own Cod annotation", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const codeItems: CodeItem[] = [
      {
        title: "exact-match item",
        resource: { column: { regex: false, pattern: "status" } },
        details: [{ code: "A", label: "from-exact" }],
      },
      {
        title: "regex item",
        resource: { column: { regex: true, pattern: "^stat" } },
        details: [{ code: "A", label: "from-regex" }],
      },
    ];
    const rdb = buildRdb(keys, [{ status: "A" }], codeItems);

    await resolveCodeLabel(rdb.rs);

    const annos = RowHelper.filterAnnotationByKeyOf(rdb.rs.rows[0], "status", "Cod");
    expect(annos.map((a) => a.values?.label).sort()).toEqual(["from-exact", "from-regex"]);
  });

  it("matches table and column names case-insensitively (existing behavior)", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "Status", type: GeneralColumnType.TEXT })];
    const codeItems: CodeItem[] = [
      {
        title: "case-insensitive",
        resource: {
          table: { regex: false, pattern: "ORDERS" },
          column: { regex: false, pattern: "status" },
        },
        details: [{ code: "A", label: "Active" }],
      },
    ];
    const rdb = buildRdb(keys, [{ Status: "A" }], codeItems, "Orders");

    await resolveCodeLabel(rdb.rs);

    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "Status", "Cod")?.values
    ).toEqual({ label: "Active", isUndefined: false });
  });

  it("returns false and adds no annotations when meta.codeItems is absent", async () => {
    const keys: RdhKey[] = [createRdhKey({ name: "status", type: GeneralColumnType.TEXT })];
    const rdb = new ResultSetDataBuilder(keys);
    rdb.addRow({ status: "A" });

    const resolved = await resolveCodeLabel(rdb.rs);
    expect(resolved).toBe(false);
    expect(
      RowHelper.getFirstAnnotationOf(rdb.rs.rows[0], "status", "Cod")
    ).toBeUndefined();
  });
});
