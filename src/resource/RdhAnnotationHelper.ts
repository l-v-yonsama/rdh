import dayjs from "dayjs";
import {
  AnnotationType,
  CellAnnotation,
  RdhKey,
  RdhRow,
  ResultSetData,
  RuleAnnotation,
  TableRuleDetail,
} from "../types";
import { isDateTimeOrDate } from "./GeneralColumnUtil";

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
