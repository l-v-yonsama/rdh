import { RdhHelper, RowHelper } from "../resource";
import type { CodeItem, CodeItemDetail, ResultSetData } from "../types";
import { equalsIgnoreCase } from "../utils";

type ColumnMatcher = (target: string) => boolean;

type CompiledCodeItem = {
  matchesColumn: ColumnMatcher;
  detailByStringCode: Map<string, CodeItemDetail>;
  detailByNumericCode: Map<number, CodeItemDetail>;
};

/** 列名(またはテーブル名)に対するCodeItem.resource.*の一致判定を1回だけコンパイルする。 */
function compileMatcher(resource: { regex: boolean; pattern: string }): ColumnMatcher {
  if (resource.regex) {
    let re: RegExp;
    try {
      re = new RegExp(resource.pattern, "i");
    } catch (_e) {
      // 不正なregexパターンは「何にも一致しない」として扱う。1つのCodeItemの
      // 設定ミスでresolveCodeLabel全体が例外で止まらないようにするため。
      return () => false;
    }
    return (target: string) => re.test(target);
  }
  const pattern = resource.pattern;
  return (target: string) => equalsIgnoreCase(target, pattern);
}

function matchesTable(
  tableCondition: CodeItem["resource"]["table"],
  tableName: string | undefined
): boolean {
  if (!tableCondition) {
    return true;
  }
  // RdhMeta.tableNameはoptionalなので、table条件を持つCodeItemに対して
  // tableNameが未設定のRDHは「一致しない」として扱う(以前はundefinedが
  // equalsIgnoreCase()内のtoLocaleLowerCase()へ渡りTypeErrorになっていた)。
  if (tableName === undefined || tableName === null) {
    return false;
  }
  return compileMatcher(tableCondition)(tableName);
}

/**
 * detail.code(常にstring)と実際のセル値を比較できるよう、code一覧を
 * 文字列キー・数値キー2つのMapへ事前展開しておく。
 *
 * 従来は `detail.code == columnValue` という`==`の暗黙型変換に頼っていた。
 * それと同じ結果になるよう、型ごとに明示的なルールへ置き換える
 * (findDetailByColumnValue参照)。同じcodeが複数あった場合は、
 * Array.prototype.find()同様に最初に登場した方を優先する(後勝ちにしない)。
 */
function compileDetails(details: CodeItemDetail[]): {
  detailByStringCode: Map<string, CodeItemDetail>;
  detailByNumericCode: Map<number, CodeItemDetail>;
} {
  const detailByStringCode = new Map<string, CodeItemDetail>();
  const detailByNumericCode = new Map<number, CodeItemDetail>();
  details.forEach((detail) => {
    if (!detailByStringCode.has(detail.code)) {
      detailByStringCode.set(detail.code, detail);
    }
    const n = Number(detail.code);
    if (!Number.isNaN(n) && !detailByNumericCode.has(n)) {
      detailByNumericCode.set(n, detail);
    }
  });
  return { detailByStringCode, detailByNumericCode };
}

/**
 * columnValueの型ごとに、`detail.code == columnValue`と同じ結果になるよう
 * 明示的に比較する。
 * - string: 文字列同士の完全一致(大文字小文字は区別する)。
 * - number: `==`はcodeをToNumberしてから比較するため、code側も数値化して
 *   比較する(code:"05"はcolumnValue:5と一致する。NaNになるcodeはどんな
 *   数値とも一致しない)。
 * - boolean: `==`はbooleanを先に0/1へ変換してから比較するため、numberと
 *   同じ扱いにする(code:"1"はtrueと一致するが、code:"true"という文字列
 *   は一致しない)。
 * - null/undefined: どのcodeとも一致しない(`==`でも常にfalse)。
 * - それ以外(bigint/Date/オブジェクト等)はcode列挙値としては実運用上
 *   想定していないため、文字列化した完全一致にフォールバックする。
 */
function findDetailByColumnValue(
  item: CompiledCodeItem,
  columnValue: unknown
): CodeItemDetail | undefined {
  if (columnValue === null || columnValue === undefined) {
    return undefined;
  }
  if (typeof columnValue === "string") {
    return item.detailByStringCode.get(columnValue);
  }
  if (typeof columnValue === "number") {
    if (Number.isNaN(columnValue)) {
      return undefined;
    }
    return item.detailByNumericCode.get(columnValue);
  }
  if (typeof columnValue === "boolean") {
    return item.detailByNumericCode.get(columnValue ? 1 : 0);
  }
  return item.detailByStringCode.get(String(columnValue));
}

/** 行処理の前に、codeItems設定を1回だけコンパイルする。 */
function compileCodeItems(
  codeItems: CodeItem[],
  tableName: string | undefined
): CompiledCodeItem[] {
  return codeItems
    .filter((item) => matchesTable(item.resource.table, tableName))
    .map((item) => ({
      matchesColumn: compileMatcher(item.resource.column),
      ...compileDetails(item.details),
    }));
}

/** 列名ごとに適用されるCompiledCodeItemの一覧を1回だけ作る。 */
function buildColumnLookup(
  compiledItems: CompiledCodeItem[],
  columnNames: string[]
): Map<string, CompiledCodeItem[]> {
  const lookup = new Map<string, CompiledCodeItem[]>();
  columnNames.forEach((columnName) => {
    const applicable = compiledItems.filter((item) => item.matchesColumn(columnName));
    if (applicable.length > 0) {
      lookup.set(columnName, applicable);
    }
  });
  return lookup;
}

/**
 * rdh.meta.codeItemsの定義に従って、各セルへコード値に対応するラベルを
 * "Cod"アノテーションとして書き込む。diff系関数と異なりrdhを直接書き換える
 * (非破壊ではない、既存の呼び出し側はrdb.rsを直接渡してその場で更新される
 * ことを前提にしている)。
 *
 * 解決を始める前に、対象rdh全体の既存"Cod"アノテーションを必ずクリアする。
 * そうしないと、ラベル定義を変更して再実行した際に古いラベルと新しい
 * ラベルが同じセルに両方残ってしまう。codeItemsの変更によって
 * 以前は適用されていた設定が適用されなくなった場合でも、古いCod注釈が
 * 残り続けないよう、適用可否を判定するより前にクリアする。
 */
export const resolveCodeLabel = async (
  rdh: ResultSetData
): Promise<boolean> => {
  const { tableName, codeItems } = rdh.meta;
  if (!codeItems || codeItems.length === 0) {
    return false;
  }

  RdhHelper.clearAnnotationsByType(rdh, "Cod");

  const compiledItems = compileCodeItems(codeItems, tableName);
  const columnNames = rdh.keys.map((it) => it.name);
  const columnLookup = buildColumnLookup(compiledItems, columnNames);
  if (columnLookup.size === 0) {
    return false;
  }
  const columnEntries = [...columnLookup.entries()];

  for (const row of rdh.rows) {
    for (const [columnName, items] of columnEntries) {
      const columnValue = row.values[columnName];
      for (const item of items) {
        const detail = findDetailByColumnValue(item, columnValue);
        if (detail) {
          RowHelper.pushAnnotation(row, columnName, {
            type: "Cod",
            values: {
              label: detail.label,
              isUndefined: false,
            },
          });
        } else if (columnValue) {
          RowHelper.pushAnnotation(row, columnName, {
            type: "Cod",
            values: {
              label: "Undefined",
              isUndefined: true,
            },
          });
        }
      }
    }
  }
  return true;
};
