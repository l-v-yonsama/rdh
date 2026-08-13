/**
 * ResultSetDataBuilder.from()(内部的にはResultSetDataClone.tsのcloneRdhValue/
 * cloneFromRdh)のクローン挙動のテスト。
 *
 * 既存の基本的なクローンテスト(Buffer/Date/Set/NaN・Infinity・-0/bigint等)は
 * __tests__/ResultsetDataBuilder.test.ts 側にあるため、ここでは今回追加した
 * 対応型(Uint8Array/ArrayBuffer/Map)・共有参照・循環参照・未対応クラスの
 * 挙動・JSON経由で平坦化された値の後方互換復元に絞る。
 */
import {
  GeneralColumnType,
  RdhKey,
  ResultSetData,
  ResultSetDataBuilder,
  createRdhKey,
  setOf,
} from "../src";

describe("ResultSetDataBuilder.from() cloning (Phase 4)", () => {
  it("clones a raw Uint8Array value as a distinct Uint8Array with the same bytes", () => {
    const keys: RdhKey[] = [createRdhKey({ name: "b", type: GeneralColumnType.BINARY })];
    const source = new ResultSetDataBuilder(keys);
    const original = Uint8Array.from([1, 2, 3, 244]);
    source.addRow({ b: original });

    const copied = ResultSetDataBuilder.from(source);
    const cloned = copied.rs.rows[0].values.b;

    expect(cloned instanceof Uint8Array).toBe(true);
    expect(cloned).not.toBe(original);
    expect(Array.from(cloned as Uint8Array)).toEqual([1, 2, 3, 244]);

    (cloned as Uint8Array)[0] = 255;
    expect(original[0]).toBe(1);
  });

  it("preserves Uint8Array members inside a BINARY_SET Set", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "bs", type: GeneralColumnType.BINARY_SET }),
    ];
    const source = new ResultSetDataBuilder(keys);
    const original = Uint8Array.from([9, 8, 7]);
    source.addRow({ bs: setOf(original) });

    const copied = ResultSetDataBuilder.from(source);
    const clonedSet = copied.rs.rows[0].values.bs as Set<unknown>;

    expect(clonedSet instanceof Set).toBe(true);
    const [clonedMember] = Array.from(clonedSet);
    expect(clonedMember instanceof Uint8Array).toBe(true);
    expect(clonedMember).not.toBe(original);
    expect(Array.from(clonedMember as Uint8Array)).toEqual([9, 8, 7]);
  });

  it("clones Map keys and values as a distinct Map", () => {
    const keys: RdhKey[] = [createRdhKey({ name: "m", type: GeneralColumnType.JSON })];
    const source = new ResultSetDataBuilder(keys);
    const original = new Map<string, number>([
      ["a", 1],
      ["b", 2],
    ]);
    source.addRow({ m: original });

    const copied = ResultSetDataBuilder.from(source);
    const cloned = copied.rs.rows[0].values.m as Map<string, number>;

    expect(cloned instanceof Map).toBe(true);
    expect(cloned).not.toBe(original);
    expect([...cloned.entries()]).toEqual([
      ["a", 1],
      ["b", 2],
    ]);

    cloned.set("c", 3);
    expect(original.has("c")).toBe(false);
  });

  it("clones an ArrayBuffer as a distinct instance with the same bytes", () => {
    const keys: RdhKey[] = [createRdhKey({ name: "ab", type: GeneralColumnType.JSON })];
    const source = new ResultSetDataBuilder(keys);
    const original = new ArrayBuffer(4);
    new Uint8Array(original).set([1, 2, 3, 4]);
    source.addRow({ ab: original });

    const copied = ResultSetDataBuilder.from(source);
    const cloned = copied.rs.rows[0].values.ab as ArrayBuffer;

    expect(cloned instanceof ArrayBuffer).toBe(true);
    expect(cloned).not.toBe(original);
    expect(Array.from(new Uint8Array(cloned))).toEqual([1, 2, 3, 4]);

    new Uint8Array(original)[0] = 99;
    expect(new Uint8Array(cloned)[0]).toBe(1);
  });

  it("clones deeply nested combinations of Map/Set/Array/Date/Buffer inside a JSON value", () => {
    const keys: RdhKey[] = [createRdhKey({ name: "j", type: GeneralColumnType.JSON })];
    const source = new ResultSetDataBuilder(keys);
    const innerDate = new Date("2024-05-01T00:00:00.000Z");
    const innerBuffer = Buffer.from([1, 2]);
    const original = {
      list: [innerDate, innerBuffer],
      nested: new Map<string, unknown>([["k", new Set([1, 2, 3])]]),
    };
    source.addRow({ j: original });

    const copied = ResultSetDataBuilder.from(source);
    const cloned = copied.rs.rows[0].values.j as typeof original;

    expect(cloned.list[0] instanceof Date).toBe(true);
    expect((cloned.list[0] as Date).getTime()).toBe(innerDate.getTime());
    expect(Buffer.isBuffer(cloned.list[1])).toBe(true);
    expect(cloned.list[1]).toEqual(innerBuffer);
    expect(cloned.nested instanceof Map).toBe(true);
    const inner = cloned.nested.get("k");
    expect(inner instanceof Set).toBe(true);
    expect([...(inner as Set<number>)]).toEqual([1, 2, 3]);

    // すべて元と別インスタンスであること
    expect(cloned.list[0]).not.toBe(innerDate);
    expect(cloned.nested).not.toBe(original.nested);
  });

  it("clones two references to the same object into references to the same cloned object", () => {
    const keys: RdhKey[] = [
      createRdhKey({ name: "a", type: GeneralColumnType.JSON }),
      createRdhKey({ name: "b", type: GeneralColumnType.JSON }),
    ];
    const source = new ResultSetDataBuilder(keys);
    const shared = { label: "shared" };
    source.addRow({ a: shared, b: { holder: shared } });

    const copied = ResultSetDataBuilder.from(source);
    const clonedA = copied.rs.rows[0].values.a;
    const clonedBHolder = (copied.rs.rows[0].values.b as { holder: unknown }).holder;

    expect(clonedA).not.toBe(shared);
    // 同じオブジェクトへの2つの参照は、複製後も同じクローンを指す
    expect(clonedBHolder).toBe(clonedA);
  });

  it("clones a circular reference without infinite recursion, preserving the cycle", () => {
    const keys: RdhKey[] = [createRdhKey({ name: "j", type: GeneralColumnType.JSON })];
    const source = new ResultSetDataBuilder(keys);
    const original: { name: string; self?: unknown } = { name: "x" };
    original.self = original;
    source.addRow({ j: original });

    let copied: ResultSetDataBuilder | undefined;
    expect(() => {
      copied = ResultSetDataBuilder.from(source);
    }).not.toThrow();

    const cloned = copied!.rs.rows[0].values.j as { name: string; self: unknown };
    expect(cloned.name).toBe("x");
    expect(cloned).not.toBe(original);
    expect(cloned.self).toBe(cloned);
  });

  it("throws a clear error instead of silently collapsing an unsupported class instance to {}", () => {
    class Money {
      constructor(public cents: number) {}
    }
    const keys: RdhKey[] = [createRdhKey({ name: "j", type: GeneralColumnType.JSON })];
    const source = new ResultSetDataBuilder(keys);
    source.addRow({ j: new Money(500) });

    expect(() => ResultSetDataBuilder.from(source)).toThrow(/Money/);
  });

  it("throws for other unsupported built-in object types such as RegExp", () => {
    const keys: RdhKey[] = [createRdhKey({ name: "j", type: GeneralColumnType.JSON })];
    const source = new ResultSetDataBuilder(keys);
    source.addRow({ j: /abc/ });

    expect(() => ResultSetDataBuilder.from(source)).toThrow();
  });

  it("rehydrates a Date/Buffer that was already flattened through JSON before reaching from()", () => {
    // JSON.parse(JSON.stringify(...))を経由した後の典型的な形を直接模擬する:
    // DateはISO文字列、Bufferは{type:"Buffer",data:[...]}のプレーンオブジェクト。
    const flattened: ResultSetData = {
      created: "2024-01-01T00:00:00.000Z" as unknown as Date,
      keys: [
        createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
        createRdhKey({ name: "d", type: GeneralColumnType.TIMESTAMP }),
        createRdhKey({ name: "b", type: GeneralColumnType.BLOB }),
      ],
      rows: [
        {
          meta: {},
          values: {
            id: 1,
            d: "2024-06-01T09:30:00.000Z",
            b: { type: "Buffer", data: [1, 2, 3] },
          },
        },
      ],
      meta: {},
    };

    const rebuilt = ResultSetDataBuilder.from(flattened);
    const row = rebuilt.rs.rows[0];

    expect(row.values.d instanceof Date).toBe(true);
    expect((row.values.d as Date).toISOString()).toBe("2024-06-01T09:30:00.000Z");
    expect(Buffer.isBuffer(row.values.b)).toBe(true);
    expect(row.values.b).toEqual(Buffer.from([1, 2, 3]));
    expect(rebuilt.rs.created instanceof Date).toBe(true);
  });
});
