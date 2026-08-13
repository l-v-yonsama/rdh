import isEqual from "lodash.isequal";
import {
  RdhHelper,
  ResultSetDataBuilder,
  RowHelper,
  displayGeneralColumnType,
  isNotSupportCompareKeyType,
  isNotSupportDiffType,
} from "../resource";
import {
  AnnotationType,
  CancelToken,
  CompareKey,
  DiffResult,
  DiffToUndoChangesResult,
  RdhRow,
  ResultSetData,
} from "../types";
import isDate from "../utils";

const DIFF_ANNOTATION_TYPES: AnnotationType[] = ["Upd", "Del", "Add"];

/**
 * asyncDiffが索引構築・行走査の各ループで1回のchunkとして処理する行数。
 * 大きすぎるとイベントループを長く止め、小さすぎるとsetImmediateの呼び出し
 * 回数が増えオーバーヘッドが無視できなくなる。500〜1,000行を目安にする
 * (misc/full-review-remediation-plan-2026-08-13.md 4.4)。
 */
const ASYNC_YIELD_CHUNK_SIZE = 500;

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
 * 比較対象カラムの絞り込み、非破壊クローン)をまとめたもの。行の突合(索引構築・
 * マッチング)はここでは行わない。asyncDiff はそちらを別途キャンセル・yield
 * 対応させる必要があるため(4.3/4.4)。
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

  // compareKeyの列自体は、行索引で使う値表現が一意に定まるスカラー型のみ許可
  // する(4.1)。JSON/ARRAY/SET等のオブジェクト・コレクション値を持ちうる型は、
  // 通常の値列としてのdiff対象(supportedKeyNames、下記)からは除外しない。
  const notSupportedCompareKeys = rdb1.rs.keys
    .filter((it) => compareKey.names.includes(it.name))
    .filter((it) => isNotSupportCompareKeyType(it.type));
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

// ---------------------------------------------------------------------------
// compare keyの値表現・等価判定 (4.1)
// ---------------------------------------------------------------------------

/**
 * JSON.stringifyできない値(循環参照等)でも例外を投げずに文字列化するための
 * フォールバック。
 */
function safeJsonStringify(value: unknown): string {
  try {
    const s = JSON.stringify(value);
    return s ?? String(value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return String(value);
  }
}

/**
 * compareKeyの1列分の値を、行索引(Map)のバケットキーとして使える文字列へ
 * 変換する。先頭の数字は型タグで、型が異なれば(number 1 と string "1"等)
 * 必ず異なる文字列になる。string値は長さを埋め込むため、値自身が区切り文字
 * や他の型タグと同じ文字並びを含んでいても後続パートとの境界を誤らない
 * (compareKey.namesの列数は同一のcompareKeyを使う左右で常に同じなので、
 * パート数がずれて誤読されることもない)。
 *
 * -0とNaNは、compareKeyValuesEqual()がそれらを「等しい」として扱う値どうし
 * (それぞれ+0自身、NaN自身)と必ず同じ文字列になるよう、String(value)を
 * そのまま使う(String(-0) === "0"、String(NaN) === "NaN")。バケットが
 * 実際の値より粗くなることはあっても(=異なる値が同じバケットに入る)、その
 * 逆(等しい値が別バケットに入り見つからなくなる)は起きない。バケット内は
 * 常にcomparePartEqualsで再確認するため、粗いバケット分けは正しさに影響
 * しない。
 */
function encodeComparePart(value: unknown): string {
  if (value === null) {
    return "0:";
  }
  if (value === undefined) {
    return "1:";
  }
  if (isDate(value)) {
    return `2:${value.getTime()}`;
  }
  switch (typeof value) {
    case "string":
      return `3:${value.length}:${value}`;
    case "number":
      return `4:${String(value)}`;
    case "bigint":
      return `5:${value.toString()}`;
    case "boolean":
      return `6:${value ? 1 : 0}`;
    default: {
      // compareKeyに使用できる列型はresolveDiffContextのisNotSupportCompareKeyType
      // チェックで事前に弾いているため、通常はここへ到達しない。列の型定義と
      // 実際の値が食い違う不正なデータが来た場合でも例外を投げず、索引構築
      // 自体は継続できるようにする。
      const json = safeJsonStringify(value);
      return `9:${json.length}:${json}`;
    }
  }
}

function encodeCompareKey(keynames: string[], row: RdhRow): string {
  return keynames.map((name) => encodeComparePart(row.values[name])).join("|");
}

/**
 * compareKeyの1列分の値を比較する。SameValueZero相当(-0と+0、NaN同士は
 * 等しい)を採用し、型が異なる値どうし(number 1 と string "1"等)は常に
 * 等しくないものとして扱う。nullとundefinedは、それぞれ自分自身とだけ
 * 等しい(nullとundefined、あるいはどちらかと空文字列は別行として扱う)。
 */
function comparePartEquals(a: unknown, b: unknown): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }
  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "number") {
    return a === b || (Number.isNaN(a) && Number.isNaN(b as number));
  }
  return a === b;
}

function compareKeyEquals(
  keynames: string[],
  row1: RdhRow,
  row2: RdhRow
): boolean {
  return keynames.every((name) =>
    comparePartEquals(row1.values[name], row2.values[name])
  );
}

// ---------------------------------------------------------------------------
// 行索引 (4.2)
// ---------------------------------------------------------------------------

type RowIndex = Map<string, RdhRow[]>;

type IndexBuildResult = { index: RowIndex; hasDuplicates: boolean };

/**
 * compareKeyの値ごとに行をグルーピングする。バケットを配列にしているのは、
 * 万一エンコード結果が衝突しても実値をcompareKeyEqualsで再確認できるように
 * するためと、同じバケットに2行以上入った場合に不正な重複Primary/Unique
 * キーを検出できるようにするため。
 */
function indexRows(rows: RdhRow[], keynames: string[]): IndexBuildResult {
  const index: RowIndex = new Map();
  let hasDuplicates = false;
  for (const row of rows) {
    const key = encodeCompareKey(keynames, row);
    const bucket = index.get(key);
    if (bucket) {
      bucket.push(row);
      hasDuplicates = true;
    } else {
      index.set(key, [row]);
    }
  }
  return { index, hasDuplicates };
}

/**
 * indexRowsの非同期版。cancelTokenの確認とイベントループへのyieldをchunkSize
 * 行ごとに行う。戻り値"cancelled"はキャンセルされたことを表す。
 */
async function indexRowsAsync(
  rows: RdhRow[],
  keynames: string[],
  cancelToken: CancelToken | undefined,
  chunkSize: number
): Promise<IndexBuildResult | "cancelled"> {
  const index: RowIndex = new Map();
  let hasDuplicates = false;
  for (let i = 0; i < rows.length; i++) {
    if (cancelToken?.isCancellationRequested) {
      return "cancelled";
    }
    const row = rows[i];
    const key = encodeCompareKey(keynames, row);
    const bucket = index.get(key);
    if (bucket) {
      bucket.push(row);
      hasDuplicates = true;
    } else {
      index.set(key, [row]);
    }
    await maybeYield(i, chunkSize);
  }
  return { index, hasDuplicates };
}

async function maybeYield(index: number, chunkSize: number): Promise<void> {
  if (index > 0 && index % chunkSize === 0) {
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
}

function duplicateCompareKeyMessage(side: "rdh1" | "rdh2", keynames: string[]): string {
  return `Duplicate compare key value detected in ${side} for column(s): ${keynames.join(", ")}.`;
}

type RowMatchPlan = { ok: true; index2: RowIndex } | { ok: false; message: string };

/**
 * rdh2の行索引を構築し、rdh1・rdh2どちらかの側でcompareKeyが重複していない
 * か検証する。compareKeyはPrimary/Uniqueキーであることが前提のため、同じ側に
 * 重複がある場合、どちらの行を突合相手にするべきか一意に決められない。
 * 曖昧な突合を進めるより、どちらの側に重複があるか分かるメッセージ付きで
 * エラーにする(4.5)。値自体は巨大になりうるため、メッセージには含めない。
 */
function prepareRowMatchPlan(
  rows1: RdhRow[],
  rows2: RdhRow[],
  keynames: string[]
): RowMatchPlan {
  if (indexRows(rows1, keynames).hasDuplicates) {
    return { ok: false, message: duplicateCompareKeyMessage("rdh1", keynames) };
  }
  const { index: index2, hasDuplicates } = indexRows(rows2, keynames);
  if (hasDuplicates) {
    return { ok: false, message: duplicateCompareKeyMessage("rdh2", keynames) };
  }
  return { ok: true, index2 };
}

/** prepareRowMatchPlanの非同期版。索引構築の各ステップでキャンセルを確認する。 */
async function prepareRowMatchPlanAsync(
  rows1: RdhRow[],
  rows2: RdhRow[],
  keynames: string[],
  cancelToken: CancelToken | undefined,
  chunkSize: number
): Promise<RowMatchPlan> {
  const r1 = await indexRowsAsync(rows1, keynames, cancelToken, chunkSize);
  if (r1 === "cancelled") {
    return { ok: false, message: "Cancelled." };
  }
  if (r1.hasDuplicates) {
    return { ok: false, message: duplicateCompareKeyMessage("rdh1", keynames) };
  }
  const r2 = await indexRowsAsync(rows2, keynames, cancelToken, chunkSize);
  if (r2 === "cancelled") {
    return { ok: false, message: "Cancelled." };
  }
  if (r2.hasDuplicates) {
    return { ok: false, message: duplicateCompareKeyMessage("rdh2", keynames) };
  }
  return { ok: true, index2: r2.index };
}

function findMatchingRow(
  row1: RdhRow,
  index2: RowIndex,
  matchedRows2: Set<RdhRow>,
  keynames: string[]
): RdhRow | undefined {
  const bucket = index2.get(encodeCompareKey(keynames, row1));
  if (!bucket) {
    return undefined;
  }
  return bucket.find(
    (candidate) =>
      !matchedRows2.has(candidate) && compareKeyEquals(keynames, row1, candidate)
  );
}

type MatchHandlers = {
  onMatched: (row1: RdhRow, row2: RdhRow) => void;
  onRemoved: (row1: RdhRow) => void;
  onInserted: (row2: RdhRow) => void;
};

/**
 * diff/diffToUndoChanges が共有する同期版の行突合ループ。rdh2の索引(index2)
 * を使ってrdh1の各行をO(1)平均で検索する。asyncDiff用のasyncMatchRowsと
 * ロジックは同じで、キャンセル確認とyieldの有無だけが異なる。
 */
function matchRows(
  rows1: RdhRow[],
  rows2: RdhRow[],
  index2: RowIndex,
  keynames: string[],
  handlers: MatchHandlers
): void {
  const matchedRows2 = new Set<RdhRow>();

  rows1.forEach((row1) => {
    const row2 = findMatchingRow(row1, index2, matchedRows2, keynames);
    if (row2) {
      matchedRows2.add(row2);
      handlers.onMatched(row1, row2);
    } else {
      handlers.onRemoved(row1);
    }
  });

  rows2.forEach((row2) => {
    if (!matchedRows2.has(row2)) {
      handlers.onInserted(row2);
    }
  });
}

/** matchRowsの非同期版。chunkSize行ごとにキャンセル確認とyieldを行う。 */
async function asyncMatchRows(
  rows1: RdhRow[],
  rows2: RdhRow[],
  index2: RowIndex,
  keynames: string[],
  handlers: MatchHandlers,
  cancelToken: CancelToken | undefined,
  chunkSize: number
): Promise<"done" | "cancelled"> {
  const matchedRows2 = new Set<RdhRow>();

  for (let i = 0; i < rows1.length; i++) {
    if (cancelToken?.isCancellationRequested) {
      return "cancelled";
    }
    const row1 = rows1[i];
    const row2 = findMatchingRow(row1, index2, matchedRows2, keynames);
    if (row2) {
      matchedRows2.add(row2);
      handlers.onMatched(row1, row2);
    } else {
      handlers.onRemoved(row1);
    }
    await maybeYield(i, chunkSize);
  }

  for (let i = 0; i < rows2.length; i++) {
    if (cancelToken?.isCancellationRequested) {
      return "cancelled";
    }
    if (!matchedRows2.has(rows2[i])) {
      handlers.onInserted(rows2[i]);
    }
    await maybeYield(i, chunkSize);
  }

  return "done";
}

/** diff/asyncDiffが共有する、Upd/Del/Addアノテーション付与ハンドラ一式。 */
function createDiffAnnotationHandlers(
  result: DiffResult,
  keynames: string[],
  supportedKeyNames: string[]
): MatchHandlers {
  return {
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
  };
}

function finalizeDiffMessage(result: DiffResult): void {
  if (result.inserted === 0 && result.deleted === 0 && result.updated === 0) {
    result.message = "No changes";
  } else {
    result.message = `Inserted:${result.inserted}, Deleted:${result.deleted}, Updated:${result.updated} (${result.updatedColumns} column${result.updatedColumns === 1 ? "" : "s"})`;
  }
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

  const plan = prepareRowMatchPlan(rdb1.rs.rows, rdb2.rs.rows, compareKey.names);
  if (plan.ok === false) {
    result.message = plan.message;
    return result;
  }

  matchRows(
    rdb1.rs.rows,
    rdb2.rs.rows,
    plan.index2,
    compareKey.names,
    createDiffAnnotationHandlers(result, keynames, supportedKeyNames)
  );

  result.ok = true;
  result.rdh1 = rdb1.rs;
  result.rdh2 = rdb2.rs;
  finalizeDiffMessage(result);

  return result;
};

/**
 * diff の非同期版。処理内容・突合規則は同じだが、大量行でもイベントループを
 * 長時間ブロックしないよう索引構築・行走査をchunk単位でyieldし、cancelToken
 * による途中キャンセルにも各ステップで対応する。
 */
export const asyncDiff = async (
  rdh1: ResultSetData,
  rdh2: ResultSetData,
  cancelToken?: CancelToken
): Promise<DiffResult> => {
  const result: DiffResult = {
    ok: false,
    deleted: 0,
    inserted: 0,
    updated: 0,
    updatedColumns: 0,
    message: "",
  };

  if (cancelToken?.isCancellationRequested) {
    result.message = "Cancelled.";
    return result;
  }

  const context = resolveDiffContext(rdh1, rdh2);
  if (context.ok === false) {
    result.message = context.message;
    return result;
  }
  const { keynames, compareKey, supportedKeyNames, rdb1, rdb2 } = context;

  // resolveDiffContext内のクローン(ResultSetDataBuilder.from)は同期O(N)の
  // ため、大きなrdh1/rdh2ではここまでで既にある程度時間を使っている。索引
  // 構築という次のO(N)区間へ入る前に、もう一度キャンセルを確認する。
  if (cancelToken?.isCancellationRequested) {
    result.message = "Cancelled.";
    return result;
  }

  const plan = await prepareRowMatchPlanAsync(
    rdb1.rs.rows,
    rdb2.rs.rows,
    compareKey.names,
    cancelToken,
    ASYNC_YIELD_CHUNK_SIZE
  );
  if (plan.ok === false) {
    result.message = plan.message;
    return result;
  }

  const outcome = await asyncMatchRows(
    rdb1.rs.rows,
    rdb2.rs.rows,
    plan.index2,
    compareKey.names,
    createDiffAnnotationHandlers(result, keynames, supportedKeyNames),
    cancelToken,
    ASYNC_YIELD_CHUNK_SIZE
  );
  if (outcome === "cancelled") {
    result.message = "Cancelled.";
    return result;
  }

  result.ok = true;
  result.rdh1 = rdb1.rs;
  result.rdh2 = rdb2.rs;
  finalizeDiffMessage(result);

  return result;
};

/**
 * rdh1(旧)とrdh2(新)をcompareKeyで突き合わせ、rdh2をrdh1の状態に戻すための
 * UPDATE/INSERT/DELETE相当の操作記述(toBeUpdated/toBeInserted/toBeDeleted)を返す。
 * diffと異なり行へのアノテーション付与は行わない。突合規則(索引・compareKey
 * 比較)はdiff/asyncDiffと共通。引数rdh1/rdh2は変更しない(内部では
 * resolveDiffContextが作るクローンの行に対してのみ値を読み書きする)。
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

  const plan = prepareRowMatchPlan(rdb1.rs.rows, rdb2.rs.rows, compareKey.names);
  if (plan.ok === false) {
    result.message = plan.message;
    return result;
  }

  matchRows(rdb1.rs.rows, rdb2.rs.rows, plan.index2, compareKey.names, {
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
