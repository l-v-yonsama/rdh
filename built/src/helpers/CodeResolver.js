"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCodeLabel = void 0;
const tslib_1 = require("tslib");
const resource_1 = require("../resource");
const utils_1 = require("../utils");
const resolveCodeLabel = (rdh) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { tableName, codeItems } = rdh.meta;
    if (!codeItems) {
        return false;
    }
    const matchResource = (regex, pattern, target) => {
        if (regex) {
            return new RegExp(pattern, "i").test(target);
        }
        return (0, utils_1.equalsIgnoreCase)(target, pattern);
    };
    const columnNames = rdh.keys.map((it) => it.name);
    const filteredCodeItems = codeItems.filter((it) => {
        if (it.resource.table) {
            const { regex, pattern } = it.resource.table;
            if (!matchResource(regex, pattern, tableName)) {
                return false;
            }
        }
        const { regex, pattern } = it.resource.column;
        return columnNames.some((columnName) => matchResource(regex, pattern, columnName));
    });
    if (filteredCodeItems.length === 0) {
        return false;
    }
    for (const row of rdh.rows) {
        columnNames.forEach((columnName) => {
            var _a;
            const columnValue = row.values[columnName];
            const items = (_a = filteredCodeItems.filter((it) => matchResource(it.resource.column.regex, it.resource.column.pattern, columnName))) !== null && _a !== void 0 ? _a : [];
            items.forEach((item) => {
                const codeLabel = item.details.find((detail) => detail.code == columnValue);
                if (codeLabel) {
                    resource_1.RowHelper.pushAnnotation(row, columnName, {
                        type: "Cod",
                        values: {
                            label: codeLabel.label,
                            isUndefined: false,
                        },
                    });
                }
                else if (columnValue) {
                    resource_1.RowHelper.pushAnnotation(row, columnName, {
                        type: "Cod",
                        values: {
                            label: "Undefined",
                            isUndefined: true,
                        },
                    });
                }
            });
        });
    }
    return true;
});
exports.resolveCodeLabel = resolveCodeLabel;
//# sourceMappingURL=CodeResolver.js.map