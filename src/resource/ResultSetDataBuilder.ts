import dayjs from "dayjs";
import * as ss from "simple-statistics";
import {
  AnnotationType,
  CellAnnotation,
  GeneralColumnType as GC,
  RdhKey,
  RdhMeta,
  RdhRow,
  RdhRowMeta,
  ResultSetData,
  RuleAnnotation,
  TableRuleDetail,
  ToStringParam,
  isResultSetData,
} from "../types";
import isDate, { getUniqObjectKeys, toBoolean, toDate } from "../utils";
import {
  isArray,
  isBinaryLike,
  isBooleanLike,
  isDateTimeOrDate,
  isDateTimeOrDateOrTime,
  isEnumOrSet,
  isNumericLike,
  isTextLike,
} from "./GeneralColumnUtil";
import { toContentString } from "./toStringUtil";

export function createRdhKey({
  name,
  comment,
  type,
  width,
  required,
  align,
  meta,
}: {
  name: string;
  comment?: string;
  type?: GC;
  width?: number;
  required?: boolean;
  align?: RdhKey["align"];
  meta?: RdhKey["meta"];
}): RdhKey {
  if (align === undefined) {
    if (isNumericLike(type)) {
      align = "right";
    } else if (isTextLike(type) || isEnumOrSet(type) || isArray(type)) {
      align = "left";
    }
  }

  const key: RdhKey = {
    name,
    type: type ?? GC.UNKNOWN,
    comment,
    width,
    required,
    align,
    meta,
  };

  return key;
}

export function createRdhKeysOf(list: any[]): RdhKey[] {
  if (list.length === 0) return [];

  // 推論用: 値からGeneralColumnTypeを返す
  const inferType = (value: any): GC | undefined => {
    if (value === null) return GC.NULL;
    if (value === undefined) return undefined;
    if (typeof value === "bigint") return GC.BIGINT;
    if (typeof value === "boolean") return GC.BOOLEAN;
    if (typeof value === "number") return GC.NUMERIC;
    if (typeof value === "string") return GC.TEXT;
    if (typeof value === "object") {
      if (isDate(value)) return GC.DATE;
      return GC.JSON;
    }
    return GC.UNKNOWN;
  };

  const fieldNames = getUniqObjectKeys(list);

  return fieldNames.map((name) => {
    let detectedType = inferType(list[0][name]);

    for (let i = 1; i < list.length; i++) {
      const currentType = inferType(list[i][name]);

      if (currentType === undefined) {
        // 無視して前の型を維持
        continue;
      }
      if (currentType === GC.NULL) {
        // nullは型推論に影響しない
        if (detectedType === undefined) {
          detectedType = currentType;
        }
        continue;
      }
      if (detectedType === undefined || detectedType === GC.NULL) {
        detectedType = currentType;
        continue;
      }
      if (detectedType !== currentType) {
        // 型が混在している場合はUNKNOWNにする
        detectedType = GC.UNKNOWN;
        break;
      }
    }

    return createRdhKey({ name, type: detectedType });
  });
}

export function isResultSetDataBuilder(
  item: any
): item is ResultSetDataBuilder {
  return item.rs && isResultSetData(item.rs);
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

/**
 * RDHが実際に扱う値を対象にしたディープクローン。
 *
 * `JSON.parse(JSON.stringify(...))` は手軽だが、次の値を静かに破壊するか例外を
 * 投げる: NaN/Infinity/-Infinity → null、-0 → 0、bigint → TypeError、
 * Date → ISO文字列、Buffer/Set → 中身の失われたプレーンオブジェクト。
 * これらはGC.BIGINT・数値型・日付型・バイナリ型・STRING_SET/NUMERIC_SET/
 * BINARY_SET型として実際に扱われうる値であり、`ResultSetDataBuilder.from()`
 * (ひいては非破壊化されたdiff系関数の比較・戻り値)の正しさに直結する。
 * ここではプリミティブ値をそのまま返し、Date/Buffer/Setのみ中身を保った別
 * インスタンスとして複製することで、これらの値を保持する。
 */
function cloneRdhValue<T>(value: T): T {
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }
  if (Buffer.isBuffer(value)) {
    return Buffer.from(value) as T;
  }
  if (value instanceof Set) {
    return new Set(
      Array.from(value, (item) => cloneRdhValue(item))
    ) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => cloneRdhValue(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, cloneRdhValue(child)])
    ) as T;
  }
  // string/number(NaN・Infinity・-0含む)/boolean/null/undefined/bigintは
  // イミュータブルなのでそのまま返してよい。
  return value;
}

export class RowHelper {
  static getRuleEngineValues(row: RdhRow, keys: RdhKey[]): Record<string, any> {
    const ret: Record<string, any> = {};
    keys.forEach((key) => {
      const v = row.values[key.name];
      if (isDateTimeOrDate(key.type)) {
        if (v === null || v === undefined) {
          ret[key.name] = v;
        } else {
          ret[key.name] = dayjs(v).valueOf();
        }
      } else {
        ret[key.name] = v;
      }
    });
    return ret;
  }

  static pushAnnotation(
    row: RdhRow,
    key: string,
    annotation: CellAnnotation
  ): void {
    if (row.meta[key] === undefined) {
      row.meta[key] = new Array<CellAnnotation>();
    }
    row.meta[key].push(annotation);
  }

  static getFirstAnnotationOf<T extends CellAnnotation = CellAnnotation>(
    row: RdhRow,
    key: string,
    type: T["type"]
  ): T | undefined {
    if (row.meta[key]) {
      const annotations = row.meta[key];
      if (annotations) {
        return annotations.find((a) => a.type === type) as T;
      }
    }
    return undefined;
  }

  static filterAnnotationOf<T extends CellAnnotation = CellAnnotation>(
    row: RdhRow,
    type: T["type"]
  ): { [key: string]: T[] } {
    const keys = Object.keys(row.meta);
    return keys
      .filter((key) => row.meta[key].some((it) => it.type === type))
      .reduce((p, key) => {
        const obj: Record<string, T[]> = {
          ...p,
        };
        obj[key] = row.meta[key].filter((it) => it.type === type) as T[];
        return obj;
      }, {});
  }

  static filterAnnotationByKeyOf<T extends CellAnnotation = CellAnnotation>(
    row: RdhRow,
    key: string,
    type: T["type"]
  ): T[] {
    if (row.meta[key]) {
      const annotations = row.meta[key];
      return (annotations?.filter((a) => a.type === type) ?? []) as T[];
    }
    return [];
  }

  static clearAllAnnotations(row: RdhRow): void {
    Object.keys(row.meta).forEach((key) => {
      delete row.meta[key];
    });
  }

  static clearAnnotationByType(
    row: RdhRow,
    type: AnnotationType | AnnotationType[]
  ): void {
    const types = Array.isArray(type) ? type : [type];
    const meta_keys = Object.keys(row.meta);
    if (meta_keys.length > 0) {
      for (let i = 0; i < meta_keys.length; i++) {
        const annotations = row.meta[meta_keys[i]];
        if (!annotations) {
          continue;
        }
        for (let j = 0; j < annotations.length; j++) {
          if (types.includes(annotations[j].type)) {
            annotations.splice(j, 1);
            j--;
          }
        }
      }
    }
  }

  static hasAnyAnnotation(row: RdhRow, types: AnnotationType[]): boolean {
    if (row.meta && types.length) {
      return (
        Object.values(row.meta)
          ?.flat()
          ?.some((it) => types.includes(it.type)) ?? false
      );
    }
    return false;
  }

  static hasAnnotation(row: RdhRow, type: AnnotationType): boolean {
    return this.hasAnyAnnotation(row, [type]);
  }

  static hasRuleAnnotation(row: RdhRow, ruleDetail: TableRuleDetail): boolean {
    if (row.meta && row.meta[ruleDetail.error.column]) {
      const v = row.meta[ruleDetail.error.column];
      return v.some(
        (it) => it.type === "Rul" && it.values.name === ruleDetail.ruleName
      );
    }
    return false;
  }

  static getFirstRuleAnnotation(
    row: RdhRow,
    ruleDetail: TableRuleDetail
  ): RuleAnnotation | undefined {
    if (row.meta && row.meta[ruleDetail.error.column]) {
      const v = row.meta[ruleDetail.error.column];
      return v.find(
        (it) => it.type === "Rul" && it.values.name === ruleDetail.ruleName
      ) as RuleAnnotation;
    }
    return undefined;
  }
}

export class RdhHelper {
  static clearAllAnotations(rdh: ResultSetData): void {
    rdh.rows.forEach((row) => RowHelper.clearAllAnnotations(row));
  }

  static clearAnnotationsByType(
    rdh: ResultSetData,
    type: AnnotationType | AnnotationType[]
  ): void {
    rdh.rows.forEach((row) => RowHelper.clearAnnotationByType(row, type));
  }
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
    const cloneFromRdh = (obj: ResultSetData): ResultSetDataBuilder => {
      const plainObj: ResultSetData = cloneRdhValue(obj);
      const rdb = new ResultSetDataBuilder(plainObj.keys);
      const dateKeys = rdb.rs.keys
        .filter((k) => isDateTimeOrDate(k.type))
        .map((k) => k.name);
      const binaryKeys = rdb.rs.keys
        .filter((k) => isBinaryLike(k.type))
        .map((k) => k.name);
      // cloneRdhValueは、この関数に渡された時点で「生きている」Date/Buffer/Set
      // インスタンスを直接複製する。それらについては以下の処理は毎回素通りする
      // だけの無害な処理になる。
      //
      // 一方で以下の処理が本当に意味を持つのは別のケースである: from()に渡さ
      // れた引数obj自体が、この呼び出しより前に、どこか別の場所で一度JSONを
      // 経由して平坦化されたプレーンオブジェクト(Dateが
      // "2024-01-01T00:00:00.000Z"のような文字列、Bufferが
      // {type:"Buffer",data:[...]}のような形)である場合。このケースでは
      // cloneRdhValueは(instanceof Date等に該当しないため)その文字列/プレーン
      // オブジェクトをそのまま素通りさせるので、ここで初めてtoDate()/
      // Buffer.from()が実際に型を復元する仕事をする。
      //
      // from(list: any, ...)は引数の型がanyで、isResultSetData()による判定も
      // created/keys/rows/metaの有無を見る構造的なチェックのみ(値の中身が
      // 本物のDate/Bufferかどうかは見ない)ため、「JSON整形済みのプレーン
      // オブジェクトをfrom()に渡す」という使い方自体はこのAPIの型上禁止され
      // ていない。
      const rehydrateAnnotationValues = (meta: RdhRowMeta): void => {
        Object.keys(meta).forEach((columnName) => {
          meta[columnName].forEach((annotation) => {
            if (annotation.type === "Upd" && annotation.values) {
              const otherValue = annotation.values.otherValue;
              if (otherValue == null) {
                return;
              }
              if (dateKeys.includes(columnName)) {
                annotation.values.otherValue = toDate(otherValue);
              } else if (
                binaryKeys.includes(columnName) &&
                typeof otherValue === "object" &&
                otherValue["type"] === "Buffer" &&
                Array.isArray(otherValue["data"])
              ) {
                annotation.values.otherValue = Buffer.from(otherValue.data);
              }
            } else if (annotation.type === "Fil" && annotation.values) {
              const lastModified = annotation.values.lastModified;
              if (lastModified) {
                annotation.values.lastModified = toDate(lastModified);
              }
            }
          });
        });
      };
      plainObj.rows.forEach((row) => {
        const { values, meta } = row;
        // このrehydrateAnnotationValues定義直前のコメント参照: 通常は
        // cloneRdhValueが既に複製済みのため無害だが、JSON経由で平坦化された
        // 入力に対しては、この2ループが実際に型を復元する側になる。
        for (const dateKey of dateKeys) {
          const v = values[dateKey];
          values[dateKey] = v === null ? null : toDate(v);
        }
        for (const binaryKey of binaryKeys) {
          const v = values[binaryKey];
          if (
            v &&
            typeof v === "object" &&
            v["type"] === "Buffer" &&
            v["data"] &&
            Array.isArray(v["data"])
          ) {
            values[binaryKey] = Buffer.from(v.data);
          }
        }
        rehydrateAnnotationValues(meta);
        rdb.addRow(values, meta);
      });
      if (plainObj.meta) {
        Object.keys(plainObj.meta).forEach((key) => {
          rdb.rs.meta[key] = plainObj.meta[key];
        });
      }
      (rdb.rs as any)["created"] = toDate(plainObj.created);
      (rdb.rs as any)["noRecordsReason"] = plainObj.noRecordsReason;
      rdb.rs.sqlStatement = plainObj.sqlStatement;
      rdb.rs.summary = plainObj.summary;
      rdb.rs.shuffledIndexes = plainObj.shuffledIndexes;
      rdb.rs.shuffledNextCounter = plainObj.shuffledNextCounter;
      rdb.rs.mergeCells = plainObj.mergeCells;
      rdb.rs.queryConditions = plainObj.queryConditions;
      return rdb;
    };

    if (isResultSetData(list)) {
      return cloneFromRdh(list);
    }
    if (isResultSetDataBuilder(list)) {
      return cloneFromRdh(list.rs);
    }

    const t = typeof list;
    let ret: ResultSetDataBuilder;
    // console.log('outputToSpread, list=', list, t, list.constructor.name)

    if (list instanceof Array) {
      if (list.length === 0) {
        throw new Error("No records");
      }
      const strTitles: string[] = [];

      let elm = list[0];
      if (elm instanceof Array) {
        if (options?.firstRowAsTitle) {
          strTitles.push(...elm);
        } else {
          let i = strTitles.length + 1;
          while (strTitles.length < elm.length) {
            strTitles.push(`K${i++}`);
          }
        }

        ret = new ResultSetDataBuilder(strTitles);

        for (let r = options?.firstRowAsTitle ? 1 : 0; r < list.length; r++) {
          elm = list[r];
          const values: any = {};
          for (let c = 0; c < elm.length; c++) {
            values[strTitles[c]] = elm[c];
          }
          ret.addRow(values);
        }
      }
    } else {
      switch (t) {
        case "object":
          ret = new ResultSetDataBuilder([
            createRdhKey({
              name: "KEY",
              type: GC.TEXT,
              width: 120,
            }),
            createRdhKey({
              name: "TYPE",
              type: GC.TEXT,
              width: 80,
            }),
            createRdhKey({
              name: "VALUE",
              type: GC.JSON,
              width: 400,
            }),
          ]);
          Object.keys(list).forEach((k: string) => {
            const v = list[k];
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
    elapsedTimeMilli,
    selectedRows,
    affectedRows,
    insertId,
    changedRows,
    capacityUnits,
  }: {
    elapsedTimeMilli: number;
    selectedRows?: number;
    affectedRows?: number;
    insertId?: number;
    changedRows?: number;
    capacityUnits?: number;
  }): void {
    const elapsedTime = (elapsedTimeMilli / 1000).toFixed(2);

    if (selectedRows === undefined) {
      // insert, update, delete
      this.rs.summary = {
        info: `${affectedRows} row${
          affectedRows === 1 ? "" : "s"
        } affected (${elapsedTime} sec)`,
        elapsedTimeMilli,
        insertId: insertId,
        affectedRows: affectedRows,
        changedRows: changedRows,
        capacityUnits,
      };
    } else {
      // select
      this.rs.summary = {
        info: `${selectedRows} row${
          selectedRows === 1 ? "" : "s"
        } in set (${elapsedTime} sec)`,
        elapsedTimeMilli,
        selectedRows,
        capacityUnits,
      };
    }
    if (capacityUnits !== undefined) {
      this.rs.summary.info += ` CU (${capacityUnits})`;
    }
  }
}
