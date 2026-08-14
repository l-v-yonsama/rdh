import { RdhRow } from "../../types";

export type NumberedRow = { row: RdhRow; rowNo: number };

/**
 * 表示対象行を「全件」か「先頭+末尾(省略記号つき)」かに選り分ける。
 * HTML/Markdown/CSV(TabularContentString.toString())とPlainStringの両方が
 * 同じ選別ロジックを個別に持っていたため、ここへ共通化する。
 */
export type PrintableRowsPlan =
  | { truncated: false; rows: NumberedRow[] }
  | { truncated: true; head: NumberedRow[]; tail: NumberedRow[] };

export function selectPrintableRows(
  rows: RdhRow[],
  maxPrintLines: number
): PrintableRowsPlan {
  if (rows.length <= maxPrintLines) {
    return {
      truncated: false,
      rows: rows.map((row, idx) => ({ row, rowNo: idx + 1 })),
    };
  }
  const numOfHead = Math.ceil(maxPrintLines / 2);
  const head = rows
    .slice(0, numOfHead)
    .map((row, idx) => ({ row, rowNo: idx + 1 }));
  const tail = rows
    .slice(rows.length - numOfHead, rows.length)
    .map((row, idx) => ({ row, rowNo: rows.length - numOfHead + idx + 1 }));
  return { truncated: true, head, tail };
}
