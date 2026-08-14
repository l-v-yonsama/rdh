import {
  CodeResolvedAnnotation,
  ErrorAnnotation,
  GeneralColumnType,
  RdhRow,
  ResultSetData,
  ToStringParam,
  UpdateAnnotation,
} from "../../types";
import { escapeHtml } from "../../utils";
import { displayGeneralColumnType } from "../GeneralColumnUtil";
import { RowHelper } from "../RdhAnnotationHelper";
import { PushLineParams, TabularContentString } from "./TabularContentString";

export class HtmlString extends TabularContentString {
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
