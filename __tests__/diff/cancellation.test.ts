/**
 * asyncDiff()のキャンセル処理に関する回帰テスト。
 */
import { ResultSetDataBuilder, asyncDiff, diff } from "../../src";
import { buildRdb, idValKeys, primaryCompareKey } from "./diffTestSupport";

describe("asyncDiff cancellation", () => {
  /**
   * cancelTokenのisCancellationRequestedを「n回読み取られた後」からtrueに
   * 切り替えるトークンを作る。asyncDiffの実装はcancelTokenを決まった順序
   * (開始直後→クローン後→索引構築中→左側走査中→右側走査中)で読み取る
   * ため、タイマー等に頼らずどの段階でキャンセルされるかを正確に指定できる。
   */
  function cancelAfterChecks(n: number): { isCancellationRequested: boolean } {
    let count = 0;
    return {
      get isCancellationRequested(): boolean {
        count++;
        return count > n;
      },
    };
  }

  const rowCount = 50;

  function buildLargePair(): { rdb1: ResultSetDataBuilder; rdb2: ResultSetDataBuilder } {
    const rows1 = [];
    const rows2 = [];
    for (let i = 0; i < rowCount; i++) {
      rows1.push({ id: i, val: `v${i}` });
      rows2.push({ id: i, val: `v${i}` });
    }
    return {
      rdb1: buildRdb(idValKeys, rows1, [primaryCompareKey]),
      rdb2: buildRdb(idValKeys, rows2, [primaryCompareKey]),
    };
  }

  it("cancels before any work starts", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    const result = await asyncDiff(rdb1.rs, rdb2.rs, { isCancellationRequested: true });
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("cancels while building the rdh1 index", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    const before1 = ResultSetDataBuilder.from(rdb1).build();
    // checks: 1=start, 2=post-clone, 3..(2+rowCount)=rdh1 index build
    const token = cancelAfterChecks(2 + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
    expect(rdb1.rs).toEqual(before1);
  });

  it("cancels while building the rdh2 index", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    // checks 3..(2+rowCount) cover rdh1 index build; pick a check well inside
    // the rdh2 index build range that follows.
    const token = cancelAfterChecks(2 + rowCount + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("cancels while scanning rdh1 rows for matches", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    // checks 3..(2+2*rowCount) cover both index builds; the match scan over
    // rows1 starts right after.
    const token = cancelAfterChecks(2 + 2 * rowCount + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("cancels while scanning rdh2 rows for unmatched inserts", async () => {
    const { rdb1, rdb2 } = buildLargePair();
    // both index builds (2*rowCount checks) + matching rows1 (rowCount checks)
    // happen before the rows2 unmatched-scan begins.
    const token = cancelAfterChecks(2 + 3 * rowCount + Math.floor(rowCount / 2));

    const result = await asyncDiff(rdb1.rs, rdb2.rs, token);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Cancelled.");
  });

  it("agrees with the sync diff() on a randomized dataset", async () => {
    const rows1 = [];
    const rows2 = [];
    for (let i = 0; i < 733; i++) {
      rows1.push({ id: i, val: `v${i}` });
      if (i % 4 !== 0) {
        rows2.push({ id: i, val: i % 7 === 0 ? `v${i}-changed` : `v${i}` });
      }
    }
    rows2.push({ id: 100000, val: "brand-new" });

    const rdbSync1 = buildRdb(idValKeys, rows1, [primaryCompareKey]);
    const rdbSync2 = buildRdb(idValKeys, rows2, [primaryCompareKey]);
    const syncResult = diff(rdbSync1.rs, rdbSync2.rs);

    const rdbAsync1 = buildRdb(idValKeys, rows1, [primaryCompareKey]);
    const rdbAsync2 = buildRdb(idValKeys, rows2, [primaryCompareKey]);
    const asyncResult = await asyncDiff(rdbAsync1.rs, rdbAsync2.rs);

    expect(asyncResult.ok).toBe(syncResult.ok);
    expect(asyncResult.updated).toBe(syncResult.updated);
    expect(asyncResult.inserted).toBe(syncResult.inserted);
    expect(asyncResult.deleted).toBe(syncResult.deleted);
    expect(asyncResult.updatedColumns).toBe(syncResult.updatedColumns);
    expect(asyncResult.message).toBe(syncResult.message);
  });
});
