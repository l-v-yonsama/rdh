import dayjs from "dayjs";
import { default as listit } from "list-it";
import {
  CodeResolvedAnnotation,
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

abstract class BaseString {
  readonly retList: string[] = [];
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

  toString(): string {
    const { withRowNo, maxPrintLines, eol } = this.params;
    const { rdh } = this;

    if (this.rdhKeys.length < 0) {
      return this.noKeys();
    }

    this.createHeaders();
    this.createPreBody();

    if (rdh.rows.length <= maxPrintLines) {
      rdh.rows.forEach((row, idx) => this.pushRowData(row, idx + 1));
    } else {
      const num_of_head = Math.ceil(maxPrintLines / 2);
      rdh.rows
        .slice(0, num_of_head)
        .forEach((row, idx) => this.pushRowData(row, idx + 1));
      this.pushLine({
        sRow: withRowNo ? "..." : undefined,
        abbrRow: true,
        isHead: false,
      });
      rdh.rows
        .slice(rdh.rows.length - num_of_head, rdh.rows.length)
        .forEach((row, idx) =>
          this.pushRowData(row, rdh.rows.length - num_of_head + idx + 1)
        );
    }

    this.createPostBody();

    return this.retList.join(eol) + eol;
  }

  abstract noKeys(): string;

  abstract createHeaders(): void;
  abstract createPreBody(): void;
  abstract createPostBody(): void;

  abstract pushLine(p: PushLineParams): void;

  abstract pushRowData(row: RdhRow, rowNo: number): void;

  append(s: string): void {
    this.retList.push(s);
  }

  kvToString = (keyType: GeneralColumnType, v: any): string => {
    const { dateFormat, maxCellValueLength, binaryToHex } = this.params;
    let s = "" + v;
    if (isDateTimeOrDate(keyType)) {
      if (isDateTime(keyType)) {
        s = dayjs(v).format("YYYY-MM-DD HH:mm:ss");
      } else {
        s = dayjs(v).format(dateFormat);
      }
    } else if (isBinaryLike(keyType)) {
      if (binaryToHex) {
        if (v instanceof Buffer) {
          s = `B'${v.toString("hex", 0, Math.max(v.byteLength, 64))}`;
        }
      } else {
        s = "(BINARY)";
      }
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

class HtmlString extends BaseString {
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
  }

  noKeys(): string {
    return "<p>No Keys.</p>";
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
      this.append("</deiv>");
      this.append("</blockquote>");
    }
  }

  pushRowData(row: RdhRow, rowNo: number): void {
    const { rdhKeys } = this;
    const { withRowNo, withCodeLabel, withRuleViolation } = this.params;
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
      const label = withCodeLabel
        ? this.resolveCodeLabel(row, key.name)
        : undefined;
      const ruleMarker = withRuleViolation
        ? this.resolveRuleMarkers(row, key.name)
        : undefined;

      let cellUpdatedAnno = undefined;
      if (updated) {
        cellUpdatedAnno = RowHelper.getFirstAnnotationOf<UpdateAnnotation>(
          row,
          key.name,
          "Upd"
        );
      }

      retRow.push({
        clazz: cellUpdatedAnno ? "is-info is-light" : "",
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

class MarkdownString extends BaseString {
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
  }

  noKeys(): string {
    return "No Keys.";
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
    const { withRowNo, withCodeLabel, withRuleViolation } = this.params;
    const retRow = new Array<any>();
    rdhKeys.forEach((key) => {
      const label = withCodeLabel
        ? this.resolveCodeLabel(row, key.name)
        : undefined;
      const ruleMarker = withRuleViolation
        ? this.resolveRuleMarkers(row, key.name)
        : undefined;
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

class CsvString extends BaseString {
  private readonly delimiter: string;
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
    this.delimiter = params.csv?.delimiter ?? ",";
  }

  noKeys(): string {
    return "No Keys.";
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
    const { withRowNo, withCodeLabel, withRuleViolation } = this.params;
    const rowValues: string[] = [];
    if (withRowNo) {
      rowValues.push(`${rowNo}`);
    }
    rdhKeys.forEach((key) => {
      const label = withCodeLabel
        ? this.resolveCodeLabel(row, key.name)
        : undefined;
      const ruleMarker = withRuleViolation
        ? this.resolveRuleMarkers(row, key.name)
        : undefined;
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
    const {
      maxPrintLines,
      withType,
      withComment,
      withRowNo,
      withCodeLabel,
      withRuleViolation,
      eol,
    } = this.params;
    const { rdh, rdhKeys, hasKeyComment } = this;

    if (rdhKeys.length < 0) {
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

    if (rdh.rows.length <= maxPrintLines) {
      rdh.rows.forEach((v, idx) => {
        if (withRowNo) {
          buf.d(idx + 1);
        }
        rdhKeys.forEach((k) => {
          const label = withCodeLabel
            ? this.resolveCodeLabel(v, k.name)
            : undefined;
          const ruleMarker = withRuleViolation
            ? this.resolveRuleMarkers(v, k.name)
            : undefined;
          buf.d(
            this.toShortString(v.values[k.name], {
              keyType: k.type,
              label,
              ruleMarker,
            })
          );
        });
        buf.nl();
      });
    } else {
      const num_of_head = Math.ceil(maxPrintLines / 2);
      rdh.rows.slice(0, num_of_head).forEach((v, idx) => {
        if (withRowNo) {
          buf.d(idx + 1);
        }
        rdhKeys.forEach((k) => {
          const label = withCodeLabel
            ? this.resolveCodeLabel(v, k.name)
            : undefined;
          const ruleMarker = withRuleViolation
            ? this.resolveRuleMarkers(v, k.name)
            : undefined;
          buf.d(
            this.toShortString(v.values[k.name], {
              keyType: k.type,
              label,
              ruleMarker,
            })
          );
        });
        buf.nl();
      });
      if (withRowNo) {
        buf.d("...");
      }
      rdhKeys.forEach(() => {
        buf.d("...");
      });
      buf.nl();
      rdh.rows
        .slice(rdh.rows.length - num_of_head, rdh.rows.length)
        .forEach((v, idx) => {
          if (withRowNo) {
            buf.d(rdh.rows.length - num_of_head + idx + 1);
          }
          rdhKeys.forEach((k) => {
            const label = withCodeLabel
              ? this.resolveCodeLabel(v, k.name)
              : undefined;
            const ruleMarker = withRuleViolation
              ? this.resolveRuleMarkers(v, k.name)
              : undefined;
            buf.d(
              this.toShortString(v.values[k.name], {
                keyType: k.type,
                label,
                ruleMarker,
              })
            );
          });
          buf.nl();
        });
    }
    let s = buf.toString();
    if (rdh.rows.length === 0) {
      s += eol + "No records.";
    }
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

  noKeys(): string {
    throw new Error("Method not implemented.");
  }
  createHeaders(): void {
    throw new Error("Method not implemented.");
  }
  createPreBody(): void {
    throw new Error("Method not implemented.");
  }
  createPostBody(): void {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pushLine(p: PushLineParams): void {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pushRowData(row: RdhRow, rowNo: number): void {
    throw new Error("Method not implemented.");
  }
}
