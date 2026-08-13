import dayjs from "dayjs";
import { default as listit } from "list-it";
import {
  CodeResolvedAnnotation,
  ErrorAnnotation,
  GeneralColumnType,
  RdhKey,
  RdhRow,
  ResultSetData,
  RuleAnnotation,
  ToStringParam,
  UpdateAnnotation,
} from "../types";
import { abbr, escapeHtml } from "../utils";
import {
  displayGeneralColumnType,
  isBinaryLike,
  isDateTime,
  isDateTimeOrDate,
  isEnumOrSet,
  isJsonLike,
} from "./GeneralColumnUtil";
import { RowHelper } from "./ResultSetDataBuilder";

type ContentType = "plain" | "html" | "markdown" | "csv";

type PushLineParams = {
  sRow: string | undefined;
  elms?: (string | { s: string; clazz: string })[];
  isHead?: boolean;
  rowClass?: string;
  rawString?: string;
  abbrRow?: boolean;
};

const MAX_CELL_VALUE_LENGTH = 50;
const MAX_PRINT_LINE = 10;
const EOL = "\n";

type NumberedRow = { row: RdhRow; rowNo: number };

/**
 * 表示対象行を「全件」か「先頭+末尾(省略記号つき)」かに選り分ける。
 * HTML/Markdown/CSV(TabularContentString.toString())とPlainStringの両方が
 * 同じ選別ロジックを個別に持っていたため、ここへ共通化する。
 */
type PrintableRowsPlan =
  | { truncated: false; rows: NumberedRow[] }
  | { truncated: true; head: NumberedRow[]; tail: NumberedRow[] };

function selectPrintableRows(
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

export const toContentString = (
  rdh: ResultSetData,
  contentType: ContentType,
  params?: ToStringParam
): string => {
  switch (contentType) {
    case "plain":
      return new PlainString(rdh, params).toString();
    case "html":
      return new HtmlString(rdh, params).toString();
    case "markdown":
      return new MarkdownString(rdh, params).toString();
    case "csv":
      return new CsvString(rdh, params).toString();
  }
};

/**
 * 4フォーマット(HTML/Markdown/CSV/Plain)すべてが共有する部分。
 *
 * PlainStringはlist-itというテーブル整形ライブラリの都合上、行を1本ずつ
 * 完成した文字列としてappendしていく他3フォーマットのtoString()テンプレート
 * メソッド(TabularContentString.toString())には乗らない(list-itは全行を
 * バッファへ溜めてから列幅を揃えて一括描画するため)。そのためBaseStringは
 * 「全フォーマット共通のヘルパー」だけを持ち、head/tail描画のtemplate
 * methodはTabularContentStringへ切り出す。PlainStringはBaseStringを
 * 直接継承し、使わない抽象メソッドを「呼ばれたら例外」で埋める必要がない。
 */
abstract class BaseString {
  readonly rdhKeys: RdhKey[];
  readonly hasKeyComment: boolean;
  readonly params: ToStringParam;

  constructor(protected readonly rdh: ResultSetData, params: ToStringParam) {
    this.params = {
      ...this.initToStringParam(),
      ...params,
    };
    this.rdhKeys =
      this.params.keyNames.length > 0
        ? this.rdh.keys.filter((k) => this.params.keyNames.includes(k.name))
        : this.rdh.keys;
    this.hasKeyComment = this.rdhKeys.some((k) => !!k.comment);
  }

  /**
   * withCodeLabel/withRuleViolationの設定を踏まえて、1セル分のコード
   * ラベル・ルール違反マーカーをまとめて取得する。各フォーマットの行描画
   * (pushRowData/PlainString.toString())で同じ2行(label取得・ruleMarker
   * 取得)が重複していたため、ここへ共通化する。
   */
  protected resolveCellDecorations(
    row: RdhRow,
    keyName: string
  ): {
    label: CodeResolvedAnnotation["values"] | undefined;
    ruleMarker: string | undefined;
  } {
    const { withCodeLabel, withRuleViolation } = this.params;
    return {
      label: withCodeLabel ? this.resolveCodeLabel(row, keyName) : undefined,
      ruleMarker: withRuleViolation
        ? this.resolveRuleMarkers(row, keyName)
        : undefined,
    };
  }

  /** バイナリを16進文字列へ変換する際に読む最大バイト数。 */
  static readonly MAX_BINARY_HEX_BYTES = 64;

  toHexString = (v: any): string => {
    // Math.max(byteLength, 64)だと64バイト超の入力では上限が機能せず
    // (endが常にbyteLength自身になる)、全バイトを変換してしまう。
    // Math.minで実際に64バイトまでに制限する。
    if (v instanceof Buffer) {
      return `B'${v.toString(
        "hex",
        0,
        Math.min(v.byteLength, BaseString.MAX_BINARY_HEX_BYTES)
      )}`;
    } else if (v instanceof Uint8Array) {
      return `B'${Buffer.from(v).toString(
        "hex",
        0,
        Math.min(v.byteLength, BaseString.MAX_BINARY_HEX_BYTES)
      )}`;
    }
    return "(BINARY)";
  };

  kvToString = (keyType: GeneralColumnType, v: any): string => {
    const { dateFormat, timestampFormat, maxCellValueLength, binaryToHex } =
      this.params;
    let s = "" + v;
    if (isDateTimeOrDate(keyType)) {
      if (isDateTime(keyType)) {
        if (timestampFormat) {
          s = dayjs(v).format(timestampFormat);
        } else {
          s = dayjs(v).format("YYYY-MM-DD HH:mm:ss");
        }
      } else {
        s = dayjs(v).format(dateFormat);
      }
    } else if (keyType === GeneralColumnType.BINARY_SET) {
      // DynamoDBのBS型をここで処理したいので、isEnumOrSetのケースよりも優先する
      if (binaryToHex) {
        try {
          if (v && v instanceof Set) {
            const first = v.values().next().value;
            s = this.toHexString(first);
          }
          // eslint-disable-next-line no-empty
        } catch (_) {}
      } else {
        s = "([BINARY, ...])";
      }
    } else if (isBinaryLike(keyType)) {
      if (binaryToHex) {
        s = this.toHexString(v);
      } else {
        s = "(BINARY)";
      }
    } else if (isEnumOrSet(keyType)) {
      try {
        if (v) {
          if (v instanceof Set) {
            s = JSON.stringify([...v]);
          }
        }
        // eslint-disable-next-line no-empty
      } catch (_) {}
    } else if (isJsonLike(keyType)) {
      try {
        if (typeof v === "object" || Array.isArray(v)) {
          s = JSON.stringify(v);
        }
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    return abbr(s, maxCellValueLength);
  };

  resolveCodeLabel(
    row: RdhRow,
    keyName: string
  ): CodeResolvedAnnotation["values"] {
    return RowHelper.getFirstAnnotationOf<CodeResolvedAnnotation>(
      row,
      keyName,
      "Cod"
    )?.values;
  }

  resolveRuleMarkers(row: RdhRow, keyName: string): string | undefined {
    const { ruleViolationSummary } = this.rdh.meta;
    if (ruleViolationSummary === undefined) {
      return undefined;
    }
    const rules = RowHelper.filterAnnotationByKeyOf<RuleAnnotation>(
      row,
      keyName,
      "Rul"
    );
    const marks: number[] = [];
    const names = Object.keys(ruleViolationSummary);
    names.forEach((it, idx) => {
      if (rules.some((rule) => rule.values.name === it)) {
        marks.push(idx + 1);
      }
    });
    return marks.length > 0 ? `*${marks.join(",")}` : undefined;
  }
  createRuleMarkerLegend(eol: "\n" | "\r" | "\r\n" = EOL): string | undefined {
    const { ruleViolationSummary } = this.rdh.meta;
    if (ruleViolationSummary === undefined) {
      return undefined;
    }
    return Object.keys(ruleViolationSummary)
      .map(
        (ruleName, idx) =>
          `*${idx + 1}: ${ruleName}: ${ruleViolationSummary[ruleName]}`
      )
      .join(eol);
  }
  private initToStringParam(): ToStringParam {
    return {
      maxPrintLines: MAX_PRINT_LINE,
      maxCellValueLength: MAX_CELL_VALUE_LENGTH,
      withType: false,
      withComment: false,
      withRowNo: false,
      withCodeLabel: false,
      withRuleViolation: false,
      eol: EOL,
      keyNames: [],
      dateFormat: "YYYY-MM-DD",
      binaryToHex: false,
    };
  }
}

/**
 * 行を1行ずつ完成した文字列としてretListへappendしていく形式(HTML/Markdown/
 * CSV)が共有するtemplate method。noKeys/noRecords/createHeaders/
 * createPreBody/createPostBody/pushLine/pushRowDataをサブクラスが実装する。
 */
abstract class TabularContentString extends BaseString {
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

class HtmlString extends TabularContentString {
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
  }

  noKeys(): string {
    return "<p>No Keys.</p>";
  }
  noRecords(): string {
    return `<p>${this.rdh.noRecordsReason ?? "No Records."}</p>`;
  }
  createHeaders(): void {
    const { rdhKeys } = this;
    const { withType, withComment, withRowNo } = this.params;

    this.append('<div class="table-container">');
    this.append(
      '<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">'
    );
    this.append("<thead>");
    this.pushLine({
      sRow: withRowNo ? "ROW" : undefined,
      elms: rdhKeys.map((k) => this.toHtmlString(k.name)),
      isHead: true,
    });

    if (withComment && this.hasKeyComment) {
      this.pushLine({
        sRow: withRowNo ? "" : undefined,
        elms: rdhKeys.map((k) => this.toHtmlString(k.comment ?? "")),
        isHead: true,
      });
    }
    if (withType) {
      this.pushLine({
        sRow: withRowNo ? "" : undefined,
        elms: rdhKeys.map((k) =>
          this.toHtmlString(displayGeneralColumnType(k.type))
        ),
        isHead: true,
      });
    }

    this.append("</thead>");
  }
  createPreBody(): void {
    this.append("<tbody>");
  }
  createPostBody(): void {
    const { rdh } = this;
    const { withRuleViolation } = this.params;

    this.append("</tbody>");
    this.append("</table>");
    this.append("</div>");
    if (withRuleViolation && rdh.meta?.ruleViolationSummary) {
      this.append("<blockquote>");
      this.append('<div class="content is-small">');
      this.append("<ul>");
      const { ruleViolationSummary } = rdh.meta;
      Object.keys(ruleViolationSummary).forEach((ruleName, idx) => {
        this.append(
          `<li>*${idx + 1}: ${this.toHtmlString(ruleName)}: ${this.toHtmlString(
            ruleViolationSummary[ruleName]
          )}</li>`
        );
      });
      this.append("</ul>");
      this.append("</div>");
      this.append("</blockquote>");
    }
  }

  pushRowData(row: RdhRow, rowNo: number): void {
    const { rdhKeys } = this;
    const { withRowNo } = this.params;
    let rowClass = "";
    const inserted = RowHelper.hasAnnotation(row, "Add");
    let removed = false;
    let updated = false;
    if (inserted) {
      rowClass = "is-primary is-light";
    } else {
      removed = RowHelper.hasAnnotation(row, "Del");
      if (removed) {
        rowClass = "is-danger is-light";
      }
    }
    if (!inserted && !removed) {
      updated = RowHelper.hasAnnotation(row, "Upd");
    }

    const retRow = new Array<any>();
    rdhKeys.forEach((key) => {
      const { label, ruleMarker } = this.resolveCellDecorations(row, key.name);

      let clazz = "";
      if (updated) {
        const cellUpdatedAnno =
          RowHelper.getFirstAnnotationOf<UpdateAnnotation>(
            row,
            key.name,
            "Upd"
          );
        if (cellUpdatedAnno) {
          clazz = "is-info is-light";
        }
      } else if (
        RowHelper.getFirstAnnotationOf<ErrorAnnotation>(row, key.name, "Err")
      ) {
        clazz = "is-danger is-light";
      }

      retRow.push({
        clazz,
        s: this.toHtmlString(row.values[key.name], {
          keyType: key.type,
          label,
          ruleMarker,
        }),
      });
    });
    this.pushLine({
      sRow: withRowNo ? `${rowNo}` : undefined,
      elms: retRow,
      isHead: false,
      rowClass,
    });
  }

  pushLine(p: PushLineParams): void {
    const { isHead, sRow, elms, rowClass, abbrRow } = p;
    const { rdhKeys } = this;

    const tag = isHead ? "th" : "td";
    const rowValues: string[] = [];
    if (sRow !== undefined) {
      rowValues.push(`<${tag}>${sRow}</${tag}>`);
    }
    if (abbrRow) {
      rdhKeys.forEach((_) => {
        rowValues.push(`<${tag}>...</${tag}>`);
      });
    } else {
      elms.forEach((it) => {
        if (typeof it === "string") {
          rowValues.push(`<${tag}>${it}</${tag}>`);
        } else {
          rowValues.push(`<${tag} class="${it.clazz}">${it.s}</${tag}>`);
        }
      });
    }
    this.append(`  <tr class="${rowClass ?? ""}">${rowValues.join("")}</tr>`);
  }

  private toHtmlString(
    o: any,
    opt?: {
      keyType?: GeneralColumnType;
      label?: CodeResolvedAnnotation["values"];
      ruleMarker?: string;
    }
  ): string {
    let s;
    if (o === null || o === undefined) {
      s = '<span class="tag is-light">NULL</span>';
    } else {
      s = this.kvToString(opt?.keyType, o);
      s = escapeHtml(s);
      if (opt?.label) {
        if (opt.label.isUndefined) {
          s += ` <span class="tag is-danger is-light">${escapeHtml(
            opt.label.label
          )}</span>`;
        } else {
          s += ` <span class="tag is-info is-light">${escapeHtml(
            opt.label.label
          )}</span>`;
        }
      }
    }
    if (opt?.ruleMarker) {
      s = `<span class="tag is-info is-light">${escapeHtml(
        opt.ruleMarker
      )}</span> <span class="tag is-success is-light">${escapeHtml(s)}</span>`;
    }
    return s;
  }
}

class MarkdownString extends TabularContentString {
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
  }

  noKeys(): string {
    return "No Keys.";
  }
  noRecords(): string {
    return this.rdh.noRecordsReason ?? "No Records.";
  }

  createHeaders(): void {
    const { rdhKeys, hasKeyComment } = this;
    const { withType, withComment, withRowNo } = this.params;

    this.pushLine({
      sRow: withRowNo ? "ROW" : undefined,
      rawString: rdhKeys.map((k) => this.toMarkdownString(k.name)).join(" | "),
    });
    this.pushLine({
      sRow: withRowNo ? "---:" : undefined,
      rawString: rdhKeys
        .map((key) => {
          const align = key.align ?? "center";
          switch (align) {
            case "left":
              return ":---";
            case "center":
              return ":---:";
            case "right":
              return "---:";
          }
        })
        .join(" | "),
    });
    if (withComment && hasKeyComment) {
      this.pushLine({
        sRow: withRowNo ? "" : undefined,
        rawString: rdhKeys
          .map((k) => this.toMarkdownString(k.comment ?? ""))
          .join(" | "),
      });
    }
    if (withType) {
      this.pushLine({
        sRow: withRowNo ? "" : undefined,
        rawString: rdhKeys
          .map((k) => this.toMarkdownString(displayGeneralColumnType(k.type)))
          .join(" | "),
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  createPreBody(): void {}
  createPostBody(): void {
    const { withRuleViolation, eol } = this.params;
    if (withRuleViolation) {
      const legend = this.createRuleMarkerLegend(eol);
      if (legend) {
        this.append(eol + "```" + eol + legend + eol + "```");
      }
    }
  }

  pushRowData(row: RdhRow, rowNo: number): void {
    const { rdhKeys } = this;
    const { withRowNo } = this.params;
    const retRow = new Array<any>();
    rdhKeys.forEach((key) => {
      const { label, ruleMarker } = this.resolveCellDecorations(row, key.name);

      retRow.push(
        this.toMarkdownString(row.values[key.name], {
          keyType: key.type,
          label,
          ruleMarker,
        })
      );
    });
    this.pushLine({
      sRow: withRowNo ? `${rowNo}` : undefined,
      rawString: retRow.join(" | "),
    });
  }

  pushLine(p: PushLineParams): void {
    const { sRow, rawString: s, abbrRow } = p;
    const { rdhKeys } = this;

    const appendStr = abbrRow ? rdhKeys.map((_) => "...").join(" | ") : s;

    if (sRow === undefined) {
      this.append(`| ${appendStr} |`);
    } else {
      this.append(`| ${sRow} | ${appendStr} |`);
    }
  }

  private toMarkdownString(
    o: any,
    opt?: {
      keyType?: GeneralColumnType;
      label?: CodeResolvedAnnotation["values"];
      ruleMarker?: string;
    }
  ): string {
    let s;
    if (o === null || o === undefined) {
      s = "`NULL`";
    } else {
      s = this.kvToString(opt?.keyType, o);
      if (opt?.label) {
        if (opt.label.isUndefined) {
          s += ` <\`${opt.label.label}\`>`;
        } else {
          s += ` <${opt.label.label}>`;
        }
      }
    }
    if (opt?.ruleMarker) {
      s = `\`${opt.ruleMarker}\` ${s}`;
    }
    s = `${s
      .replace(/ {2}/g, "&emsp;")
      .replace(/\|/g, "&#124;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(\r?\n)/g, "<br>")}`;
    return s;
  }
}

class CsvString extends TabularContentString {
  private readonly delimiter: string;
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
    this.delimiter = params?.csv?.delimiter ?? ",";
  }

  noKeys(): string {
    return "No Keys.";
  }
  noRecords(): string {
    return this.rdh.noRecordsReason ?? "No Records.";
  }

  createHeaders(): void {
    const { rdhKeys, hasKeyComment, delimiter } = this;
    const { withType, withComment, withRowNo } = this.params;

    this.pushLine({
      sRow: withRowNo ? '"ROW"' : undefined,
      rawString: rdhKeys.map((k) => this.toCsvString(k.name)).join(delimiter),
    });
    if (withComment && hasKeyComment) {
      this.pushLine({
        sRow: withRowNo ? "" : undefined,
        rawString: rdhKeys
          .map((k) => this.toCsvString(k.comment ?? ""))
          .join(delimiter),
      });
    }
    if (withType) {
      this.pushLine({
        sRow: withRowNo ? "" : undefined,
        rawString: rdhKeys
          .map((k) => this.toCsvString(displayGeneralColumnType(k.type)))
          .join(delimiter),
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  createPreBody(): void {}
  createPostBody(): void {
    const { withRuleViolation, eol } = this.params;
    if (withRuleViolation) {
      const legend = this.createRuleMarkerLegend(eol);
      if (legend) {
        this.append(eol + "```" + eol + legend + eol + "```");
      }
    }
  }

  pushRowData(row: RdhRow, rowNo: number): void {
    const { rdhKeys, delimiter } = this;
    const { withRowNo } = this.params;
    const rowValues: string[] = [];
    if (withRowNo) {
      rowValues.push(`${rowNo}`);
    }
    rdhKeys.forEach((key) => {
      const { label, ruleMarker } = this.resolveCellDecorations(row, key.name);
      rowValues.push(
        this.toCsvString(row.values[key.name], {
          keyType: key.type,
          label,
          ruleMarker,
        })
      );
    });
    this.append(rowValues.join(delimiter));
  }

  pushLine(p: PushLineParams): void {
    const { rdhKeys, delimiter } = this;
    const { sRow, rawString: s, abbrRow } = p;

    const appendStr = abbrRow ? rdhKeys.map((_) => "...").join(delimiter) : s;

    if (sRow === undefined) {
      this.append(appendStr);
    } else {
      this.append(`${sRow}${delimiter}${appendStr}`);
    }
  }

  private toCsvString(
    o: any,
    opt?: {
      keyType?: GeneralColumnType;
      label?: CodeResolvedAnnotation["values"];
      ruleMarker?: string;
    }
  ): string {
    let s;
    if (o === null || o === undefined) {
      s = "";
    } else {
      s = this.kvToString(opt?.keyType, o);
      if (opt?.label) {
        s += ` <${opt.label.label}>`;
      }
    }
    if (opt?.ruleMarker) {
      s = `${opt.ruleMarker} ${s}`;
    }
    s = `"${s.replace(/"/g, '""')}"`;
    return s;
  }
}

class PlainString extends BaseString {
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
  }

  toString(): string {
    const { maxPrintLines, withType, withComment, withRowNo, withRuleViolation, eol } =
      this.params;
    const { rdh, rdhKeys, hasKeyComment } = this;

    // TabularContentString.toString()と同じ理由でrowsの有無を先に判定する。
    if (rdh.rows.length === 0) {
      return this.rdh.noRecordsReason ?? "No Records.";
    }
    if (rdhKeys.length === 0) {
      return "No Keys.";
    }

    const buf = listit.buffer();
    if (withRowNo) {
      buf.d("ROW");
    }
    rdhKeys.forEach((k) => buf.d(k.name));
    buf.nl();
    if (withComment && hasKeyComment) {
      if (withRowNo) {
        buf.d("");
      }
      rdhKeys.forEach((k) => buf.d(this.toShortString(k.comment) ?? ""));
      buf.nl();
    }
    if (withType) {
      if (withRowNo) {
        buf.d(displayGeneralColumnType(GeneralColumnType.INTEGER));
      }
      rdhKeys.forEach((k) => {
        buf.d(displayGeneralColumnType(k.type));
      });
      buf.nl();
    }

    const pushDataRow = ({ row, rowNo }: NumberedRow): void => {
      if (withRowNo) {
        buf.d(rowNo);
      }
      rdhKeys.forEach((k) => {
        const { label, ruleMarker } = this.resolveCellDecorations(row, k.name);
        buf.d(
          this.toShortString(row.values[k.name], {
            keyType: k.type,
            label,
            ruleMarker,
          })
        );
      });
      buf.nl();
    };

    const plan = selectPrintableRows(rdh.rows, maxPrintLines);
    if (plan.truncated === false) {
      plan.rows.forEach(pushDataRow);
    } else {
      plan.head.forEach(pushDataRow);
      if (withRowNo) {
        buf.d("...");
      }
      rdhKeys.forEach(() => {
        buf.d("...");
      });
      buf.nl();
      plan.tail.forEach(pushDataRow);
    }

    let s = buf.toString();
    if (withRuleViolation) {
      const legend = this.createRuleMarkerLegend(eol);
      if (legend) {
        s += eol + eol + legend;
      }
    }
    return s + eol;
  }

  private toShortString(
    o: any,
    opt?: {
      keyType?: GeneralColumnType;
      label?: CodeResolvedAnnotation["values"];
      ruleMarker?: string;
    }
  ): string {
    let s;
    if (o === null || o === undefined) {
      s = "";
    } else {
      s = this.kvToString(opt?.keyType, o);
      if (opt?.label) {
        s += ` <${opt.label.label}>`;
      }
    }
    if (opt?.ruleMarker) {
      s = `${opt.ruleMarker} ${s}`;
    }
    return s;
  }
}
