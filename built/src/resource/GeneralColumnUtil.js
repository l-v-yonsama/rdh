"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFaIconType = exports.isArray = exports.isEnumOrSet = exports.isBooleanLike = exports.isJsonLike = exports.isUUIDType = exports.isTime = exports.isDateTimeOrDateOrTime = exports.isDateTimeOrDate = exports.isNotSupportDiffType = exports.isGeometryLike = exports.isBinaryLike = exports.isTextLike = exports.isNumericLike = exports.parseColumnType = exports.displayGeneralColumnType = void 0;
const types_1 = require("../types");
function displayGeneralColumnType(columnType) {
    return columnType.toUpperCase();
}
exports.displayGeneralColumnType = displayGeneralColumnType;
function parseColumnType(s) {
    if (s === undefined || s === null) {
        return types_1.GeneralColumnType.UNKNOWN;
    }
    s = s.toLowerCase();
    if (["var_string", "nvarchar"].includes(s)) {
        return types_1.GeneralColumnType.VARCHAR;
    }
    else if (["bpchar", "nchar"].includes(s)) {
        return types_1.GeneralColumnType.CHAR;
    }
    else if (["ntext"].includes(s)) {
        return types_1.GeneralColumnType.TEXT;
    }
    else if ("tiny" === s) {
        return types_1.GeneralColumnType.TINYINT;
    }
    else if ("datetime" === s || "timestamp(6)" === s) {
        return types_1.GeneralColumnType.TIMESTAMP;
    }
    else if ("varchar2" === s) {
        return types_1.GeneralColumnType.VARCHAR;
    }
    else if ("number" === s) {
        return types_1.GeneralColumnType.NUMERIC;
    }
    else if ("int" === s) {
        return types_1.GeneralColumnType.INTEGER;
    }
    const list = Object.values(types_1.GeneralColumnType);
    const m = list.find((it) => it == s);
    if (m) {
        return m;
    }
    console.log("L35 unknown", s);
    return types_1.GeneralColumnType.UNKNOWN;
}
exports.parseColumnType = parseColumnType;
function isNumericLike(type) {
    switch (type) {
        case types_1.GeneralColumnType.TINYINT:
        case types_1.GeneralColumnType.SMALLINT:
        case types_1.GeneralColumnType.MEDIUMINT:
        case types_1.GeneralColumnType.INTEGER:
        case types_1.GeneralColumnType.LONG:
        case types_1.GeneralColumnType.LONGLONG:
        case types_1.GeneralColumnType.BIGINT:
        case types_1.GeneralColumnType.SERIAL:
        case types_1.GeneralColumnType.MONEY:
        case types_1.GeneralColumnType.YEAR:
        case types_1.GeneralColumnType.FLOAT:
        case types_1.GeneralColumnType.DOUBLE_PRECISION:
        case types_1.GeneralColumnType.NUMERIC:
        case types_1.GeneralColumnType.DECIMAL:
            return true;
    }
    return false;
}
exports.isNumericLike = isNumericLike;
function isTextLike(type) {
    switch (type) {
        case types_1.GeneralColumnType.CHAR:
        case types_1.GeneralColumnType.VARCHAR:
        case types_1.GeneralColumnType.TINYTEXT:
        case types_1.GeneralColumnType.MEDIUMTEXT:
        case types_1.GeneralColumnType.TEXT:
        case types_1.GeneralColumnType.LONGTEXT:
            return true;
    }
    return false;
}
exports.isTextLike = isTextLike;
function isBinaryLike(type) {
    switch (type) {
        case types_1.GeneralColumnType.BYTEA:
        case types_1.GeneralColumnType.BLOB:
        case types_1.GeneralColumnType.MEDIUMBLOB:
        case types_1.GeneralColumnType.LONGBLOB:
        case types_1.GeneralColumnType.TINYBLOB:
        case types_1.GeneralColumnType.BINARY:
        case types_1.GeneralColumnType.VARBINARY:
            return true;
    }
    return false;
}
exports.isBinaryLike = isBinaryLike;
function isGeometryLike(type) {
    switch (type) {
        case types_1.GeneralColumnType.GEOMETRY:
        case types_1.GeneralColumnType.POINT:
        case types_1.GeneralColumnType.POLYGON:
            return true;
    }
    return false;
}
exports.isGeometryLike = isGeometryLike;
function isNotSupportDiffType(type) {
    if (isBinaryLike(type) || isGeometryLike(type)) {
        return true;
    }
    if (type === types_1.GeneralColumnType.UNKNOWN) {
        return true;
    }
    return false;
}
exports.isNotSupportDiffType = isNotSupportDiffType;
function isDateTimeOrDate(type) {
    switch (type) {
        case types_1.GeneralColumnType.DATE:
        case types_1.GeneralColumnType.TIMESTAMP:
        case types_1.GeneralColumnType.TIMESTAMP_WITH_TIME_ZONE:
            return true;
    }
    return false;
}
exports.isDateTimeOrDate = isDateTimeOrDate;
function isDateTimeOrDateOrTime(type) {
    switch (type) {
        case types_1.GeneralColumnType.TIME:
        case types_1.GeneralColumnType.TIME_WITH_TIME_ZONE:
        case types_1.GeneralColumnType.DATE:
        case types_1.GeneralColumnType.TIMESTAMP:
        case types_1.GeneralColumnType.TIMESTAMP_WITH_TIME_ZONE:
            return true;
    }
    return false;
}
exports.isDateTimeOrDateOrTime = isDateTimeOrDateOrTime;
function isTime(type) {
    switch (type) {
        case types_1.GeneralColumnType.TIME:
        case types_1.GeneralColumnType.TIME_WITH_TIME_ZONE:
            return true;
    }
    return false;
}
exports.isTime = isTime;
function isUUIDType(type) {
    return type === types_1.GeneralColumnType.UUID;
}
exports.isUUIDType = isUUIDType;
function isJsonLike(type) {
    return types_1.GeneralColumnType.JSON === type || types_1.GeneralColumnType.JSONB === type;
}
exports.isJsonLike = isJsonLike;
function isBooleanLike(type) {
    return types_1.GeneralColumnType.BOOLEAN === type || types_1.GeneralColumnType.BIT === type;
}
exports.isBooleanLike = isBooleanLike;
function isEnumOrSet(type) {
    return types_1.GeneralColumnType.ENUM === type || types_1.GeneralColumnType.SET === type;
}
exports.isEnumOrSet = isEnumOrSet;
function isArray(type) {
    return types_1.GeneralColumnType.ARRAY === type;
}
exports.isArray = isArray;
function parseFaIconType(type) {
    switch (type) {
        case types_1.GeneralColumnType.CHAR:
        case types_1.GeneralColumnType.VARCHAR:
        case types_1.GeneralColumnType.TINYTEXT:
        case types_1.GeneralColumnType.MEDIUMTEXT:
        case types_1.GeneralColumnType.TEXT:
        case types_1.GeneralColumnType.LONGTEXT:
        case types_1.GeneralColumnType.CLOB:
            return "fa-font";
        case types_1.GeneralColumnType.TIME:
        case types_1.GeneralColumnType.TIME_WITH_TIME_ZONE:
            return "fa-clock";
        case types_1.GeneralColumnType.DATE:
            return "fa-calendar";
        case types_1.GeneralColumnType.TIMESTAMP:
        case types_1.GeneralColumnType.TIMESTAMP_WITH_TIME_ZONE:
            return "fa-calendar-times";
        case types_1.GeneralColumnType.TINYINT:
        case types_1.GeneralColumnType.SMALLINT:
        case types_1.GeneralColumnType.INTEGER:
        case types_1.GeneralColumnType.BIGINT:
        case types_1.GeneralColumnType.LONG:
        case types_1.GeneralColumnType.LONGLONG:
        case types_1.GeneralColumnType.SERIAL:
            return "fa-sort-numeric-down";
        case types_1.GeneralColumnType.DECIMAL:
        case types_1.GeneralColumnType.FLOAT:
        case types_1.GeneralColumnType.DOUBLE_PRECISION:
        case types_1.GeneralColumnType.REAL:
            return "fa-sort-numeric-down";
        case types_1.GeneralColumnType.NUMERIC:
            return "fa-sort-numeric-down";
        case types_1.GeneralColumnType.MONEY:
            return "fa-money-bill-alt";
        case types_1.GeneralColumnType.BIT:
        case types_1.GeneralColumnType.VARBIT:
            return "fa-chess-board";
        case types_1.GeneralColumnType.BOOLEAN:
            return "fa-chess-board";
        case types_1.GeneralColumnType.JSON:
        case types_1.GeneralColumnType.JSONB:
            return "fa-code";
        case types_1.GeneralColumnType.BINARY:
        case types_1.GeneralColumnType.BYTEA:
        case types_1.GeneralColumnType.BLOB:
        case types_1.GeneralColumnType.MEDIUMBLOB:
        case types_1.GeneralColumnType.LONGBLOB:
        case types_1.GeneralColumnType.TINYBLOB:
            return "fa-chess-board";
        case types_1.GeneralColumnType.ARRAY:
            return "fa-list";
        case types_1.GeneralColumnType.OBJECT:
        case types_1.GeneralColumnType.VARIANT:
            return "fa-folder";
        case types_1.GeneralColumnType.BOX:
        case types_1.GeneralColumnType.CIDR:
        case types_1.GeneralColumnType.CIRCLE:
        case types_1.GeneralColumnType.INET:
        case types_1.GeneralColumnType.LINE:
        case types_1.GeneralColumnType.LSEG:
        case types_1.GeneralColumnType.MACADDR:
        case types_1.GeneralColumnType.PATH:
        case types_1.GeneralColumnType.PG_LSN:
        case types_1.GeneralColumnType.POINT:
        case types_1.GeneralColumnType.POLYGON:
        case types_1.GeneralColumnType.TSQUERY:
        case types_1.GeneralColumnType.TSVECTOR:
        case types_1.GeneralColumnType.TXID_SNAPSHOT:
        case types_1.GeneralColumnType.UUID:
        case types_1.GeneralColumnType.XML:
        case types_1.GeneralColumnType.NAME:
        case types_1.GeneralColumnType.XID:
        case types_1.GeneralColumnType.INTERVAL:
        case types_1.GeneralColumnType.OID:
        case types_1.GeneralColumnType.REGTYPE:
        case types_1.GeneralColumnType.REGPROC:
        case types_1.GeneralColumnType.PG_NODE_TREE:
        case types_1.GeneralColumnType.PG_NDISTINCT:
        case types_1.GeneralColumnType.PG_DEPENDENCIES:
        case types_1.GeneralColumnType.UNKNOWN:
            return "fa-question-circle";
        case types_1.GeneralColumnType.ENUM:
            return "fa-list";
        case types_1.GeneralColumnType.SET:
            return "fa-list-ol";
        default:
            return "fa-question-circle";
    }
}
exports.parseFaIconType = parseFaIconType;
//# sourceMappingURL=GeneralColumnUtil.js.map