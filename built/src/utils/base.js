"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqObjectKeys = exports.toTime = exports.toDate = exports.toBoolean = exports.toNum = exports.sleep = exports.castTo = void 0;
const tslib_1 = require("tslib");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
function castTo(o) {
    return o;
}
exports.castTo = castTo;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
exports.sleep = sleep;
const toNum = (s) => {
    if (s === null || s === undefined) {
        return undefined;
    }
    if (typeof s === "number") {
        return s;
    }
    if (s.trim().length === 0) {
        return undefined;
    }
    const n = Number(s);
    if (isNaN(n)) {
        return undefined;
    }
    return n;
};
exports.toNum = toNum;
const toBoolean = (s) => {
    if (s === null || s === undefined) {
        return undefined;
    }
    if (typeof s === "boolean") {
        return s;
    }
    if (s instanceof Buffer) {
        const buf = s;
        return buf.at(0) === 1;
    }
    if (s.trim().length === 0) {
        return undefined;
    }
    return ("t" === s.toLowerCase() ||
        "true" === s.toLowerCase() ||
        "1" === s.toLowerCase());
};
exports.toBoolean = toBoolean;
const toDate = (s) => {
    if (s === null || s === undefined) {
        return undefined;
    }
    if (typeof s === "object") {
        if (s instanceof Date) {
            return s;
        }
    }
    if (typeof s === "number") {
        return new Date(s);
    }
    if (s.trim().length === 0) {
        return undefined;
    }
    if (/^(now|CURRENT_TIMESTAMP)$/i.test(s)) {
        return new Date();
    }
    if (/^(today|CURRENT_DATE)$/i.test(s)) {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }
    const r = (0, dayjs_1.default)(s).toDate();
    return r;
};
exports.toDate = toDate;
const toTime = (s) => {
    if (s === null || s === undefined) {
        return undefined;
    }
    if (s.trim().length === 0) {
        return undefined;
    }
    if ("now" === s.toLowerCase()) {
        return (0, dayjs_1.default)().format("HH:mm:ss");
    }
    return s;
};
exports.toTime = toTime;
const getUniqObjectKeys = (list) => {
    const keys = new Set();
    list
        .filter((it) => it !== undefined && it !== null)
        .forEach((it) => {
        Object.keys(it).forEach((key) => {
            keys.add(key);
        });
    });
    return [...keys];
};
exports.getUniqObjectKeys = getUniqObjectKeys;
//# sourceMappingURL=base.js.map