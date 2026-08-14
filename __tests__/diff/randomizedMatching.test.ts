/**
 * ランダム化・性質テスト。独立に実装した参照実装(referenceDiffCounts)との
 * 突き合わせと、行順序に依存しないこと(shuffle invariance)を検証する。
 */
import { DiffResult, asyncDiff, diff } from "../../src";
import {
  Counts,
  buildRandomScenario,
  buildRdb,
  idValKeys,
  mulberry32,
  primaryCompareKey,
  referenceDiffCounts,
  shuffle,
} from "./diffTestSupport";

describe("randomized matching against an independent reference implementation", () => {
  const seeds = [1, 2, 3, 4, 5];

  it.each(seeds)("matches a Map-based reference implementation (seed=%i)", async (seed) => {
    const rnd = mulberry32(seed);
    const { rows1, rows2 } = buildRandomScenario(300, rnd);
    const expected = referenceDiffCounts(rows1, rows2);

    const rdb1 = buildRdb(idValKeys, shuffle(rows1, rnd), [primaryCompareKey]);
    const rdb2 = buildRdb(idValKeys, shuffle(rows2, rnd), [primaryCompareKey]);

    const syncResult = diff(rdb1.rs, rdb2.rs);
    expect(syncResult.ok).toBe(true);
    expect({
      updated: syncResult.updated,
      inserted: syncResult.inserted,
      deleted: syncResult.deleted,
    }).toEqual(expected);

    const asyncResult = await asyncDiff(rdb1.rs, rdb2.rs);
    expect({
      updated: asyncResult.updated,
      inserted: asyncResult.inserted,
      deleted: asyncResult.deleted,
    }).toEqual(expected);
  });

  it("produces the same result regardless of row order (shuffle invariance)", () => {
    const rnd = mulberry32(42);
    const { rows1, rows2 } = buildRandomScenario(200, rnd);
    const expected = referenceDiffCounts(rows1, rows2);

    const unshuffled = diff(
      buildRdb(idValKeys, rows1, [primaryCompareKey]).rs,
      buildRdb(idValKeys, rows2, [primaryCompareKey]).rs
    );
    const shuffled = diff(
      buildRdb(idValKeys, shuffle(rows1, rnd), [primaryCompareKey]).rs,
      buildRdb(idValKeys, shuffle(rows2, rnd), [primaryCompareKey]).rs
    );

    const pick = (r: DiffResult): Counts => ({
      updated: r.updated,
      inserted: r.inserted,
      deleted: r.deleted,
    });
    expect(pick(unshuffled)).toEqual(expected);
    expect(pick(shuffled)).toEqual(expected);
  });
});
