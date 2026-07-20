import isEqual from "lodash.isequal";
import {
  RdhHelper,
  ResultSetDataBuilder,
  RowHelper,
  displayGeneralColumnType,
  isNotSupportDiffType,
} from "../resource";
import {
  AnnotationType,
  CompareKey,
  DiffResult,
  DiffToUndoChangesResult,
  RdhRow,
  ResultSetData,
} from "../types";
import isDate from "../utils";

const DIFF_ANNOTATION_TYPES: AnnotationType[] = ["Upd", "Del", "Add"];

type DiffContext =
  | { ok: false; message: string }
  | {
      ok: true;
      rdb1: ResultSetDataBuilder;
      rdb2: ResultSetDataBuilder;
      keynames: string[];
      compareKey: CompareKey;
      supportedKeyNames: string[];
      notSupportedKeyNames: string[];
    };

/**
 * diff/asyncDiff/diffToUndoChanges に共通する準備処理(compareKeyの検証・解決、
 * 比較対象カラムの絞り込み)をまとめたもの。
 */
function resolveDiffContext(
  rdh1: ResultSetData,
  rdh2: ResultSetData
): DiffContext {
  if (!rdh1.meta?.compareKeys || rdh1.meta?.compareKeys.length === 0) {
    return {
      ok: false,
      message: "Missing compare key (Primary or uniq key).",
    };
  }
  const rdb1 = ResultSetDataBuilder.from(rdh1);
  const rdb2 = ResultSetDataBuilder.from(rdh2);

  const keynames = rdb1.keynames();
  const compareKey = getAvailableCompareKey(keynames, rdh1.meta?.compareKeys);
  if (!compareKey) {
    return {
      ok: false,
      message: "Missing available compare key (Primary or uniq key).",
    };
  }

  const notSupportedCompareKeys = rdb1.rs.keys
    .filter((it) => compareKey.names.includes(it.name))
    .filter((it) => isNotSupportDiffType(it.type));
  if (notSupportedCompareKeys.length) {
    const keys = notSupportedCompareKeys
      .map((it) => `${it.name}: ${displayGeneralColumnType(it.type)}`)
      .join(",");
    return {
      ok: false,
      message: `Not supported compare keys (${keys}).`,
    };
  }

  const supportedKeyNames = rdb1.rs.keys
    .filter((it) => !isNotSupportDiffType(it.type))
    .map((it) => it.name);
  const notSupportedKeyNames = rdb1.rs.keys
    .filter((it) => isNotSupportDiffType(it.type))
    .map((it) => it.name);

  // クローン(rdb1.rs/rdb2.rs)側でのみ、直近のdiff結果として残っている可能性が
  // あるUpd/Del/Addを型スコープでクリアする。db-notebook側ではdiffを繰り返し
  // 実行する運用があり、渡されるrdh1/rdh2自体が前回のdiff結果(=非破壊化後は
  // 前回のクローン)を再利用することがあるため、古いUpd/Del/Addを引き継がない
  // ようにする。Cod/Rul/Lnt/Stl/Filなど他の既存アノテーションはここでは触らない。
  // 引数rdh1/rdh2そのものは一切変更しない(非破壊)。
  RdhHelper.clearAnnotationsByType(rdb1.rs, DIFF_ANNOTATION_TYPES);
  RdhHelper.clearAnnotationsByType(rdb2.rs, DIFF_ANNOTATION_TYPES);

  return {
    ok: true,
    rdb1,
    rdb2,
    keynames,
    compareKey,
    supportedKeyNames,
    notSupportedKeyNames,
  };
}

type ChangedColumn = { name: string; v1: any; v2: any };

/** row1とrow2について、supportedKeyNamesのうち値が異なる列を抽出する。 */
function diffRowColumns(
  row1: RdhRow,
  row2: RdhRow,
  supportedKeyNames: string[]
): ChangedColumn[] {
  const changed: ChangedColumn[] = [];
  supportedKeyNames.forEach((name) => {
    const v1 = row1.values[name];
    const v2 = row2.values[name];
    if (!equals(v1, v2)) {
      changed.push({ name, v1, v2 });
    }
  });
  return changed;
}

type MatchHandlers = {
  onMatched: (row1: RdhRow, row2: RdhRow) => void;
  onRemoved: (row1: RdhRow) => void;
  onInserted: (row2: RdhRow) => void;
};

/**
 * diff/diffToUndoChanges が共有する同期版の行突合ループ。asyncDiff はキャンセル
 * 確認と定期yieldを外側ループで行う必要があるため、これは使わず自前でループする
 * (行比較そのものは diffRowColumns 等の共有ヘルパーを使う)。
 */
function matchCompareKeyRows(
  rdh1Rows: RdhRow[],
  rdh2Rows: RdhRow[],
  compareKey: CompareKey,
  handlers: MatchHandlers
): void {
  const hasAlreadyChecked = new Set<string>();

  rdh1Rows.forEach((row1) => {
    const key1 = createCompareKeysValue(compareKey, row1);
    hasAlreadyChecked.add(key1);
    const row2 = rdh2Rows.find(
      (candidate) => createCompareKeysValue(compareKey, candidate) === key1
    );
    if (row2) {
      handlers.onMatched(row1, row2);
    } else {
      handlers.onRemoved(row1);
    }
  });

  rdh2Rows.forEach((row2) => {
    const key2 = createCompareKeysValue(compareKey, row2);
    if (!hasAlreadyChecked.has(key2)) {
      handlers.onInserted(row2);
    }
  });
}

/**
 * rdh1(旧)とrdh2(新)をcompareKeyで突き合わせる。引数rdh1/rdh2は変更せず、
 * それぞれのクローンにUpd/Del/Addアノテーションを付与して結果(result.rdh1/rdh2)
 * として返す。戻り値はそのクローンと件数サマリー。
 */
export const diff = (rdh1: ResultSetData, rdh2: ResultSetData): DiffResult => {
  const result: DiffResult = {
    ok: false,
    deleted: 0,
    inserted: 0,
    updated: 0,
    updatedColumns: 0,
    message: "",
  };
  const context = resolveDiffContext(rdh1, rdh2);
  if (context.ok === false) {
    result.message = context.message;
    return result;
  }
  const { keynames, compareKey, supportedKeyNames, rdb1, rdb2 } = context;

  matchCompareKeyRows(rdb1.rs.rows, rdb2.rs.rows, compareKey, {
    onMatched: (row1, row2) => {
      const changed = diffRowColumns(row1, row2, supportedKeyNames);
      changed.forEach(({ name, v1, v2 }) => {
        result.updatedColumns++;
        RowHelper.pushAnnotation(row1, name, {
          type: "Upd",
          values: { otherValue: v2 },
        });
        RowHelper.pushAnnotation(row2, name, {
          type: "Upd",
          values: { otherValue: v1 },
        });
      });
      if (changed.length) {
        result.updated++;
      }
    },
    onRemoved: (row1) => {
      if (supportedKeyNames.length) {
        supportedKeyNames.forEach((name) => {
          RowHelper.pushAnnotation(row1, name, { type: "Del" });
        });
        result.deleted++;
      }
    },
    onInserted: (row2) => {
      keynames.forEach((name) => {
        RowHelper.pushAnnotation(row2, name, { type: "Add" });
      });
      result.inserted++;
    },
  });

  result.ok = true;
  result.rdh1 = rdb1.rs;
  result.rdh2 = rdb2.rs;
  if (result.inserted === 0 && result.deleted === 0 && result.updated === 0) {
    result.message = "No changes";
  } else {
    result.message = `Inserted:${result.inserted}, Deleted:${result.deleted}, Updated:${result.updated} (${result.updatedColumns} column${result.updatedColumns === 1 ? "" : "s"})`;
  }

  return result;
};

/**
 * diff の非同期版。処理内容は同じだが、大量行でもイベントループをブロックしない
 * よう1000行ごとにyieldし、cancelTokenによる途中キャンセルにも対応する。
 */
export const asyncDiff = async (
  rdh1: ResultSetData,
  rdh2: ResultSetData,
  cancelToken?: { isCancellationRequested: boolean }
): Promise<DiffResult> => {
  const result: DiffResult = {
    ok: false,
    deleted: 0,
    inserted: 0,
    updated: 0,
    updatedColumns: 0,
    message: "",
  };
  const context = resolveDiffContext(rdh1, rdh2);
  if (context.ok === false) {
    result.message = context.message;
    return result;
  }
  const { keynames, compareKey, supportedKeyNames, rdb1, rdb2 } = context;
  const rows1 = rdb1.rs.rows;
  const rows2 = rdb2.rs.rows;

  const hasAlreadyChecked = new Set<string>();

  for (let i = 0; i < rows1.length; i++) {
    if (cancelToken?.isCancellationRequested) {
      result.message = `Cancelled.`;
      return result;
    }
    const row1 = rows1[i];
    const key1 = createCompareKeysValue(compareKey, row1);
    hasAlreadyChecked.add(key1);
    const row2 = rows2.find(
      (candidate) => createCompareKeysValue(compareKey, candidate) === key1
    );
    if (row2) {
      const changed = diffRowColumns(row1, row2, supportedKeyNames);
      changed.forEach(({ name, v1, v2 }) => {
        result.updatedColumns++;
        RowHelper.pushAnnotation(row1, name, {
          type: "Upd",
          values: { otherValue: v2 },
        });
        RowHelper.pushAnnotation(row2, name, {
          type: "Upd",
          values: { otherValue: v1 },
        });
      });
      if (changed.length) {
        result.updated++;
      }
    } else if (supportedKeyNames.length) {
      supportedKeyNames.forEach((name) => {
        RowHelper.pushAnnotation(row1, name, { type: "Del" });
      });
      result.deleted++;
    }
    if (i % 1000 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  for (let i = 0; i < rows2.length; i++) {
    if (cancelToken?.isCancellationRequested) {
      result.message = `Cancelled.`;
      return result;
    }
    const row2 = rows2[i];
    const key2 = createCompareKeysValue(compareKey, row2);
    if (!hasAlreadyChecked.has(key2)) {
      keynames.forEach((name) => {
        RowHelper.pushAnnotation(row2, name, { type: "Add" });
      });
      result.inserted++;
    }
    if (i % 1000 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
  result.ok = true;
  result.rdh1 = rdb1.rs;
  result.rdh2 = rdb2.rs;
  if (result.inserted === 0 && result.deleted === 0 && result.updated === 0) {
    result.message = "No changes";
  } else {
    result.message = `Inserted:${result.inserted}, Deleted:${result.deleted}, Updated:${result.updated} (${result.updatedColumns} column${result.updatedColumns === 1 ? "" : "s"})`;
  }

  return result;
};

/**
 * rdh1(旧)とrdh2(新)をcompareKeyで突き合わせ、rdh2をrdh1の状態に戻すための
 * UPDATE/INSERT/DELETE相当の操作記述(toBeUpdated/toBeInserted/toBeDeleted)を返す。
 * diffと異なり行へのアノテーション付与は行わない。引数rdh1/rdh2は変更しない
 * (内部ではresolveDiffContextが作るクローンの行に対してのみ値を読み書きする)。
 */
export const diffToUndoChanges = (
  rdh1: ResultSetData,
  rdh2: ResultSetData
): DiffToUndoChangesResult => {
  const result: DiffToUndoChangesResult = {
    ok: false,
    message: "",
    toBeDeleted: [],
    toBeInserted: [],
    toBeUpdated: [],
  };
  const context = resolveDiffContext(rdh1, rdh2);
  if (context.ok === false) {
    result.message = context.message;
    return result;
  }
  const { compareKey, supportedKeyNames, notSupportedKeyNames, rdb1, rdb2 } =
    context;

  matchCompareKeyRows(rdb1.rs.rows, rdb2.rs.rows, compareKey, {
    onMatched: (row1, row2) => {
      const changed = diffRowColumns(row1, row2, supportedKeyNames);
      if (changed.length) {
        const values: { [key: string]: any } = {};
        changed.forEach(({ name, v1 }) => {
          values[name] = v1;
        });
        result.toBeUpdated.push({
          conditions: createConditionsByCompareKeys(compareKey, row2),
          values,
        });
      }
    },
    onRemoved: (row1) => {
      // row1はクローン(rdb1.rs.rows)由来なので、ここでvaluesを書き換えても
      // 引数rdh1には影響しない。
      const { values } = row1;
      if (notSupportedKeyNames.length) {
        notSupportedKeyNames.forEach((it) => {
          delete values[it];
        });
      }
      result.toBeInserted.push({
        values,
      });
    },
    onInserted: (row2) => {
      result.toBeDeleted.push({
        conditions: createConditionsByCompareKeys(compareKey, row2),
      });
    },
  });

  result.ok = true;
  if (
    result.toBeInserted.length === 0 &&
    result.toBeDeleted.length === 0 &&
    result.toBeUpdated.length === 0
  ) {
    result.message = "No changes";
  } else {
    result.message = `toBeInserted:${result.toBeInserted.length}, toBeDeleted:${result.toBeDeleted.length}, toBeUpdated:${result.toBeUpdated.length}`;
  }

  return result;
};

function createCompareKeysValue(compareKey: CompareKey, row1: RdhRow): string {
  return compareKey.names.map((k) => row1.values[k] ?? "").join("|:|");
}

function createConditionsByCompareKeys(
  compareKey: CompareKey,
  row1: RdhRow
): { [key: string]: any } {
  const conditions: { [key: string]: any } = {};
  compareKey.names.forEach((it) => {
    conditions[it] = row1.values[it];
  });
  return conditions;
}

function getAvailableCompareKey(
  keynames: string[],
  compareKeys: CompareKey[]
): CompareKey | undefined {
  for (const ckey of compareKeys) {
    if (ckey.names.every((it) => keynames.includes(it))) {
      return ckey;
    }
  }
  return undefined;
}

function equals(a: any, b: any): boolean {
  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }
  return isEqual(a, b);
}
