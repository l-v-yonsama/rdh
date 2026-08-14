import { RdhRow } from "../../types";
import { BaseString } from "./BaseString";
import { selectPrintableRows } from "./printableRows";

export type PushLineParams = {
  sRow: string | undefined;
  elms?: (string | { s: string; clazz: string })[];
  isHead?: boolean;
  rowClass?: string;
  rawString?: string;
  abbrRow?: boolean;
};

/**
 * 行を1行ずつ完成した文字列としてretListへappendしていく形式(HTML/Markdown/
 * CSV)が共有するtemplate method。noKeys/noRecords/createHeaders/
 * createPreBody/createPostBody/pushLine/pushRowDataをサブクラスが実装する。
 */
export abstract class TabularContentString extends BaseString {
  readonly retList: string[] = [];

  abstract noKeys(): string;
  abstract noRecords(): string;

  abstract createHeaders(): void;
  abstract createPreBody(): void;
  abstract createPostBody(): void;

  abstract pushLine(p: PushLineParams): void;

  abstract pushRowData(row: RdhRow, rowNo: number): void;

  append(s: string): void {
    this.retList.push(s);
  }

  toString(): string {
    const { withRowNo, maxPrintLines, eol } = this.params;
    const { rdh } = this;

    // 行が0件の場合はnoRecordsReason("No records..."等)を優先する。
    // ResultSetDataBuilder.createEmpty()はkeysもrowsも0件で作られるため、
    // 順序を逆にすると常に「行がない」ケースまで「列がない」表示に
    // なってしまう。「列がない」は、行データはあるのにkeyNames絞り込み等で
    // 表示対象の列が0件になった場合にのみ意味を持つ。
    if (rdh.rows.length === 0) {
      return this.noRecords();
    }

    if (this.rdhKeys.length === 0) {
      return this.noKeys();
    }

    this.createHeaders();
    this.createPreBody();

    const plan = selectPrintableRows(rdh.rows, maxPrintLines);
    if (plan.truncated === false) {
      plan.rows.forEach(({ row, rowNo }) => this.pushRowData(row, rowNo));
    } else {
      plan.head.forEach(({ row, rowNo }) => this.pushRowData(row, rowNo));
      this.pushLine({
        sRow: withRowNo ? "..." : undefined,
        abbrRow: true,
        isHead: false,
      });
      plan.tail.forEach(({ row, rowNo }) => this.pushRowData(row, rowNo));
    }

    this.createPostBody();

    return this.retList.join(eol) + eol;
  }
}
