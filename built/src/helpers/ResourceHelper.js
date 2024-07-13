"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffToUndoChanges = exports.diff = void 0;
const tslib_1 = require("tslib");
const lodash_isequal_1 = tslib_1.__importDefault(require("lodash.isequal"));
const resource_1 = require("../resource");
const utils_1 = tslib_1.__importDefault(require("../utils"));
const diff = (rdh1, rdh2) => {
    var _a, _b, _c;
    const result = {
        ok: false,
        deleted: 0,
        inserted: 0,
        updated: 0,
        message: "",
    };
    if (!((_a = rdh1.meta) === null || _a === void 0 ? void 0 : _a.compareKeys) || ((_b = rdh1.meta) === null || _b === void 0 ? void 0 : _b.compareKeys.length) === 0) {
        result.message = "Missing compare key (Primary or uniq key).";
        return result;
    }
    const rdb1 = resource_1.ResultSetDataBuilder.from(rdh1);
    const rdb2 = resource_1.ResultSetDataBuilder.from(rdh2);
    const keynames = rdb1.keynames();
    const compareKey = getAvailableCompareKey(keynames, (_c = rdh1.meta) === null || _c === void 0 ? void 0 : _c.compareKeys);
    if (!compareKey) {
        result.message = "Missing available compare key (Primary or uniq key).";
        return result;
    }
    const notSupportedCompareKeys = rdb1.rs.keys
        .filter((it) => compareKey.names.includes(it.name))
        .filter((it) => (0, resource_1.isNotSupportDiffType)(it.type));
    if (notSupportedCompareKeys.length) {
        const keys = notSupportedCompareKeys
            .map((it) => `${it.name}: ${(0, resource_1.displayGeneralColumnType)(it.type)}`)
            .join(",");
        result.message = `Not supported compare keys (${keys}).`;
        return result;
    }
    const supportedKeyNames = rdb1.rs.keys
        .filter((it) => !(0, resource_1.isNotSupportDiffType)(it.type))
        .map((it) => it.name);
    const hasAlreadyChecked = new Set();
    resource_1.RdhHelper.clearAllAnotations(rdb1.rs);
    resource_1.RdhHelper.clearAllAnotations(rdb2.rs);
    rdh1.rows.forEach((row1) => {
        const key1 = createCompareKeysValue(compareKey, row1);
        hasAlreadyChecked.add(key1);
        let removed = true;
        for (const row2 of rdh2.rows) {
            const key2 = createCompareKeysValue(compareKey, row2);
            if (key1 === key2) {
                removed = false;
                let updated = false;
                supportedKeyNames.forEach((name) => {
                    const v1 = row1.values[name];
                    const v2 = row2.values[name];
                    if (!equals(v1, v2)) {
                        updated = true;
                        resource_1.RowHelper.pushAnnotation(row1, name, {
                            type: "Upd",
                            values: {
                                otherValue: row2.values[name],
                            },
                        });
                        resource_1.RowHelper.pushAnnotation(row2, name, {
                            type: "Upd",
                            values: {
                                otherValue: row1.values[name],
                            },
                        });
                    }
                });
                if (updated) {
                    result.updated++;
                }
                break;
            }
        }
        if (removed) {
            if (supportedKeyNames.length) {
                supportedKeyNames.forEach((name) => {
                    resource_1.RowHelper.pushAnnotation(row1, name, { type: "Del" });
                });
                result.deleted++;
            }
        }
    });
    rdh2.rows.forEach((row2) => {
        const key2 = createCompareKeysValue(compareKey, row2);
        if (!hasAlreadyChecked.has(key2)) {
            keynames.forEach((name) => {
                resource_1.RowHelper.pushAnnotation(row2, name, { type: "Add" });
            });
            result.inserted++;
        }
    });
    result.ok = true;
    if (result.inserted === 0 && result.deleted === 0 && result.updated === 0) {
        result.message = "No changes";
    }
    else {
        result.message = `Inserted:${result.inserted}, Deleted:${result.deleted}, Updated:${result.updated}`;
    }
    return result;
};
exports.diff = diff;
const diffToUndoChanges = (rdh1, rdh2) => {
    var _a, _b, _c;
    const result = {
        ok: false,
        message: "",
        toBeDeleted: [],
        toBeInserted: [],
        toBeUpdated: [],
    };
    if (!((_a = rdh1.meta) === null || _a === void 0 ? void 0 : _a.compareKeys) || ((_b = rdh1.meta) === null || _b === void 0 ? void 0 : _b.compareKeys.length) === 0) {
        result.message = "Missing compare key (Primary or uniq key).";
        return result;
    }
    const rdb1 = resource_1.ResultSetDataBuilder.from(rdh1);
    const rdb2 = resource_1.ResultSetDataBuilder.from(rdh2);
    const keynames = rdb1.keynames();
    const compareKey = getAvailableCompareKey(keynames, (_c = rdh1.meta) === null || _c === void 0 ? void 0 : _c.compareKeys);
    if (!compareKey) {
        result.message = "Missing available compare key (Primary or uniq key).";
        return result;
    }
    const notSupportedCompareKeys = rdb1.rs.keys
        .filter((it) => compareKey.names.includes(it.name))
        .filter((it) => (0, resource_1.isNotSupportDiffType)(it.type));
    if (notSupportedCompareKeys.length) {
        const keys = notSupportedCompareKeys
            .map((it) => `${it.name}: ${(0, resource_1.displayGeneralColumnType)(it.type)}`)
            .join(",");
        result.message = `Not supported compare keys (${keys}).`;
        return result;
    }
    const supportedKeyNames = rdb1.rs.keys
        .filter((it) => !(0, resource_1.isNotSupportDiffType)(it.type))
        .map((it) => it.name);
    const notSupportedKeyNames = rdb1.rs.keys
        .filter((it) => (0, resource_1.isNotSupportDiffType)(it.type))
        .map((it) => it.name);
    const hasAlreadyChecked = new Set();
    resource_1.RdhHelper.clearAllAnotations(rdb1.rs);
    resource_1.RdhHelper.clearAllAnotations(rdb2.rs);
    rdh1.rows.forEach((row1) => {
        const key1 = createCompareKeysValue(compareKey, row1);
        hasAlreadyChecked.add(key1);
        let removed = true;
        for (const row2 of rdh2.rows) {
            const key2 = createCompareKeysValue(compareKey, row2);
            if (key1 === key2) {
                removed = false;
                let updated = false;
                const values = {};
                supportedKeyNames.forEach((name) => {
                    const v1 = row1.values[name];
                    const v2 = row2.values[name];
                    if (!equals(v1, v2)) {
                        updated = true;
                        values[name] = v1;
                    }
                });
                if (updated) {
                    result.toBeUpdated.push({
                        conditions: createConditionsByCompareKeys(compareKey, row2),
                        values,
                    });
                }
                break;
            }
        }
        if (removed) {
            const { values } = row1;
            if (notSupportedKeyNames.length) {
                notSupportedKeyNames.forEach((it) => {
                    delete values[it];
                });
            }
            result.toBeInserted.push({
                values,
            });
        }
    });
    rdh2.rows.forEach((row2) => {
        const key2 = createCompareKeysValue(compareKey, row2);
        if (!hasAlreadyChecked.has(key2)) {
            result.toBeDeleted.push({
                conditions: createConditionsByCompareKeys(compareKey, row2),
            });
        }
    });
    result.ok = true;
    if (result.toBeInserted.length === 0 &&
        result.toBeDeleted.length === 0 &&
        result.toBeUpdated.length === 0) {
        result.message = "No changes";
    }
    else {
        result.message = `toBeInserted:${result.toBeInserted.length}, toBeDeleted:${result.toBeDeleted.length}, toBeUpdated:${result.toBeUpdated.length}`;
    }
    return result;
};
exports.diffToUndoChanges = diffToUndoChanges;
function createCompareKeysValue(compareKey, row1) {
    return compareKey.names.map((k) => { var _a; return (_a = row1.values[k]) !== null && _a !== void 0 ? _a : ""; }).join("|:|");
}
function createConditionsByCompareKeys(compareKey, row1) {
    const conditions = {};
    compareKey.names.forEach((it) => {
        conditions[it] = row1.values[it];
    });
    return conditions;
}
function getAvailableCompareKey(keynames, compareKeys) {
    for (const ckey of compareKeys) {
        if (ckey.names.every((it) => keynames.includes(it))) {
            return ckey;
        }
    }
    return undefined;
}
function equals(a, b) {
    if ((0, utils_1.default)(a) && (0, utils_1.default)(b)) {
        return a.getTime() === b.getTime();
    }
    return (0, lodash_isequal_1.default)(a, b);
}
//# sourceMappingURL=ResourceHelper.js.map