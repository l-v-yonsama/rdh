/**
 * toStringUtil (toCsv/toHtml/toMarkdown/toString) の回帰テスト。
 * バイナリの16進変換の上限と、列が0件になる場合の表示を対象にする。
 */
import {
  GeneralColumnType,
  ResultSetDataBuilder,
  createRdhKey,
} from "../src";

describe("binary hex conversion is capped at 64 bytes", () => {
  const buildRdbWithBuffer = (bytes: number): ResultSetDataBuilder => {
    const rdb = new ResultSetDataBuilder([
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "b", type: GeneralColumnType.BLOB }),
    ]);
    rdb.addRow({ id: 1, b: Buffer.alloc(bytes, 1) });
    return rdb;
  };

  const buildRdbWithUint8Array = (bytes: number): ResultSetDataBuilder => {
    const rdb = new ResultSetDataBuilder([
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "b", type: GeneralColumnType.BLOB }),
    ]);
    rdb.addRow({ id: 1, b: new Uint8Array(bytes).fill(1) });
    return rdb;
  };

  const extractHexLength = (s: string): number => {
    const m = s.match(/B'([0-9a-f]*)/);
    return m ? m[1].length : -1;
  };

  it.each([0, 1, 63, 64, 65])(
    "caps a %i-byte Buffer's hex output at min(bytes, 64) bytes",
    (bytes) => {
      const rdb = buildRdbWithBuffer(bytes);
      const s = rdb.toString({ binaryToHex: true, maxCellValueLength: 0 });
      expect(extractHexLength(s)).toBe(Math.min(bytes, 64) * 2);
    }
  );

  it.each([0, 1, 63, 64, 65])(
    "caps a %i-byte Uint8Array's hex output at min(bytes, 64) bytes",
    (bytes) => {
      const rdb = buildRdbWithUint8Array(bytes);
      const s = rdb.toString({ binaryToHex: true, maxCellValueLength: 0 });
      expect(extractHexLength(s)).toBe(Math.min(bytes, 64) * 2);
    }
  );

  it("shows (BINARY) instead of hex when binaryToHex is false, regardless of size", () => {
    const rdb = buildRdbWithBuffer(200);
    const s = rdb.toString({ binaryToHex: false });
    expect(s).toContain("(BINARY)");
    expect(s).not.toContain("B'");
  });

  it("keeps the rendered output length bounded for a very large Buffer", () => {
    const rdb = buildRdbWithBuffer(16 * 1024 * 1024); // 16MiB
    const s = rdb.toString({ binaryToHex: true, maxCellValueLength: 0 });
    // 64 bytes -> 128 hex chars, plus "B'" and small table formatting overhead;
    // nowhere near the ~33M chars a full 16MiB conversion would produce.
    expect(s.length).toBeLessThan(1000);
    expect(extractHexLength(s)).toBe(128);
  });

  it("composes with maxCellValueLength (abbreviation still applies after hex-capping)", () => {
    const rdb = buildRdbWithBuffer(64);
    const full = rdb.toString({ binaryToHex: true, maxCellValueLength: 0 });
    expect(extractHexLength(full)).toBe(128);

    const abbreviated = rdb.toString({ binaryToHex: true, maxCellValueLength: 20 });
    expect(abbreviated).toContain("..");
    expect(abbreviated.length).toBeLessThan(full.length);
  });
});

describe("empty-key handling", () => {
  it("shows a distinct 'no keys' message when a keyNames filter leaves zero visible columns, even though rows exist", () => {
    const rdb = new ResultSetDataBuilder([
      createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
      createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
    ]);
    rdb.addRow({ id: 1, val: "a" });

    const params = { keyNames: ["does_not_exist"] };
    expect(rdb.toString(params)).toBe("No Keys.");
    expect(rdb.toMarkdown(params)).toBe("No Keys.");
    expect(rdb.toCsv(params)).toBe("No Keys.");
    expect(rdb.toHtml(params)).toBe("<p>No Keys.</p>");
  });

  it("still prefers the no-records message over 'no keys' when both keys and rows are empty", () => {
    // ResultSetDataBuilder.createEmpty()はkeysもrowsも0件で作る。
    // 「行がない」を優先しないと、この既存ケースが常に"No Keys."になってしまう。
    const rdb = ResultSetDataBuilder.createEmpty({ noRecordsReason: "custom reason" });
    expect(rdb.toString()).toBe("custom reason");
    expect(rdb.toMarkdown()).toBe("custom reason");
    expect(rdb.toCsv()).toBe("custom reason");
    expect(rdb.toHtml()).toBe("<p>custom reason</p>");

    const withDefaultReason = ResultSetDataBuilder.createEmpty();
    expect(withDefaultReason.toString()).toBe("No Records.");
  });
});
