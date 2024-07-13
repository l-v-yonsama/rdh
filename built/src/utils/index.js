"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./base"), exports);
tslib_1.__exportStar(require("./strings"), exports);
function isDate(value) {
    if (value == null) {
        return false;
    }
    return (value instanceof Date ||
        (typeof value === "object" &&
            Object.prototype.toString.call(value) === "[object Date]"));
}
exports.default = isDate;
//# sourceMappingURL=index.js.map