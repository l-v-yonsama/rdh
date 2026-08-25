import * as ss from "simple-statistics";
import {
  AnnotationType,
  GeneralColumnType as GC,
  RdhKey,
  RdhMeta,
  RdhRow,
  RdhRowMeta,
  ResultSetData,
  ToStringParam,
  isResultSetData,
} from "../types";
import isDate, { isRecord, toBoolean } from "../utils";
import {
  isBooleanLike,
  isDateTimeOrDateOrTime,
  isNumericLike,
  isTextLike,
} from "./GeneralColumnUtil";
import { RowHelper } from "./RdhAnnotationHelper";
import { createRdhKey } from "./RdhKeyBuilder";
import { cloneFromRdh } from "./ResultSetDataClone";
import { toContentString } from "./toStringUtil";

// このファイルはpackage公開時にbuilt/src全体がそのまま配布され、exportsに
// よる経路制限もない。そのため過去にここからdeep importしていた利用者が
// いる可能性を考慮し、RdhAnnotationHelper.ts／RdhKeyBuilder.tsへ移動した
// createRdhKey・createRdhKeysOf・RowHelper・RdhHelperをこの場所からも
// 引き続き参照できるよう再exportしておく。
export { RowHelper, RdhHelper } from "./RdhAnnotationHelper";
export { createRdhKey, createRdhKeysOf } from "./RdhKeyBuilder";

export function isResultSetDataBuilder(
  item: unknown
): item is ResultSetDataBuilder {
  return isRecord(item) && "rs" in item && isResultSetData(item.rs);
}

function toRdhKeys(keys: Array<string | RdhKey>): RdhKey[] {
  return keys.map((k) => {
    if (typeof k === "string") {
      return createRdhKey({ name: k, type: GC.UNKNOWN });
    } else {
      return k;
    }
  });
}

// クローン本体(値のディープクローン、JSON経由で平坦化されたDate/Bufferの復元、
// addRow相当の列正規化)はcloneFromRdh()(ResultSetDataClone.ts)が行う。
// from(list: any, ...)は引数の型がanyで、isResultSetData()による判定も
// created/keys/rows/metaの有無を見る構造的なチェックのみ(値の中身が本物の
// Date/Bufferかどうかは見ない)ため、「JSON整形済みのプレーンオブジェクトを
// from()に渡す」という使い方自体はこのAPIの型上禁止されていない。ここでは
// そのプレーンなResultSetDataをBuilderへ包むだけ。
function fromResultSetData(rs: ResultSetData): ResultSetDataBuilder {
  const cloned = cloneFromRdh(rs);
  const rdb = new ResultSetDataBuilder(cloned.keys);
  rdb.rs.rows.push(...cloned.rows);
  Object.keys(cloned.meta ?? {}).forEach((key) => {
    rdb.rs.meta[key] = cloned.meta[key];
  });
  (rdb.rs as any)["created"] = cloned.created;
  (rdb.rs as any)["noRecordsReason"] = cloned.noRecordsReason;
  rdb.rs.sqlStatement = cloned.sqlStatement;
  rdb.rs.summary = cloned.summary;
  rdb.rs.shuffledIndexes = cloned.shuffledIndexes;
  rdb.rs.shuffledNextCounter = cloned.shuffledNextCounter;
  rdb.rs.mergeCells = cloned.mergeCells;
  rdb.rs.queryConditions = cloned.queryConditions;
  return rdb;
}

// 2次元配列(1行目をtitleとして扱うかはoptions次第)からBuilderを組み立てる。
function fromArrayRows(
  rows: any[][],
  options?: { firstRowAsTitle?: boolean }
): ResultSetDataBuilder {
  const strTitles: string[] = [];

  let elm = rows[0];
  if (options?.firstRowAsTitle) {
    strTitles.push(...elm);
  } else {
    let i = strTitles.length + 1;
    while (strTitles.length < elm.length) {
      strTitles.push(`K${i++}`);
    }
  }

  const ret = new ResultSetDataBuilder(strTitles);

  for (let r = options?.firstRowAsTitle ? 1 : 0; r < rows.length; r++) {
    elm = rows[r];
    const values: any = {};
    for (let c = 0; c < elm.length; c++) {
      values[strTitles[c]] = elm[c];
    }
    ret.addRow(values);
  }
  return ret;
}

// object(Record)を KEY/TYPE/VALUE の3列RDHへ変換する。
function fromRecord(record: Record<string, any>): ResultSetDataBuilder {
  const ret = new ResultSetDataBuilder([
    createRdhKey({ name: "KEY", type: GC.TEXT, width: 120 }),
    createRdhKey({ name: "TYPE", type: GC.TEXT, width: 80 }),
    createRdhKey({ name: "VALUE", type: GC.JSON, width: 400 }),
  ]);
  Object.keys(record).forEach((k: string) => {
    const v = record[k];
    let type: string = typeof v;
    if (v === null) {
      type = "null";
    }
    const values: any = {};
    values["KEY"] = k;
    values["TYPE"] = type;
    values["VALUE"] = v;

    ret.addRow(values);
  });
  return ret;
}

export class ResultSetDataBuilder {
  readonly rs: ResultSetData;

  constructor(keys: Array<string | RdhKey>) {
    this.rs = {
      created: new Date(),
      keys: toRdhKeys(keys),
      rows: [],
      meta: {},
    };
  }

  build(): ResultSetData {
    return this.rs;
  }

  updateKeyType(keyName: string, type: GC): void {
    const key = this.rs.keys.find((it) => it.name === keyName);
    if (key) {
      key.type = type;
      key.align = "center";
      if (isNumericLike(type)) {
        key.align = "left";
      } else if (isTextLike(type)) {
        key.align = "left";
      }
    }
  }

  updateKeyComment(keyName: string, comment: string): void {
    const key = this.rs.keys.find((it) => it.name === keyName);
    if (key) {
      key.comment = comment;
    }
  }

  updateKeyName(keyName: string, newKeyName: string): void {
    const key = this.rs.keys.find((it) => it.name === keyName);
    if (key) {
      key.name = newKeyName;
    } else {
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

  updateKeyWidth(keyName: string, width: number): void {
    const key = this.rs.keys.find((it) => it.name === keyName);
    if (key) {
      key.width = width;
    }
  }

  updateKeyAlign(keyName: string, align: RdhKey["align"]): void {
    const key = this.rs.keys.find((it) => it.name === keyName);
    if (key) {
      key.align = align;
    }
  }

  updateMeta(params: RdhMeta): void {
    Object.entries(params).forEach(([k, v]) => {
      this.rs.meta[k] = v;
    });
  }

  static createEmpty(opt?: { noRecordsReason?: string }): ResultSetDataBuilder {
    const { noRecordsReason } = opt ?? {};
    const o: ResultSetData = {
      created: new Date(),
      keys: [],
      rows: [],
      meta: {},
      noRecordsReason,
    };
    return this.from(o);
  }

  static from(
    list: any,
    options?: {
      firstRowAsTitle?: boolean;
    }
  ): ResultSetDataBuilder {
    if (list === undefined || list === null || list === "") {
      throw new Error(typeof list + " has no value.");
    }

    if (isResultSetData(list)) {
      return fromResultSetData(list);
    }
    if (isResultSetDataBuilder(list)) {
      return fromResultSetData(list.rs);
    }

    const t = typeof list;
    let ret: ResultSetDataBuilder;
    // console.log('outputToSpread, list=', list, t, list.constructor.name)

    if (list instanceof Array) {
      if (list.length === 0) {
        throw new Error("No records");
      }
      const elm = list[0];
      if (elm instanceof Array) {
        ret = fromArrayRows(list, options);
      }
    } else {
      switch (t) {
        case "object":
          ret = fromRecord(list);
          break;
      }
    }
    ret.resetKeyTypeByRows();
    ret.normalizeValuesByTypes();
    return ret;
  }

  normalizeValuesByTypes(): void {
    const { rs } = this;
    const notEmptyStringKeys = rs.keys.filter(
      (it) =>
        isNumericLike(it.type) ||
        isBooleanLike(it.type) ||
        isDateTimeOrDateOrTime(it.type)
    );
    if (notEmptyStringKeys.length) {
      rs.rows.forEach((row) => {
        notEmptyStringKeys.forEach((it) => {
          const v = row.values[it.name];
          if (v === "") {
            row.values[it.name] = null;
          } else {
            if (isBooleanLike(it.type)) {
              row.values[it.name] = toBoolean(v);
            }
          }
        });
      });
    }
  }

  /**
   * The correlation is a measure of how correlated two datasets are, between -1 and 1
   * @param key_x first input
   * @param key_y first input
   * @returns sample correlation
   */
  sampleCorrelation(key_x: string, key_y: string): number {
    const x: number[] = this.toVector(key_x, true);
    const y: number[] = this.toVector(key_y, true);
    return ss.sampleCorrelation(x, y);
  }

  describe(): ResultSetData {
    // #               a         b
    // # count  4.000000  4.000000
    // # mean   1.750000  0.600000
    // # std    0.957427  0.439697
    // # min    1.000000  0.100000
    // # 25%    1.000000  0.325000
    // # 50%    1.500000  0.600000
    // # 75%    2.250000  0.875000
    // # max    3.000000  1.100000
    const desc_keys = new Array<RdhKey>();
    this.rs.keys
      .filter((k) => isNumericLike(k.type))
      .forEach((k) => {
        desc_keys.push(
          createRdhKey({
            name: k.name,
            type: k.type,
            comment: k.comment ?? "",
          })
        );
      });
    desc_keys.unshift(createRdhKey({ name: "stat", type: GC.TEXT }));
    const ret = new ResultSetDataBuilder(desc_keys);

    const count_values: any = { stat: "count" };
    const mean_values: any = { stat: "mean" };
    const std_values: any = { stat: "std" };
    const min_values: any = { stat: "min" };
    const quatile25_values: any = { stat: "25%" };
    const median_values: any = { stat: "50%" };
    const quatile75_values: any = { stat: "75%" };
    const max_values: any = { stat: "max" };
    this.rs.keys.forEach((key) => {
      const num_list: number[] = this.toVector(key.name, true);
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

  hasKey(key: string): boolean {
    return this.rs.keys.some((k) => k.name === key);
  }

  hasKeyComment(): boolean {
    return this.rs.keys.some((k) => !!k.comment);
  }

  drop(key: string): void {
    if (this.hasKey(key)) {
      this.rs.rows.forEach((v) => {
        delete v.values[key];
      });
      const idx = this.rs.keys.findIndex((k) => k.name === key);
      this.rs.keys.splice(idx, 1);
    }
  }

  assign(key: string, list: any): void {
    if (list === undefined || list === null || list === "") {
      throw new Error(typeof list + " has no value.");
    }
    const constructor = list.constructor.name;
    this.drop(key);
    if (constructor === "Float32Array" || constructor === "Float64Array") {
      list = Array.from(list);
      this.rs.keys.push(createRdhKey({ name: key, type: GC.NUMERIC }));
    } else if (
      constructor === "Int8Array" ||
      constructor === "Int16Array" ||
      constructor === "Int32Array"
    ) {
      list = Array.from(list);
      this.rs.keys.push(createRdhKey({ name: key, type: GC.INTEGER }));
    } else {
      const types = new Set<string>();
      list.forEach((v: any) => {
        if (v !== "" && v !== null) {
          types.add(typeof v);
        }
      });
      if (types.size === 1 && types.has("number")) {
        this.rs.keys.push(createRdhKey({ name: key, type: GC.NUMERIC }));
      } else {
        this.rs.keys.push(createRdhKey({ name: key, type: GC.UNKNOWN }));
      }
    }
    list.forEach((v: any, i: number) => {
      this.rs.rows[i].values[key] = v;
    });
  }

  toVector(key_name: string, is_only_number = false): Array<any> {
    const retList = new Array<any>();
    this.rs.rows.forEach((row: RdhRow) => {
      const v = (<any>row.values)[key_name];
      if (is_only_number) {
        if (isFinite(v) && v !== "" && v !== null) {
          retList.push(v);
        }
      } else {
        retList.push(v);
      }
    });
    return retList;
  }

  toCsv(params?: ToStringParam): string {
    return toContentString(this.rs, "csv", params);
  }

  toMarkdown(params?: ToStringParam): string {
    return toContentString(this.rs, "markdown", params);
  }

  toHtml(params?: ToStringParam): string {
    return toContentString(this.rs, "html", params);
  }

  toString(params?: ToStringParam): string {
    return toContentString(this.rs, "plain", params);
  }

  addRow(recordData: any, defaultMeta?: RdhRowMeta): void {
    let meta = {};
    if (defaultMeta) {
      meta = defaultMeta;
    }
    const values = <any>{};
    this.rs.keys.forEach((key) => {
      const v = recordData[key.name];
      values[key.name] = v;
    });
    this.rs.rows.push({ meta, values });
  }

  clearRows(): void {
    this.rs.rows.splice(0, this.rs.rows.length);
  }

  setSqlStatement(sqlStatement: string): void {
    this.rs.sqlStatement = sqlStatement;
  }

  hasAnyAnnotation(types: AnnotationType[]): boolean {
    return this.rs.rows.some((row) => RowHelper.hasAnyAnnotation(row, types));
  }

  fillnull(how: "mean" | "median"): void {
    this.rs.keys
      .filter((k) => isNumericLike(k.type))
      .forEach((k) => {
        const num_list = new Array<number>();
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

  resetKeyTypeByRows(): void {
    const fieldTypeMap = new Map<string, GC>();
    const keys = this.keynames();
    for (const row of this.rs.rows) {
      if (keys.length === fieldTypeMap.size) {
        break;
      }
      const { values } = row;
      keys
        .filter((f) => !fieldTypeMap.has(f))
        .forEach((it) => {
          const v = values[it];
          if (v !== null && v !== undefined) {
            const vType = typeof v;
            let colType: GC = GC.UNKNOWN;
            if (vType === "boolean") {
              colType = GC.BOOLEAN;
            } else if (vType === "bigint") {
              colType = GC.BIGINT;
            } else if (vType === "number") {
              if (Number.isInteger(v)) {
                colType = GC.INTEGER;
              } else {
                colType = GC.NUMERIC;
              }
            } else if (vType === "string") {
              if (/^(TRUE|FALSE)$/i.test(v)) {
                colType = GC.BOOLEAN;
              } else {
                colType = GC.TEXT;
              }
            } else {
              if (isDate(v)) {
                colType = GC.DATE;
              } else if (Buffer.isBuffer(v)) {
                colType = GC.BLOB;
              }
            }

            if (colType !== GC.UNKNOWN) {
              fieldTypeMap.set(it, colType);
            }
          }
        });
    }
    fieldTypeMap.forEach((v, k) => {
      this.updateKeyType(k, v);
    });
  }

  keynames(is_only_numeric_like = false): string[] {
    if (is_only_numeric_like) {
      return this.rs.keys
        .filter((k) => isNumericLike(k.type))
        .map((k) => k.name);
    }
    return this.rs.keys.map((k) => k.name);
  }

  setSummary({
    info,
    elapsedTimeMilli,
    selectedRows,
    affectedRows,
    insertId,
    changedRows,
    capacityUnits,
    scannedRows,
    requestCount,
    retryCount,
    readCapacityUnits,
    writeCapacityUnits,
    hasMoreRows,
  }: {
    // Caller-supplied display text for RdhSummary.info. When omitted, the
    // existing RDB-oriented "N rows in set (...)"/"N rows affected (...)"
    // text is generated as before (backward compatible for RDB, Redis,
    // Memcached, etc. callers). When provided (e.g. by a DynamoDB-specific
    // formatter), it is used verbatim and the automatic " CU (...)" suffix
    // below is skipped - the caller's formatter is expected to already
    // include any Capacity text it wants shown.
    info?: string;
    elapsedTimeMilli: number;
    selectedRows?: number;
    affectedRows?: number;
    insertId?: number;
    changedRows?: number;
    capacityUnits?: number;
    scannedRows?: number;
    requestCount?: number;
    retryCount?: number;
    readCapacityUnits?: number;
    writeCapacityUnits?: number;
    hasMoreRows?: boolean;
  }): void {
    const elapsedTime = (elapsedTimeMilli / 1000).toFixed(2);

    if (selectedRows === undefined) {
      // insert, update, delete
      this.rs.summary = {
        info:
          info ??
          `${affectedRows} row${
            affectedRows === 1 ? "" : "s"
          } affected (${elapsedTime} sec)`,
        elapsedTimeMilli,
        insertId: insertId,
        affectedRows: affectedRows,
        changedRows: changedRows,
        capacityUnits,
        scannedRows,
        requestCount,
        retryCount,
        readCapacityUnits,
        writeCapacityUnits,
        hasMoreRows,
      };
    } else {
      // select
      this.rs.summary = {
        info:
          info ??
          `${selectedRows} row${
            selectedRows === 1 ? "" : "s"
          } in set (${elapsedTime} sec)`,
        elapsedTimeMilli,
        selectedRows,
        capacityUnits,
        scannedRows,
        requestCount,
        retryCount,
        readCapacityUnits,
        writeCapacityUnits,
        hasMoreRows,
      };
    }
    if (info === undefined && capacityUnits !== undefined) {
      this.rs.summary.info += ` CU (${capacityUnits})`;
    }
  }
}
