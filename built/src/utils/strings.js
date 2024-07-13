"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = exports.containsIgnoreCase = exports.equalsIgnoreCase = exports.abbr = exports.eolToSpace = exports.toLines = void 0;
const toLines = (s) => {
    return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(/\n/);
};
exports.toLines = toLines;
const eolToSpace = (s) => {
    return s
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n/g, " ")
        .replace(/ +/g, " ");
};
exports.eolToSpace = eolToSpace;
const abbr = (s, len = 10) => {
    if (!s || len <= 0) {
        return s;
    }
    if (s.length > len) {
        const half = Math.floor(Math.min(s.length, len) / 2 - 1);
        return s.substring(0, half) + ".." + s.substring(s.length - half);
    }
    else {
        return s;
    }
};
exports.abbr = abbr;
const equalsIgnoreCase = (s1, s2) => {
    return s1.toLocaleLowerCase() === s2.toLocaleLowerCase();
};
exports.equalsIgnoreCase = equalsIgnoreCase;
const containsIgnoreCase = (keyword, list) => {
    const k = keyword.toLocaleLowerCase();
    return list
        .filter((it) => it !== undefined && it.length > 0)
        .some((it) => it.toLocaleLowerCase().indexOf(k) >= 0);
};
exports.containsIgnoreCase = containsIgnoreCase;
function isDate(value) {
    if (value == null) {
        return false;
    }
    return (value instanceof Date ||
        (typeof value === "object" &&
            Object.prototype.toString.call(value) === "[object Date]"));
}
exports.default = isDate;
const escapeHtml = (s) => {
    if (typeof s !== "string") {
        return s;
    }
    return s.replace(/[&'`"<>]/g, function (match) {
        return {
            "&": "&amp;",
            "'": "&#x27;",
            "`": "&#x60;",
            '"': "&quot;",
            "<": "&lt;",
            ">": "&gt;",
        }[match];
    });
};
exports.escapeHtml = escapeHtml;
//# sourceMappingURL=strings.js.map