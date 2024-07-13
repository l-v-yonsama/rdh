"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultSetDataBuilder = exports.RdhHelper = exports.RowHelper = exports.isResultSetDataBuilder = exports.createRdhKey = void 0;
const tslib_1 = require("tslib");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const list_it_1 = tslib_1.__importDefault(require("list-it"));
const shuffle_array_1 = tslib_1.__importDefault(require("shuffle-array"));
const ss = tslib_1.__importStar(require("simple-statistics"));
const types_1 = require("../types");
const utils_1 = tslib_1.__importStar(require("../utils"));
const GeneralColumnUtil_1 = require("./GeneralColumnUtil");
const MAX_CELL_VALUE_LENGTH = 50;
const MAX_PRINT_LINE = 10;
const EOL = "\n";
function createRdhKey({ name, comment, type, width, required, align, meta, }) {
    if (align === undefined) {
        if ((0, GeneralColumnUtil_1.isNumericLike)(type)) {
            align = "right";
        }
        else if ((0, GeneralColumnUtil_1.isTextLike)(type)) {
            align = "left";
        }
    }
    const key = {
        name,
        type: type !== null && type !== void 0 ? type : types_1.GeneralColumnType.UNKNOWN,
        comment,
        width,
        required,
        align,
        meta,
    };
    return key;
}
exports.createRdhKey = createRdhKey;
function isResultSetDataBuilder(item) {
    return item.rs && (0, types_1.isResultSetData)(item.rs);
}
exports.isResultSetDataBuilder = isResultSetDataBuilder;
function toRdhKeys(keys) {
    return keys.map((k) => {
        if (typeof k === "string") {
            return createRdhKey({ name: k });
        }
        else {
            return k;
        }
    });
}
class RowHelper {
    static getRuleEngineValues(row, keys) {
        const ret = {};
        keys.forEach((key) => {
            const v = row.values[key.name];
            if ((0, GeneralColumnUtil_1.isDateTimeOrDate)(key.type)) {
                if (v === null || v === undefined) {
                    ret[key.name] = v;
                }
                else {
                    ret[key.name] = (0, dayjs_1.default)(v).valueOf();
                }
            }
            else {
                ret[key.name] = v;
            }
        });
        return ret;
    }
    static pushAnnotation(row, key, annotation) {
        if (row.meta[key] === undefined) {
            row.meta[key] = new Array();
        }
        row.meta[key].push(annotation);
    }
    static getFirstAnnotationOf(row, key, type) {
        if (row.meta[key]) {
            const annotations = row.meta[key];
            if (annotations) {
                return annotations.find((a) => a.type === type);
            }
        }
        return undefined;
    }
    static filterAnnotationOf(row, type) {
        const keys = Object.keys(row.meta);
        return keys
            .filter((key) => row.meta[key].some((it) => it.type === type))
            .reduce((p, key) => {
            const obj = Object.assign({}, p);
            obj[key] = row.meta[key].filter((it) => it.type === type);
            return obj;
        }, {});
    }
    static filterAnnotationByKeyOf(row, key, type) {
        var _a;
        if (row.meta[key]) {
            const annotations = row.meta[key];
            return ((_a = annotations === null || annotations === void 0 ? void 0 : annotations.filter((a) => a.type === type)) !== null && _a !== void 0 ? _a : []);
        }
        return [];
    }
    static clearAllAnnotations(row) {
        Object.keys(row.meta).forEach((key) => {
            delete row.meta[key];
        });
    }
    static clearAnnotationByType(row, type) {
        const meta_keys = Object.keys(row.meta);
        if (meta_keys.length > 0) {
            for (let i = 0; i < meta_keys.length; i++) {
                const annotations = row.meta[meta_keys[i]];
                if (!annotations) {
                    continue;
                }
                for (let j = 0; j < annotations.length; j++) {
                    if (annotations[j].type === type) {
                        annotations.splice(j, 1);
                        j--;
                    }
                }
            }
        }
    }
    static hasAnyAnnotation(row, types) {
        var _a, _b, _c;
        if (row.meta && types.length) {
            return ((_c = (_b = (_a = Object.values(row.meta)) === null || _a === void 0 ? void 0 : _a.flat()) === null || _b === void 0 ? void 0 : _b.some((it) => types.includes(it.type))) !== null && _c !== void 0 ? _c : false);
        }
        return false;
    }
    static hasAnnotation(row, type) {
        return this.hasAnyAnnotation(row, [type]);
    }
    static hasRuleAnnotation(row, ruleDetail) {
        if (row.meta && row.meta[ruleDetail.error.column]) {
            const v = row.meta[ruleDetail.error.column];
            return v.some((it) => it.type === "Rul" && it.values.name === ruleDetail.ruleName);
        }
        return false;
    }
    static getFirstRuleAnnotation(row, ruleDetail) {
        if (row.meta && row.meta[ruleDetail.error.column]) {
            const v = row.meta[ruleDetail.error.column];
            return v.find((it) => it.type === "Rul" && it.values.name === ruleDetail.ruleName);
        }
        return undefined;
    }
}
exports.RowHelper = RowHelper;
class RdhHelper {
    static clearAllAnotations(rdh) {
        rdh.rows.forEach((row) => RowHelper.clearAllAnnotations(row));
    }
}
exports.RdhHelper = RdhHelper;
class ResultSetDataBuilder {
    constructor(keys) {
        this.rs = {
            created: new Date(),
            keys: toRdhKeys(keys),
            rows: [],
            meta: {},
        };
    }
    build() {
        return this.rs;
    }
    updateKeyComment(keyName, comment) {
        const key = this.rs.keys.find((it) => it.name === keyName);
        if (key) {
            key.comment = comment;
        }
    }
    updateKeyName(keyName, newKeyName) {
        const key = this.rs.keys.find((it) => it.name === keyName);
        if (key) {
            key.name = newKeyName;
        }
        else {
            return;
        }
        this.rs.rows.forEach((row) => {
            const oldMeta = row.meta[keyName];
            row.meta[newKeyName] = oldMeta;
            delete row.meta[keyName];
            const oldValue = row.values[keyName];
            row.values[newKeyName] = oldValue;
            delete row.values[keyName];
        });
    }
    updateKeyWidth(keyName, width) {
        const key = this.rs.keys.find((it) => it.name === keyName);
        if (key) {
            key.width = width;
        }
    }
    updateKeyAlign(keyName, align) {
        const key = this.rs.keys.find((it) => it.name === keyName);
        if (key) {
            key.align = align;
        }
    }
    updateMeta(params) {
        Object.entries(params).forEach(([k, v]) => {
            this.rs.meta[k] = v;
        });
    }
    static createEmpty() {
        const rdh = new ResultSetDataBuilder([
            {
                name: "message",
                comment: "",
                type: types_1.GeneralColumnType.TEXT,
                width: 200,
            },
        ]);
        rdh.addRow({ message: "empty result set" });
        return rdh.build();
    }
    static from(list, options) {
        if (list === undefined || list === null || list === "") {
            throw new Error(typeof list + " has no value.");
        }
        const cloneFromRdh = (obj) => {
            const plainObj = JSON.parse(JSON.stringify(obj));
            const rdb = new ResultSetDataBuilder(plainObj.keys);
            const dateKeys = rdb.rs.keys
                .filter((k) => (0, GeneralColumnUtil_1.isDateTimeOrDate)(k.type))
                .map((k) => k.name);
            plainObj.rows.forEach((row) => {
                const { values, meta } = row;
                for (const dateKey of dateKeys) {
                    const v = values[dateKey];
                    values[dateKey] = v === null ? null : (0, utils_1.toDate)(v);
                }
                rdb.addRow(values, meta);
            });
            if (plainObj.meta) {
                Object.keys(plainObj.meta).forEach((key) => {
                    rdb.rs.meta[key] = plainObj.meta[key];
                });
            }
            rdb.rs["created"] = (0, utils_1.toDate)(plainObj.created);
            rdb.rs.sqlStatement = plainObj.sqlStatement;
            rdb.rs.summary = plainObj.summary;
            rdb.rs.shuffledIndexes = plainObj.shuffledIndexes;
            rdb.rs.shuffledNextCounter = plainObj.shuffledNextCounter;
            rdb.rs.mergeCells = plainObj.mergeCells;
            rdb.rs.queryConditions = plainObj.queryConditions;
            return rdb;
        };
        if ((0, types_1.isResultSetData)(list)) {
            return cloneFromRdh(list);
        }
        if (isResultSetDataBuilder(list)) {
            return cloneFromRdh(list.rs);
        }
        const t = typeof list;
        let ret;
        const strTitles = [];
        if (options === null || options === void 0 ? void 0 : options.keyNames) {
            strTitles.push(...options.keyNames);
        }
        if (list instanceof Array) {
            if (list.length > 0) {
                let elm = list[0];
                if (elm instanceof Array) {
                    let i = strTitles.length + 1;
                    while (strTitles.length < elm.length) {
                        strTitles.push(`K${i++}`);
                    }
                    ret = new ResultSetDataBuilder(strTitles);
                    for (let r = 0; r < list.length; r++) {
                        elm = list[r];
                        const values = {};
                        for (let c = 0; c < elm.length; c++) {
                            values[strTitles[c]] = elm[c];
                        }
                        ret.addRow(values);
                    }
                }
            }
        }
        else {
            switch (t) {
                case "object":
                    ret = new ResultSetDataBuilder([
                        createRdhKey({
                            name: "KEY",
                            type: types_1.GeneralColumnType.TEXT,
                            width: 120,
                        }),
                        createRdhKey({
                            name: "TYPE",
                            type: types_1.GeneralColumnType.TEXT,
                            width: 80,
                        }),
                        createRdhKey({
                            name: "VALUE",
                            type: types_1.GeneralColumnType.JSON,
                            width: 400,
                        }),
                    ]);
                    Object.keys(list).forEach((k) => {
                        const v = list[k];
                        let type = typeof v;
                        if (v === null) {
                            type = "null";
                        }
                        const values = {};
                        values["KEY"] = k;
                        values["TYPE"] = type;
                        values["VALUE"] = v;
                        ret.addRow(values);
                    });
                    break;
            }
        }
        ret.resetKeyTypeByRows();
        return ret;
    }
    sampleCorrelation(key_x, key_y) {
        const x = this.toVector(key_x, true);
        const y = this.toVector(key_y, true);
        return ss.sampleCorrelation(x, y);
    }
    describe() {
        const desc_keys = new Array();
        this.rs.keys
            .filter((k) => (0, GeneralColumnUtil_1.isNumericLike)(k.type))
            .forEach((k) => {
            var _a;
            desc_keys.push(createRdhKey({
                name: k.name,
                type: k.type,
                comment: (_a = k.comment) !== null && _a !== void 0 ? _a : "",
            }));
        });
        desc_keys.unshift(createRdhKey({ name: "stat", type: types_1.GeneralColumnType.TEXT }));
        const ret = new ResultSetDataBuilder(desc_keys);
        const count_values = { stat: "count" };
        const mean_values = { stat: "mean" };
        const std_values = { stat: "std" };
        const min_values = { stat: "min" };
        const quatile25_values = { stat: "25%" };
        const median_values = { stat: "50%" };
        const quatile75_values = { stat: "75%" };
        const max_values = { stat: "max" };
        this.rs.keys.forEach((key) => {
            const num_list = this.toVector(key.name, true);
            count_values[key.name] = num_list.length;
            mean_values[key.name] = num_list.length === 0 ? "-" : ss.mean(num_list);
            std_values[key.name] =
                num_list.length === 0 ? "-" : ss.standardDeviation(num_list);
            min_values[key.name] = num_list.length === 0 ? "-" : ss.min(num_list);
            quatile25_values[key.name] =
                num_list.length === 0 ? "-" : ss.quantile(num_list, 0.25);
            median_values[key.name] =
                num_list.length === 0 ? "-" : ss.median(num_list);
            quatile75_values[key.name] =
                num_list.length === 0 ? "-" : ss.quantile(num_list, 0.75);
            max_values[key.name] = num_list.length === 0 ? "-" : ss.max(num_list);
        });
        ret.addRow(count_values);
        ret.addRow(mean_values);
        ret.addRow(std_values);
        ret.addRow(min_values);
        ret.addRow(quatile25_values);
        ret.addRow(median_values);
        ret.addRow(quatile75_values);
        ret.addRow(max_values);
        return ret.build();
    }
    splitRows(test_percentage, with_shuffle = false) {
        if (test_percentage >= 100) {
            test_percentage = 100;
        }
        if (test_percentage < 0) {
            test_percentage = 0;
        }
        const numTestExamples = Math.round((this.rs.rows.length * test_percentage) / 100);
        const numTrainExamples = this.rs.rows.length - numTestExamples;
        const train = new ResultSetDataBuilder(this.rs.keys);
        const test = new ResultSetDataBuilder(this.rs.keys);
        const cloned_rows = this.rs.rows.slice();
        if (with_shuffle) {
            (0, shuffle_array_1.default)(cloned_rows);
        }
        train.rs.rows.splice(0, train.rs.rows.length);
        test.rs.rows.splice(0, test.rs.rows.length);
        train.rs.rows.push(...cloned_rows.slice(0, numTrainExamples));
        test.rs.rows.push(...cloned_rows.slice(numTrainExamples));
        return [train.build(), test.build()];
    }
    sampleXKeysGroupByClass(numExamplesPerClass, xKeys, clazzKey, shuffle = false) {
        const ret = { clazzKey, sampleKeys: xKeys };
        const localIndexes = new Array();
        for (let i = 0; i < this.rs.rows.length; i++) {
            localIndexes.push(i);
        }
        if (shuffle) {
            ret.is_shuffled = true;
            (0, shuffle_array_1.default)(localIndexes);
        }
        const uniqClassValueSets = new Set();
        for (let j = 0; j < this.rs.rows.length; j++) {
            const row = this.rs.rows[localIndexes[j]];
            const clazz_value = row.values[clazzKey];
            uniqClassValueSets.add(clazz_value);
        }
        const uniqClassValues = Array.from(uniqClassValueSets).sort();
        uniqClassValues.forEach((uniq) => {
            const pair = {
                clazzValue: uniq,
                sampleValues: [],
            };
            ret.pairs.push(pair);
        });
        for (let j = 0; j < this.rs.rows.length; j++) {
            const row = this.rs.rows[localIndexes[j]];
            const innerX = new Array();
            xKeys.forEach((k) => {
                innerX.push(row.values[k]);
            });
            const clazz_value = row.values[clazzKey];
            const pair = ret.pairs.find((pair) => pair.clazzValue === clazz_value);
            if (pair && pair.sampleValues.length < numExamplesPerClass) {
                pair.sampleValues.push(innerX);
            }
            let num_full_clazz = 0;
            ret.pairs.forEach((pair) => {
                if (pair.sampleValues.length >= numExamplesPerClass) {
                    num_full_clazz++;
                }
            });
            if (num_full_clazz >= uniqClassValues.length) {
                break;
            }
        }
        return ret;
    }
    nextXYBatch(batch_size, xKeys, yKey) {
        if (this.rs.shuffledNextCounter === undefined) {
            this.rs.shuffledNextCounter = 0;
            this.rs.shuffledIndexes = new Array();
            for (let i = 0; i < this.rs.rows.length; i++) {
                this.rs.shuffledIndexes.push(i);
            }
            (0, shuffle_array_1.default)(this.rs.shuffledIndexes);
        }
        const x = new Array();
        const y = new Array();
        for (let j = 0; j < batch_size; j++) {
            const row = this.rs.rows[this.rs.shuffledIndexes[this.rs.shuffledNextCounter]];
            const innerX = new Array();
            xKeys.forEach((k) => {
                innerX.push(row.values[k]);
            });
            x.push(innerX);
            y.push(row.values[yKey]);
            this.rs.shuffledNextCounter++;
            if (this.rs.rows.length <= this.rs.shuffledNextCounter) {
                (0, shuffle_array_1.default)(this.rs.shuffledIndexes);
                this.rs.shuffledNextCounter = 0;
            }
        }
        return [x, y];
    }
    hasKey(key) {
        return this.rs.keys.some((k) => k.name === key);
    }
    hasKeyComment() {
        return this.rs.keys.some((k) => !!k.comment);
    }
    drop(key) {
        if (this.hasKey(key)) {
            this.rs.rows.forEach((v) => {
                delete v.values[key];
            });
            const idx = this.rs.keys.findIndex((k) => k.name === key);
            this.rs.keys.splice(idx, 1);
        }
    }
    assign(key, list) {
        if (list === undefined || list === null || list === "") {
            throw new Error(typeof list + " has no value.");
        }
        const constructor = list.constructor.name;
        this.drop(key);
        if (constructor === "Float32Array" || constructor === "Float64Array") {
            list = Array.from(list);
            this.rs.keys.push(createRdhKey({ name: key, type: types_1.GeneralColumnType.NUMERIC }));
        }
        else if (constructor === "Int8Array" ||
            constructor === "Int16Array" ||
            constructor === "Int32Array") {
            list = Array.from(list);
            this.rs.keys.push(createRdhKey({ name: key, type: types_1.GeneralColumnType.INTEGER }));
        }
        else {
            const types = new Set();
            list.forEach((v) => {
                if (v !== "" && v !== null) {
                    types.add(typeof v);
                }
            });
            if (types.size === 1 && types.has("number")) {
                this.rs.keys.push(createRdhKey({ name: key, type: types_1.GeneralColumnType.NUMERIC }));
            }
            else {
                this.rs.keys.push(createRdhKey({ name: key, type: types_1.GeneralColumnType.UNKNOWN }));
            }
        }
        list.forEach((v, i) => {
            this.rs.rows[i].values[key] = v;
        });
    }
    assignFromDictionary(new_key, existing_key, dictionary) {
        this.drop(new_key);
        this.rs.keys.push(createRdhKey({ name: new_key, type: types_1.GeneralColumnType.TEXT }));
        this.rs.rows.forEach((row) => {
            const existing_val = row.values[existing_key];
            if (existing_val === undefined ||
                existing_val === "" ||
                existing_val === null) {
                row.values[new_key] = "";
            }
            else {
                if (dictionary.length <= existing_val || existing_val < 0) {
                    row.values[new_key] = "";
                }
                else {
                    row.values[new_key] = dictionary[existing_val];
                }
            }
        });
    }
    toVector(key_name, is_only_number = false) {
        const retList = new Array();
        this.rs.rows.forEach((row) => {
            const v = row.values[key_name];
            if (is_only_number) {
                if (isFinite(v) && v !== "" && v !== null) {
                    retList.push(v);
                }
            }
            else {
                retList.push(v);
            }
        });
        return retList;
    }
    toMatrixArray(key_names) {
        const retList = new Array();
        this.rs.rows.forEach((row) => {
            const retRow = new Array();
            if (key_names && key_names.length > 0) {
                key_names.forEach((key_name) => {
                    retRow.push(row.values[key_name]);
                });
            }
            else {
                this.rs.keys.forEach((key) => {
                    retRow.push(row.values[key.name]);
                });
            }
            retList.push(retRow);
        });
        return retList;
    }
    toCsv(params) {
        var _a;
        const { withType, withComment, keyNames, withRowNo, withCodeLabel, withRuleViolation, maxPrintLines, maxCellValueLength, eol, } = Object.assign(Object.assign({}, this.initToStringParam()), params);
        const delimiter = (_a = params.delimiter) !== null && _a !== void 0 ? _a : ",";
        const rdhKeys = keyNames.length > 0
            ? this.rs.keys.filter((k) => keyNames.includes(k.name))
            : this.rs.keys;
        if (rdhKeys.length < 0) {
            return "No Keys.";
        }
        const retList = new Array();
        const pushLine = (sRow, s) => {
            if (sRow === undefined) {
                retList.push(s);
            }
            else {
                retList.push(`${sRow}${delimiter}${s}`);
            }
        };
        pushLine(withRowNo ? '"ROW"' : undefined, rdhKeys
            .map((k) => this.toCsvString(k.name, maxCellValueLength))
            .join(delimiter));
        if (withComment && this.hasKeyComment()) {
            pushLine(withRowNo ? "" : undefined, rdhKeys
                .map((k) => { var _a; return this.toCsvString((_a = k.comment) !== null && _a !== void 0 ? _a : "", maxCellValueLength); })
                .join(delimiter));
        }
        if (withType) {
            pushLine(withRowNo ? "" : undefined, rdhKeys
                .map((k) => this.toCsvString((0, GeneralColumnUtil_1.displayGeneralColumnType)(k.type), maxCellValueLength))
                .join(delimiter));
        }
        if (this.rs.rows.length <= maxPrintLines) {
            this.rs.rows.forEach((row, idx) => {
                const rowValues = [];
                if (withRowNo) {
                    rowValues.push(`${idx + 1}`);
                }
                rdhKeys.forEach((key) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(row, key.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(row, key.name)
                        : undefined;
                    rowValues.push(this.toCsvString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }));
                });
                retList.push(rowValues.join(delimiter));
            });
        }
        else {
            const num_of_head = Math.ceil(maxPrintLines / 2);
            this.rs.rows.slice(0, num_of_head).forEach((row, idx) => {
                const rowValues = [];
                if (withRowNo) {
                    rowValues.push(`${idx + 1}`);
                }
                rdhKeys.forEach((key) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(row, key.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(row, key.name)
                        : undefined;
                    rowValues.push(this.toCsvString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }));
                });
                retList.push(rowValues.join(delimiter));
            });
            {
                const rowValues = [];
                if (withRowNo) {
                    rowValues.push("...");
                }
                rdhKeys.forEach(() => {
                    rowValues.push("...");
                });
                retList.push(rowValues.join(delimiter));
            }
            this.rs.rows
                .slice(this.rs.rows.length - num_of_head, this.rs.rows.length)
                .forEach((row, idx) => {
                const rowValues = [];
                if (withRowNo) {
                    rowValues.push(`${this.rs.rows.length - num_of_head + idx + 1}`);
                }
                rdhKeys.forEach((key) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(row, key.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(row, key.name)
                        : undefined;
                    rowValues.push(this.toCsvString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }));
                });
                retList.push(rowValues.join(delimiter));
            });
        }
        return retList.join(eol);
    }
    toMarkdown(params) {
        const { withType, withComment, keyNames, withRowNo, withCodeLabel, withRuleViolation, maxPrintLines, maxCellValueLength, eol, } = Object.assign(Object.assign({}, this.initToStringParam()), params);
        const rdhKeys = keyNames.length > 0
            ? this.rs.keys.filter((k) => keyNames.includes(k.name))
            : this.rs.keys;
        if (rdhKeys.length < 0) {
            return "No Keys.";
        }
        const retList = new Array();
        const pushLine = (sRow, s) => {
            if (sRow === undefined) {
                retList.push(`| ${s} |`);
            }
            else {
                retList.push(`| ${sRow} | ${s} |`);
            }
        };
        pushLine(withRowNo ? "ROW" : undefined, rdhKeys
            .map((k) => this.toMarkdownString(k.name, maxCellValueLength))
            .join(" | "));
        pushLine(withRowNo ? "---:" : undefined, rdhKeys
            .map((key) => {
            var _a;
            const align = (_a = key.align) !== null && _a !== void 0 ? _a : "center";
            switch (align) {
                case "left":
                    return ":---";
                case "center":
                    return ":---:";
                case "right":
                    return "---:";
            }
        })
            .join(" | "));
        if (withComment && this.hasKeyComment()) {
            pushLine(withRowNo ? "" : undefined, rdhKeys
                .map((k) => { var _a; return this.toMarkdownString((_a = k.comment) !== null && _a !== void 0 ? _a : "", maxCellValueLength); })
                .join(" | "));
        }
        if (withType) {
            pushLine(withRowNo ? "" : undefined, rdhKeys
                .map((k) => this.toMarkdownString((0, GeneralColumnUtil_1.displayGeneralColumnType)(k.type), maxCellValueLength))
                .join(" | "));
        }
        if (this.rs.rows.length <= maxPrintLines) {
            this.rs.rows.forEach((row, idx) => {
                const retRow = new Array();
                rdhKeys.forEach((key) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(row, key.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(row, key.name)
                        : undefined;
                    retRow.push(this.toMarkdownString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }));
                });
                pushLine(withRowNo ? `${idx + 1}` : undefined, retRow.join(" | "));
            });
        }
        else {
            const num_of_head = Math.ceil(maxPrintLines / 2);
            this.rs.rows.slice(0, num_of_head).forEach((row, idx) => {
                const retRow = new Array();
                rdhKeys.forEach((key) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(row, key.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(row, key.name)
                        : undefined;
                    retRow.push(this.toMarkdownString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }));
                });
                pushLine(withRowNo ? `${idx + 1}` : undefined, retRow.join(" | "));
            });
            const retRow = new Array();
            rdhKeys.forEach(() => {
                retRow.push("...");
            });
            pushLine(withRowNo ? "..." : undefined, retRow.join(" | "));
            this.rs.rows
                .slice(this.rs.rows.length - num_of_head, this.rs.rows.length)
                .forEach((row, idx) => {
                const retRow = new Array();
                rdhKeys.forEach((key) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(row, key.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(row, key.name)
                        : undefined;
                    retRow.push(this.toMarkdownString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }));
                });
                pushLine(withRowNo
                    ? `${this.rs.rows.length - num_of_head + idx + 1}`
                    : undefined, retRow.join(" | "));
            });
        }
        const s = retList.join(eol);
        if (withRuleViolation) {
            const legend = this.createRuleMarkerLegend(eol);
            if (legend) {
                return s + eol + eol + "```" + eol + legend + eol + "```" + eol;
            }
        }
        return s + eol;
    }
    toHtml(params) {
        var _a;
        const { withType, withComment, keyNames, withRowNo, withCodeLabel, withRuleViolation, maxPrintLines, maxCellValueLength, eol, } = Object.assign(Object.assign({}, this.initToStringParam()), params);
        const rdhKeys = keyNames.length > 0
            ? this.rs.keys.filter((k) => keyNames.includes(k.name))
            : this.rs.keys;
        if (rdhKeys.length < 0) {
            return "<p>No Keys.</p>";
        }
        const retList = [];
        retList.push('<div class="table-container"><table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" >');
        retList.push("<thead>");
        const pushLine = (sRow, elms, isHead, rowClass) => {
            const tag = isHead ? "th" : "td";
            const rowValues = [];
            if (sRow !== undefined) {
                rowValues.push(`<${tag}>${sRow}</${tag}>`);
            }
            elms.forEach((it) => {
                if (typeof it === "string") {
                    rowValues.push(`<${tag}>${it}</${tag}>`);
                }
                else {
                    rowValues.push(`<${tag} class="${it.clazz}">${it.s}</${tag}>`);
                }
            });
            retList.push(`  <tr class="${rowClass !== null && rowClass !== void 0 ? rowClass : ""}">${rowValues.join("")}</tr>`);
        };
        pushLine(withRowNo ? "ROW" : undefined, rdhKeys.map((k) => this.toHtmlString(k.name, maxCellValueLength)), true);
        if (withComment && this.hasKeyComment()) {
            pushLine(withRowNo ? "" : undefined, rdhKeys.map((k) => { var _a; return this.toHtmlString((_a = k.comment) !== null && _a !== void 0 ? _a : "", maxCellValueLength); }), true);
        }
        if (withType) {
            pushLine(withRowNo ? "" : undefined, rdhKeys.map((k) => this.toHtmlString((0, GeneralColumnUtil_1.displayGeneralColumnType)(k.type), maxCellValueLength)), true);
        }
        retList.push("</thead>");
        retList.push("<tbody>");
        const pushRowData = (row, rowNo) => {
            let rowClass = "";
            const inserted = RowHelper.hasAnnotation(row, "Add");
            let removed = false;
            let updated = false;
            if (inserted) {
                rowClass = "is-primary is-light";
            }
            else {
                removed = RowHelper.hasAnnotation(row, "Del");
                if (removed) {
                    rowClass = "is-danger is-light";
                }
            }
            if (!inserted && !removed) {
                updated = RowHelper.hasAnnotation(row, "Upd");
            }
            const retRow = new Array();
            rdhKeys.forEach((key) => {
                const label = withCodeLabel
                    ? this.resolveCodeLabel(row, key.name)
                    : undefined;
                const ruleMarker = withRuleViolation
                    ? this.resolveRuleMarkers(row, key.name)
                    : undefined;
                let cellUpdatedAnno = undefined;
                if (updated) {
                    cellUpdatedAnno = RowHelper.getFirstAnnotationOf(row, key.name, "Upd");
                }
                retRow.push({
                    clazz: cellUpdatedAnno ? "is-info is-light" : "",
                    s: this.toHtmlString(row.values[key.name], maxCellValueLength, {
                        keyType: key.type,
                        label,
                        ruleMarker,
                    }),
                });
            });
            pushLine(withRowNo ? `${rowNo}` : undefined, retRow, false, rowClass);
        };
        if (this.rs.rows.length <= maxPrintLines) {
            this.rs.rows.forEach((row, idx) => pushRowData(row, idx + 1));
        }
        else {
            const num_of_head = Math.ceil(maxPrintLines / 2);
            this.rs.rows
                .slice(0, num_of_head)
                .forEach((row, idx) => pushRowData(row, idx + 1));
            const retRow = new Array();
            rdhKeys.forEach(() => {
                retRow.push("...");
            });
            pushLine(withRowNo ? "..." : undefined, retRow, false);
            this.rs.rows
                .slice(this.rs.rows.length - num_of_head, this.rs.rows.length)
                .forEach((row, idx) => pushRowData(row, this.rs.rows.length - num_of_head + idx + 1));
        }
        retList.push("</tbody>");
        retList.push("</table>");
        retList.push("</div>");
        retList.push(eol);
        if (withRuleViolation && ((_a = this.rs.meta) === null || _a === void 0 ? void 0 : _a.ruleViolationSummary)) {
            retList.push("<blockquote>");
            retList.push('<div class="content is-small">');
            retList.push("<ul>");
            const { ruleViolationSummary } = this.rs.meta;
            Object.keys(ruleViolationSummary).forEach((ruleName, idx) => {
                retList.push(`<li>*${idx + 1}: ${this.toHtmlString(ruleName, maxCellValueLength)}: ${this.toHtmlString(ruleViolationSummary[ruleName], maxCellValueLength)}</li>`);
            });
            retList.push("</ul>");
            retList.push("</deiv>");
            retList.push("</blockquote>");
        }
        return retList.join(eol) + eol;
    }
    toString(params) {
        const { maxPrintLines, maxCellValueLength, withType, withComment, withRowNo, withCodeLabel, withRuleViolation, keyNames, eol, } = Object.assign(Object.assign({}, this.initToStringParam()), params);
        const rdhKeys = keyNames.length > 0
            ? this.rs.keys.filter((k) => keyNames.includes(k.name))
            : this.rs.keys;
        if (rdhKeys.length < 0) {
            return "No Keys.";
        }
        const buf = list_it_1.default.buffer();
        if (withRowNo) {
            buf.d("ROW");
        }
        rdhKeys.forEach((k) => buf.d(k.name));
        buf.nl();
        if (withComment && this.hasKeyComment()) {
            if (withRowNo) {
                buf.d("");
            }
            rdhKeys.forEach((k) => { var _a; return buf.d((_a = this.toShortString(k.comment, maxCellValueLength)) !== null && _a !== void 0 ? _a : ""); });
            buf.nl();
        }
        if (withType) {
            if (withRowNo) {
                buf.d((0, GeneralColumnUtil_1.displayGeneralColumnType)(types_1.GeneralColumnType.INTEGER));
            }
            rdhKeys.forEach((k) => {
                buf.d((0, GeneralColumnUtil_1.displayGeneralColumnType)(k.type));
            });
            buf.nl();
        }
        if (this.rs.rows.length <= maxPrintLines) {
            this.rs.rows.forEach((v, idx) => {
                if (withRowNo) {
                    buf.d(idx + 1);
                }
                rdhKeys.forEach((k) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(v, k.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(v, k.name)
                        : undefined;
                    buf.d(this.toShortString(v.values[k.name], maxCellValueLength, {
                        keyType: k.type,
                        label,
                        ruleMarker,
                    }));
                });
                buf.nl();
            });
        }
        else {
            const num_of_head = Math.ceil(maxPrintLines / 2);
            this.rs.rows.slice(0, num_of_head).forEach((v, idx) => {
                if (withRowNo) {
                    buf.d(idx + 1);
                }
                rdhKeys.forEach((k) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(v, k.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(v, k.name)
                        : undefined;
                    buf.d(this.toShortString(v.values[k.name], maxCellValueLength, {
                        keyType: k.type,
                        label,
                        ruleMarker,
                    }));
                });
                buf.nl();
            });
            if (withRowNo) {
                buf.d("...");
            }
            rdhKeys.forEach(() => {
                buf.d("...");
            });
            buf.nl();
            this.rs.rows
                .slice(this.rs.rows.length - num_of_head, this.rs.rows.length)
                .forEach((v, idx) => {
                if (withRowNo) {
                    buf.d(this.rs.rows.length - num_of_head + idx + 1);
                }
                rdhKeys.forEach((k) => {
                    const label = withCodeLabel
                        ? this.resolveCodeLabel(v, k.name)
                        : undefined;
                    const ruleMarker = withRuleViolation
                        ? this.resolveRuleMarkers(v, k.name)
                        : undefined;
                    buf.d(this.toShortString(v.values[k.name], maxCellValueLength, {
                        keyType: k.type,
                        label,
                        ruleMarker,
                    }));
                });
                buf.nl();
            });
        }
        let s = buf.toString();
        if (this.rs.rows.length === 0) {
            s += eol + "No records.";
        }
        if (withRuleViolation) {
            const legend = this.createRuleMarkerLegend(eol);
            if (legend) {
                s += eol + eol + legend;
            }
        }
        return s + eol;
    }
    addRow(recordData, defaultMeta) {
        let meta = {};
        if (defaultMeta) {
            meta = defaultMeta;
        }
        const values = {};
        this.rs.keys.forEach((key) => {
            const v = recordData[key.name];
            values[key.name] = v;
        });
        this.rs.rows.push({ meta, values });
    }
    clearRows() {
        this.rs.rows.splice(0, this.rs.rows.length);
    }
    setSqlStatement(sqlStatement) {
        this.rs.sqlStatement = sqlStatement;
    }
    hasAnyAnnotation(types) {
        return this.rs.rows.some((row) => RowHelper.hasAnyAnnotation(row, types));
    }
    fillnull(how) {
        this.rs.keys
            .filter((k) => (0, GeneralColumnUtil_1.isNumericLike)(k.type))
            .forEach((k) => {
            const num_list = new Array();
            for (let i = 0; i < this.rs.rows.length; i++) {
                const v = this.rs.rows[i].values[k.name];
                if (isFinite(v) && v !== "") {
                    num_list.push(v);
                }
            }
            let new_value = 0;
            switch (how) {
                case "mean":
                    new_value = ss.mean(num_list);
                    break;
                case "median":
                    new_value = ss.median(num_list);
                    break;
            }
            for (let i = 0; i < this.rs.rows.length; i++) {
                if (this.rs.rows[i].values[k.name] === null) {
                    this.rs.rows[i].values[k.name] = new_value;
                }
            }
        });
    }
    resetKeyTypeByRows() {
        this.rs.keys.forEach((k) => {
            const length = this.rs.rows.length;
            const types = new Set();
            for (let i = 0; i < length; i++) {
                const v = this.rs.rows[i].values[k.name];
                if (v === "" || v === null) {
                    continue;
                }
                if (["TRUE", "FALSE", "True", "False", "true", "false"].includes(v)) {
                    types.add("boolean");
                }
                else if ((0, utils_1.default)(v)) {
                    types.add("date");
                }
                else {
                    types.add(typeof v);
                }
            }
            if (types.size === 1) {
                const emptyToNull = () => {
                    for (let i = 0; i < length; i++) {
                        if (this.rs.rows[i].values[k.name] === "") {
                            this.rs.rows[i].values[k.name] = null;
                        }
                    }
                };
                if (types.has("string")) {
                    k.type = types_1.GeneralColumnType.TEXT;
                }
                else if (types.has("boolean")) {
                    k.type = types_1.GeneralColumnType.BOOLEAN;
                    for (let i = 0; i < length; i++) {
                        const v = this.rs.rows[i].values[k.name];
                        if (v === "") {
                            this.rs.rows[i].values[k.name] = null;
                        }
                        else {
                            this.rs.rows[i].values[k.name] = (0, utils_1.toBoolean)(v);
                        }
                    }
                }
                else if (types.has("number")) {
                    k.type = types_1.GeneralColumnType.NUMERIC;
                    k.align = "right";
                    emptyToNull();
                }
                else if (types.has("date")) {
                    k.type = types_1.GeneralColumnType.DATE;
                    emptyToNull();
                }
            }
        });
    }
    keynames(is_only_numeric_like = false) {
        if (is_only_numeric_like) {
            return this.rs.keys
                .filter((k) => (0, GeneralColumnUtil_1.isNumericLike)(k.type))
                .map((k) => k.name);
        }
        return this.rs.keys.map((k) => k.name);
    }
    setSummary({ elapsedTimeMilli, selectedRows, affectedRows, insertId, changedRows, }) {
        const elapsedTime = (elapsedTimeMilli / 1000).toFixed(2);
        if (selectedRows === undefined) {
            this.rs.summary = {
                info: `${affectedRows} row${affectedRows === 1 ? "" : "s"} affected (${elapsedTime} sec)`,
                elapsedTimeMilli,
                insertId: insertId,
                affectedRows: affectedRows,
                changedRows: changedRows,
            };
        }
        else {
            this.rs.summary = {
                info: `${selectedRows} row${selectedRows === 1 ? "" : "s"} in set (${elapsedTime} sec)`,
                elapsedTimeMilli,
                selectedRows,
            };
        }
    }
    toShortString(o, maxCellValueLength, opt) {
        let s;
        if (o === null || o === undefined) {
            s = "";
        }
        else {
            s = "" + o;
            if ((0, GeneralColumnUtil_1.isDateTimeOrDate)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                s = (0, dayjs_1.default)(o).format("YYYY-MM-DD HH:mm:ss");
            }
            else if ((0, GeneralColumnUtil_1.isJsonLike)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                try {
                    if (typeof o === "object" || Array.isArray(o)) {
                        s = JSON.stringify(o);
                    }
                }
                catch (_) { }
            }
            s = (0, utils_1.abbr)(s, maxCellValueLength);
            if (opt === null || opt === void 0 ? void 0 : opt.label) {
                s += ` <${opt.label.label}>`;
            }
        }
        if (opt === null || opt === void 0 ? void 0 : opt.ruleMarker) {
            s = `${opt.ruleMarker} ${s}`;
        }
        return s;
    }
    toCsvString(o, maxCellValueLength, opt) {
        let s;
        if (o === null || o === undefined) {
            s = "";
        }
        else {
            s = "" + o;
            if ((0, GeneralColumnUtil_1.isDateTimeOrDate)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                s = (0, dayjs_1.default)(o).format("YYYY-MM-DD HH:mm:ss");
            }
            else if ((0, GeneralColumnUtil_1.isJsonLike)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                try {
                    if (typeof o === "object" || Array.isArray(o)) {
                        s = JSON.stringify(o);
                    }
                }
                catch (_) { }
            }
            s = (0, utils_1.abbr)(s, maxCellValueLength);
            if (opt === null || opt === void 0 ? void 0 : opt.label) {
                s += ` <${opt.label.label}>`;
            }
        }
        if (opt === null || opt === void 0 ? void 0 : opt.ruleMarker) {
            s = `${opt.ruleMarker} ${s}`;
        }
        s = `"${s.replace(/"/g, '""')}"`;
        return s;
    }
    toMarkdownString(o, maxCellValueLength, opt) {
        let s;
        if (o === null || o === undefined) {
            s = "";
        }
        else {
            s = "" + o;
            if ((0, GeneralColumnUtil_1.isDateTimeOrDate)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                s = (0, dayjs_1.default)(o).format("YYYY-MM-DD HH:mm:ss");
            }
            else if ((0, GeneralColumnUtil_1.isJsonLike)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                try {
                    if (typeof o === "object" || Array.isArray(o)) {
                        s = JSON.stringify(o);
                    }
                }
                catch (_) { }
            }
            s = (0, utils_1.abbr)(s, maxCellValueLength);
            if (opt === null || opt === void 0 ? void 0 : opt.label) {
                if (opt.label.isUndefined) {
                    s += ` <\`${opt.label.label}\`>`;
                }
                else {
                    s += ` <${opt.label.label}>`;
                }
            }
        }
        if (opt === null || opt === void 0 ? void 0 : opt.ruleMarker) {
            s = `\`${opt.ruleMarker}\` ${s}`;
        }
        s = `${s
            .replace(/ {2}/g, "&emsp;")
            .replace(/\|/g, "&#124;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/(\r?\n)/g, "<br>")}`;
        return s;
    }
    toHtmlString(o, maxCellValueLength, opt) {
        let s;
        if (o === null || o === undefined) {
            s = '<span class="tag is-light">NULL</span>';
        }
        else {
            s = "" + o;
            if ((0, GeneralColumnUtil_1.isDateTimeOrDate)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                s = (0, dayjs_1.default)(o).format("YYYY-MM-DD HH:mm:ss");
            }
            else if ((0, GeneralColumnUtil_1.isJsonLike)(opt === null || opt === void 0 ? void 0 : opt.keyType)) {
                try {
                    if (typeof o === "object" || Array.isArray(o)) {
                        s = JSON.stringify(o);
                    }
                }
                catch (_) { }
            }
            s = (0, utils_1.escapeHtml)((0, utils_1.abbr)(s, maxCellValueLength));
            if (opt === null || opt === void 0 ? void 0 : opt.label) {
                if (opt.label.isUndefined) {
                    s += ` <span class="tag is-danger is-light">${(0, utils_1.escapeHtml)(opt.label.label)}</span>`;
                }
                else {
                    s += ` <span class="tag is-info is-light">${(0, utils_1.escapeHtml)(opt.label.label)}</span>`;
                }
            }
        }
        if (opt === null || opt === void 0 ? void 0 : opt.ruleMarker) {
            s = `<span class="tag is-info is-light">${(0, utils_1.escapeHtml)(opt.ruleMarker)}</span> <span class="tag is-success is-light">${(0, utils_1.escapeHtml)(s)}</span>`;
        }
        return s;
    }
    resolveCodeLabel(row, keyName) {
        var _a;
        return (_a = RowHelper.getFirstAnnotationOf(row, keyName, "Cod")) === null || _a === void 0 ? void 0 : _a.values;
    }
    resolveRuleMarkers(row, keyName) {
        const { ruleViolationSummary } = this.rs.meta;
        if (ruleViolationSummary === undefined) {
            return undefined;
        }
        const rules = RowHelper.filterAnnotationByKeyOf(row, keyName, "Rul");
        const marks = [];
        const names = Object.keys(ruleViolationSummary);
        names.forEach((it, idx) => {
            if (rules.some((rule) => rule.values.name === it)) {
                marks.push(idx + 1);
            }
        });
        return marks.length > 0 ? `*${marks.join(",")}` : undefined;
    }
    createRuleMarkerLegend(eol = EOL) {
        const { ruleViolationSummary } = this.rs.meta;
        if (ruleViolationSummary === undefined) {
            return undefined;
        }
        return Object.keys(ruleViolationSummary)
            .map((ruleName, idx) => `*${idx + 1}: ${ruleName}: ${ruleViolationSummary[ruleName]}`)
            .join(eol);
    }
    initToStringParam() {
        return {
            maxPrintLines: MAX_PRINT_LINE,
            maxCellValueLength: MAX_CELL_VALUE_LENGTH,
            withType: false,
            withComment: false,
            withRowNo: false,
            withCodeLabel: false,
            withRuleViolation: false,
            eol: EOL,
            keyNames: [],
        };
    }
}
exports.ResultSetDataBuilder = ResultSetDataBuilder;
//# sourceMappingURL=ResultSetDataBuilder.js.map