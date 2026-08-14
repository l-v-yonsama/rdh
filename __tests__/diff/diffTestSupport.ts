/**
 * diff() / asyncDiff() / diffToUndoChanges() の行突合ロジックに関する回帰テスト
 * (__tests__/diff/*.test.ts)が共有するfixture生成・adapter・独立参照実装。
 *
 * 各テスト仕様に固有の期待値や、テスト名から挙動を判断するために必要な
 * 小さな入力データはここへは置かず、各specファイル側に残す。
 */
import {
  CompareKey,
  DiffResult,
  DiffToUndoChangesResult,
  GeneralColumnType,
  RdhKey,
  RdhRow,
  ResultSetData,
  ResultSetDataBuilder,
  asyncDiff,
  createRdhKey,
  diff,
  diffToUndoChanges,
} from "../../src";

// ---------------------------------------------------------------------------
// RDH fixture生成
// ---------------------------------------------------------------------------

export const idValKeys: RdhKey[] = [
  createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
  createRdhKey({ name: "val", type: GeneralColumnType.TEXT }),
];

export const primaryCompareKey: CompareKey = { kind: "primary", names: ["id"] };

export function buildRdb(
  keys: RdhKey[],
  rows: Record<string, any>[],
  compareKeys: CompareKey[]
): ResultSetDataBuilder {
  const rdb = new ResultSetDataBuilder(keys);
  rows.forEach((row) => rdb.addRow(row));
  rdb.updateMeta({ compareKeys });
  return rdb;
}

export function findRow(rdh: ResultSetData, id: number): RdhRow {
  const row = rdh.rows.find((r) => r.values.id === id);
  if (!row) {
    throw new Error(`row not found: id=${id}`);
  }
  return row;
}

// ---------------------------------------------------------------------------
// diff／asyncDiff／diffToUndoChanges共通adapter
// ---------------------------------------------------------------------------

export type Counts = { updated: number; inserted: number; deleted: number };

export function normalizeCounts(
  fnName: string,
  result: DiffResult | DiffToUndoChangesResult
): Counts {
  if (fnName === "diffToUndoChanges") {
    // diffToUndoChangesはrdh2をrdh1へ戻す操作を返すため、意味が反転する:
    // - rdh1にしかない行(diffでいう"deleted") -> 復元のためtoBeInsertedに入る
    // - rdh2にしかない行(diffでいう"inserted") -> 取り消しのためtoBeDeletedに入る
    const r = result as DiffToUndoChangesResult;
    return {
      updated: r.toBeUpdated.length,
      inserted: r.toBeDeleted.length,
      deleted: r.toBeInserted.length,
    };
  }
  const r = result as DiffResult;
  return { updated: r.updated, inserted: r.inserted, deleted: r.deleted };
}

/** diff/asyncDiff/diffToUndoChangesを同一シグネチャで呼べるようにしたもの。 */
export const runners: [
  string,
  (a: ResultSetData, b: ResultSetData) => Promise<DiffResult | DiffToUndoChangesResult> | (DiffResult | DiffToUndoChangesResult),
][] = [
  ["diff", (a, b) => diff(a, b)],
  ["asyncDiff", (a, b) => asyncDiff(a, b)],
  ["diffToUndoChanges", (a, b) => diffToUndoChanges(a, b)],
];

// ---------------------------------------------------------------------------
// random data helper
// ---------------------------------------------------------------------------

/** 決定的な擬似乱数生成器(mulberry32)。同じseedなら常に同じ列を生成する。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type RandomRow = { id: number; val: string };

export function buildRandomScenario(
  n: number,
  rnd: () => number
): { rows1: RandomRow[]; rows2: RandomRow[] } {
  const rows1: RandomRow[] = [];
  const rows2: RandomRow[] = [];
  for (let id = 0; id < n; id++) {
    const r = rnd();
    const val1 = `v${id}-orig`;
    if (r < 0.55) {
      // unchanged
      rows1.push({ id, val: val1 });
      rows2.push({ id, val: val1 });
    } else if (r < 0.75) {
      // updated
      rows1.push({ id, val: val1 });
      rows2.push({ id, val: `v${id}-changed-${Math.floor(rnd() * 1000)}` });
    } else if (r < 0.88) {
      // deleted (rdh1のみ)
      rows1.push({ id, val: val1 });
    } else {
      // inserted (rdh2のみ)
      rows2.push({ id, val: `v${id}-new` });
    }
  }
  return { rows1, rows2 };
}

// ---------------------------------------------------------------------------
// 独立参照実装
// ---------------------------------------------------------------------------

/** rows1/rows2から独立に計算した「素朴な」期待値(本番実装は一切使わない)。 */
export function referenceDiffCounts(
  rows1: RandomRow[],
  rows2: RandomRow[]
): Counts {
  const map1 = new Map(rows1.map((r) => [r.id, r.val]));
  const map2 = new Map(rows2.map((r) => [r.id, r.val]));
  let updated = 0;
  let deleted = 0;
  let inserted = 0;
  for (const [id, val1] of map1) {
    if (!map2.has(id)) {
      deleted++;
    } else if (map2.get(id) !== val1) {
      updated++;
    }
  }
  for (const id of map2.keys()) {
    if (!map1.has(id)) {
      inserted++;
    }
  }
  return { updated, deleted, inserted };
}
