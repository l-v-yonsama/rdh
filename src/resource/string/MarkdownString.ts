import {
  CodeResolvedAnnotation,
  GeneralColumnType,
  RdhRow,
  ResultSetData,
  ToStringParam,
} from "../../types";
import { displayGeneralColumnType } from "../GeneralColumnUtil";
import { PushLineParams, TabularContentString } from "./TabularContentString";

export class MarkdownString extends TabularContentString {
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
