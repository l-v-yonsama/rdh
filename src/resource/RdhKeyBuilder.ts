import { GeneralColumnType as GC, RdhKey } from "../types";
import isDate, { getUniqObjectKeys } from "../utils";
import { isArray, isEnumOrSet, isNumericLike, isTextLike } from "./GeneralColumnUtil";

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

// 推論用: 値からGeneralColumnTypeを返す
function inferGeneralColumnType(value: any): GC | undefined {
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
}

export function createRdhKeysOf(list: any[]): RdhKey[] {
  if (list.length === 0) return [];

  const fieldNames = getUniqObjectKeys(list);

  return fieldNames.map((name) => {
    let detectedType = inferGeneralColumnType(list[0][name]);

    for (let i = 1; i < list.length; i++) {
      const currentType = inferGeneralColumnType(list[i][name]);

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
