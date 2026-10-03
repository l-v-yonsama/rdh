import {
  CodeResolvedAnnotation,
  GeneralColumnType,
  RdhRow,
  ResultSetData,
  ToStringParam,
} from "../../types";
import { displayGeneralColumnType } from "../GeneralColumnUtil";
import { PushLineParams, TabularContentString } from "./TabularContentString";

export class CsvString extends TabularContentString {
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  createPostBody(): void {}

  pushRowData(row: RdhRow, rowNo: number): void {
    const { rdhKeys, delimiter } = this;
    const { withRowNo } = this.params;
    const rowValues: string[] = [];
    if (withRowNo) {
      rowValues.push(`${rowNo}`);
    }
    rdhKeys.forEach((key) => {
      const label = this.params.withCodeLabel
        ? this.resolveCodeLabel(row, key.name)
        : undefined;
      rowValues.push(
        this.toCsvString(row.values[key.name], {
          keyType: key.type,
          label,
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
    s = `"${s.replace(/"/g, '""')}"`;
    return s;
  }
}
