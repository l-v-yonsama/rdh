import dayjs from "dayjs";
import {
  CodeResolvedAnnotation,
  GeneralColumnType,
  RdhKey,
  RdhRow,
  ResultSetData,
  RuleAnnotation,
  ToStringParam,
} from "../../types";
import { abbr } from "../../utils";
import {
  isBinaryLike,
  isDateTime,
  isDateTimeOrDate,
  isEnumOrSet,
  isJsonLike,
} from "../GeneralColumnUtil";
import { RowHelper } from "../RdhAnnotationHelper";

export const MAX_CELL_VALUE_LENGTH = 50;
export const MAX_PRINT_LINE = 10;
export const EOL = "\n";

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
export abstract class BaseString {
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
