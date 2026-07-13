import { GeneralColumnType, parseColumnType } from "../src";

describe("parseColumnType", () => {
  it("maps datetime-family type names to TIMESTAMP", () => {
    expect(parseColumnType("datetime")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("DATETIME")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("datetime2")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("DATETIME2")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("smalldatetime")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("SMALLDATETIME")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("timestamp(6)")).toBe(GeneralColumnType.TIMESTAMP);
  });

  it("maps datetimeoffset to TIMESTAMP_WITH_TIME_ZONE", () => {
    expect(parseColumnType("datetimeoffset")).toBe(
      GeneralColumnType.TIMESTAMP_WITH_TIME_ZONE
    );
    expect(parseColumnType("DATETIMEOFFSET")).toBe(
      GeneralColumnType.TIMESTAMP_WITH_TIME_ZONE
    );
  });

  it("still resolves plain enum-value type names directly", () => {
    expect(parseColumnType("timestamp")).toBe(GeneralColumnType.TIMESTAMP);
    expect(parseColumnType("date")).toBe(GeneralColumnType.DATE);
  });

  it("returns UNKNOWN for unrecognized type names", () => {
    expect(parseColumnType("not_a_real_type")).toBe(GeneralColumnType.UNKNOWN);
    expect(parseColumnType(undefined)).toBe(GeneralColumnType.UNKNOWN);
    expect(parseColumnType(null)).toBe(GeneralColumnType.UNKNOWN);
  });
});
