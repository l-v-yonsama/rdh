import type { CellAnnotation } from "./Annonations";
import type { CodeItem } from "./CodeResolverTypes";
import type { CompareKey } from "./CompareKey";
import type { GeneralColumnType } from "./GeneralColumnType";
import type { QueryConditions } from "./QueryConditions";
import type { TableRule } from "./Rules";

export type RdhMeta = {
  connectionName?: string;
  useDatabase?: string;
  schemaName?: string;
  tableName?: string;
  comment?: string;
  compareKeys?: CompareKey[];
  type?: string;
  tableRule?: TableRule;
  ruleViolationSummary?: {
    [ruleName: string]: number;
  };
  codeItems?: CodeItem[];
  editable?: boolean;
  [key: string]: any;
};

export type CsvDelimiter = "," | "\t" | " ";
export type ToStringParam = {
  maxPrintLines?: number;
  maxCellValueLength?: number;
  withType?: boolean;
  withComment?: boolean;
  withRowNo?: boolean;
  withCodeLabel?: boolean;
  withRuleViolation?: boolean;
  keyNames?: string[];
  dateFormat?: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss";
  eol?: "\n" | "\r" | "\r\n";
  binaryToHex?: boolean;
  csv?: {
    delimiter: CsvDelimiter;
  };
};

export type SampleClassPair = {
  clazzValue: any;
  sampleValues: any[];
};

export type SampleGroupByClass = {
  readonly clazzKey: string;
  readonly sampleKeys: string[];
  pairs: SampleClassPair[];
  is_shuffled: boolean;
};

export type MergedCell = {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
};

export type RdhKey = {
  name: string;
  comment: string;
  type: GeneralColumnType;
  width?: number;
  required?: boolean;
  align?: "left" | "center" | "right";
  meta?: {
    is_image?: boolean;
    is_hyperlink?: boolean;
    [key: string]: any;
  };
};

export type RdhRowMeta = { [key: string]: CellAnnotation[] };

export type RdhRow = {
  readonly meta: RdhRowMeta;
  readonly values: { [key: string]: any };
};

export type RdhSummary = {
  info: string;
  elapsedTimeMilli: number;
  selectedRows?: number;
  affectedRows?: number;
  insertId?: number;
  changedRows?: number;
  capacityUnits?: number;
};

export type ResultSetData = {
  readonly created: Date;
  readonly keys: RdhKey[];
  readonly rows: RdhRow[];
  readonly meta: RdhMeta;
  readonly noRecordsReason?: string;
  summary?: RdhSummary;
  queryConditions?: QueryConditions;
  sqlStatement?: string | undefined;
  shuffledIndexes?: number[];
  shuffledNextCounter?: number;
  mergeCells?: MergedCell[];
};

export type DiffResult = {
  ok: boolean;
  message: string;
  deleted: number;
  inserted: number;
  updated: number;
};

export type DiffToUndoChangesResult = {
  ok: boolean;
  message: string;
  toBeDeleted: {
    conditions: { [key: string]: any };
  }[];
  toBeInserted: {
    values: { [key: string]: any };
  }[];
  toBeUpdated: {
    values: { [key: string]: any };
    conditions: { [key: string]: any };
  }[];
};

export const isResultSetData = (item: any): item is ResultSetData =>
  item.created && item.keys && item.rows && item.meta;
