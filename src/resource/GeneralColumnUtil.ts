import { GeneralColumnType as GC } from "../types";

export function displayGeneralColumnType(columnType: GC): string {
  return columnType.toUpperCase();
}

export function parseColumnType(s: string | null | undefined): GC {
  if (s === undefined || s === null) {
    return GC.UNKNOWN;
  }
  s = s.toLowerCase();
  if (["var_string", "nvarchar"].includes(s)) {
    return GC.VARCHAR;
  } else if (["bpchar", "nchar"].includes(s)) {
    return GC.CHAR;
  } else if (["ntext"].includes(s)) {
    return GC.TEXT;
  } else if ("tiny" === s) {
    return GC.TINYINT;
  } else if ("datetime" === s || "timestamp(6)" === s) {
    return GC.TIMESTAMP;
  } else if ("varchar2" === s) {
    return GC.VARCHAR;
  } else if ("number" === s) {
    return GC.NUMERIC;
  } else if ("int" === s) {
    return GC.INTEGER;
  }
  const list = Object.values(GC);
  const m = list.find((it) => it == s);
  if (m) {
    return m;
  }

  console.log("L35 unknown", s);

  return GC.UNKNOWN;
}

export function isNumericLike(type: GC): boolean {
  switch (type) {
    // number
    case GC.TINYINT:
    case GC.SMALLINT:
    case GC.MEDIUMINT:
    case GC.INTEGER:
    case GC.LONG:
    case GC.LONGLONG:
    case GC.BIGINT:
    case GC.SERIAL:
    case GC.MONEY:
    case GC.YEAR:
    case GC.FLOAT:
    case GC.DOUBLE_PRECISION:
    case GC.NUMERIC:
    case GC.DECIMAL:
      return true;
  }
  return false;
}

export function isTextLike(type: GC): boolean {
  switch (type) {
    case GC.CHAR:
    case GC.VARCHAR:
    case GC.TINYTEXT:
    case GC.MEDIUMTEXT:
    case GC.TEXT:
    case GC.LONGTEXT:
      return true;
  }
  return false;
}

/**
 * Tests whether type is BYTEA,BLOB,MEDIUMBLOB,LONGBLOB,BINARY_ARRAY OR BINARY
 * @param type GC
 * @returns true:BYTEA,BLOB,MEDIUMBLOB,LONGBLOB,BINARY_ARRAY OR BINARY
 */
export function isBinaryLike(type: GC): boolean {
  switch (type) {
    case GC.BYTEA:
    case GC.BLOB:
    case GC.MEDIUMBLOB:
    case GC.LONGBLOB:
    case GC.TINYBLOB:
    case GC.BINARY:
    case GC.VARBINARY:
    case GC.BINARY_ARRAY:
      return true;
  }
  return false;
}

export function isGeometryLike(type: GC): boolean {
  switch (type) {
    case GC.GEOMETRY:
    case GC.POINT:
    case GC.POLYGON:
      return true;
  }
  return false;
}

export function isNotSupportDiffType(type: GC): boolean {
  if (isBinaryLike(type) || isGeometryLike(type)) {
    return true;
  }
  if (type === GC.UNKNOWN) {
    return true;
  }
  return false;
}

/**
 * Tests whether type is DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE
 * @param type GC
 * @returns true:DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE
 */
export function isDateTimeOrDate(type: GC): boolean {
  switch (type) {
    case GC.DATE:
    case GC.TIMESTAMP:
    case GC.TIMESTAMP_WITH_TIME_ZONE:
      return true;
  }
  return false;
}

/**
 * Tests whether type is TIME,TIME_WITH_TIME_ZONE,DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE
 * @param type GC
 * @returns true:TIME,TIME_WITH_TIME_ZONE,DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE
 */
export function isDateTimeOrDateOrTime(type: GC): boolean {
  switch (type) {
    case GC.TIME:
    case GC.TIME_WITH_TIME_ZONE:
    case GC.DATE:
    case GC.TIMESTAMP:
    case GC.TIMESTAMP_WITH_TIME_ZONE:
      return true;
  }
  return false;
}

export function isDateTime(type: GC): boolean {
  switch (type) {
    case GC.TIMESTAMP:
    case GC.TIMESTAMP_WITH_TIME_ZONE:
      return true;
  }
  return false;
}

export function isTime(type: GC): boolean {
  switch (type) {
    case GC.TIME:
    case GC.TIME_WITH_TIME_ZONE:
      return true;
  }
  return false;
}

export function isUUIDType(type: GC): boolean {
  return type === GC.UUID;
}

/**
 * Tests whether type is JSON or JSONB
 * @param type GC
 * @returns true:JSON or JSONB
 */
export function isJsonLike(type: GC): boolean {
  return GC.JSON === type || GC.JSONB === type;
}
/**
 * Tests whether type is BOOLEAN or BIT
 * @param type GC
 * @returns true:BOOLEAN or BIT
 */
export function isBooleanLike(type: GC): boolean {
  return GC.BOOLEAN === type || GC.BIT === type;
}
export function isEnumOrSet(type: GC): boolean {
  return GC.ENUM === type || GC.SET === type;
}
export function isArray(type: GC): boolean {
  return (
    GC.ARRAY === type ||
    GC.STRING_ARRAY === type ||
    GC.NUMERIC_ARRAY === type ||
    GC.BINARY_ARRAY === type
  );
}

export function parseFaIconType(type: GC): string {
  switch (type) {
    // string
    case GC.CHAR:
    case GC.VARCHAR:
    case GC.TINYTEXT:
    case GC.MEDIUMTEXT:
    case GC.TEXT:
    case GC.LONGTEXT:
    case GC.CLOB:
      return "fa-font";
    // time
    case GC.TIME:
    case GC.TIME_WITH_TIME_ZONE:
      return "fa-clock";
    // date
    case GC.DATE:
      return "fa-calendar";
    // datetime
    case GC.TIMESTAMP:
    case GC.TIMESTAMP_WITH_TIME_ZONE:
      return "fa-calendar-times";
    // int, long
    case GC.TINYINT:
    case GC.SMALLINT:
    case GC.INTEGER:
    case GC.BIGINT:
    case GC.LONG:
    case GC.LONGLONG:
    case GC.SERIAL:
      return "fa-sort-numeric-down";
    // float, double, real
    case GC.DECIMAL:
    case GC.FLOAT:
    case GC.DOUBLE_PRECISION:
    case GC.REAL:
      return "fa-sort-numeric-down";
    // number
    case GC.NUMERIC:
      return "fa-sort-numeric-down";
    // money
    case GC.MONEY:
      return "fa-money-bill-alt";
    // bit
    case GC.BIT:
    case GC.VARBIT:
      return "fa-chess-board";
    // boolean
    case GC.BOOLEAN:
      return "fa-chess-board";
    // json
    case GC.JSON:
    case GC.JSONB:
      return "fa-code";
    // binary or blob
    case GC.BINARY:
    case GC.BYTEA:
    case GC.BLOB:
    case GC.MEDIUMBLOB:
    case GC.LONGBLOB:
    case GC.TINYBLOB:
      return "fa-chess-board";
    // array
    case GC.ARRAY:
    case GC.STRING_ARRAY:
    case GC.NUMERIC_ARRAY:
    case GC.BINARY_ARRAY:
      return "fa-list";
    // object
    case GC.OBJECT:
    case GC.VARIANT:
      return "fa-folder";
    // etc
    case GC.BOX:
    case GC.CIDR:
    case GC.CIRCLE:
    case GC.INET:
    case GC.LINE:
    case GC.LSEG:
    case GC.MACADDR:
    case GC.PATH:
    case GC.PG_LSN:
    case GC.POINT:
    case GC.POLYGON:
    case GC.TSQUERY:
    case GC.TSVECTOR:
    case GC.TXID_SNAPSHOT:
    case GC.UUID:
    case GC.XML:
    case GC.NAME:
    case GC.XID:
    case GC.INTERVAL:
    case GC.OID:
    case GC.REGTYPE:
    case GC.REGPROC:
    case GC.PG_NODE_TREE:
    case GC.PG_NDISTINCT:
    case GC.PG_DEPENDENCIES:
    case GC.UNIQUEIDENTIFIER:
    case GC.NULL:
    case GC.UNKNOWN:
      return "fa-question-circle";
    // enum, set
    case GC.ENUM:
      return "fa-list";
    case GC.SET:
      return "fa-list-ol";
    default:
      return "fa-question-circle";
  }
}
