import { default as listit } from "list-it";
import {
  CodeResolvedAnnotation,
  GeneralColumnType,
  ResultSetData,
  ToStringParam,
} from "../../types";
import { displayGeneralColumnType } from "../GeneralColumnUtil";
import { BaseString } from "./BaseString";
import { NumberedRow, selectPrintableRows } from "./printableRows";

export class PlainString extends BaseString {
  constructor(rdh: ResultSetData, params: ToStringParam) {
    super(rdh, params);
  }

  toString(): string {
    const { maxPrintLines, withType, withComment, withRowNo, eol } =
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
        const label = this.params.withCodeLabel
          ? this.resolveCodeLabel(row, k.name)
          : undefined;
        buf.d(
          this.toShortString(row.values[k.name], {
            keyType: k.type,
            label,
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

    const s = buf.toString();
    return s + eol;
  }

  private toShortString(
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
    return s;
  }
}
