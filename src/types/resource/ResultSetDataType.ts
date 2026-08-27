import type { CellAnnotation } from "./Annonations";
import type { CodeItem } from "./CodeResolverTypes";
import type { CompareKey } from "./CompareKey";
import type { GeneralColumnType } from "./GeneralColumnType";
import type { QueryConditions } from "./QueryConditions";
import type { TableRule } from "./Rules";
import { isRecord } from "../../utils/base";

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
  timestampFormat?:
    | "YYYY-MM-DD"
    | "YYYY-MM-DD HH:mm:ss"
    | "YYYY-MM-DD HH:mm:ss.SSS"
    | "YYYY-MM-DDTHH:mm:ss.SSSZ";
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

// Per-scope DynamoDB Capacity Unit amounts, as reported by
// ConsumedCapacity.Table / .LocalSecondaryIndexes / .GlobalSecondaryIndexes.
export type RdhDynamoDbCapacityAmount = {
  capacityUnits?: number;
  readCapacityUnits?: number;
  writeCapacityUnits?: number;
};

// Consumed Capacity breakdown for one DynamoDB Query/Scan/ExecuteStatement
// execution (possibly across multiple paginated responses, already summed).
export type RdhDynamoDbConsumedCapacity = {
  totalCapacityUnits?: number;
  totalReadCapacityUnits?: number;
  totalWriteCapacityUnits?: number;
  table?: RdhDynamoDbCapacityAmount;
  localSecondaryIndexes?: Record<string, RdhDynamoDbCapacityAmount>;
  globalSecondaryIndexes?: Record<string, RdhDynamoDbCapacityAmount>;
};

// DynamoDB-specific execution evidence for one Query/Scan/ExecuteStatement,
// namespaced so the meaning and scope of each value stay unambiguous. This
// is the single source of truth for DynamoDB API telemetry; it does not
// mirror or replace the generic selectedRows/capacityUnits fields below.
export type RdhDynamoDbSummary = {
  apiOperation: "Query" | "Scan" | "ExecuteStatement";

  // Item count adopted into the response after Filter was applied.
  // For native Query/Scan, the sum of Count across all paginated responses.
  returnedItemCount?: number;

  // Item count DynamoDB evaluated before Filter was applied.
  // Sum of ScannedCount across all paginated responses for native
  // Query/Scan. Left undefined for ExecuteStatement.
  evaluatedItemCount?: number;

  // Number of successful paginated responses. Does not include SDK retries.
  successfulResponseCount?: number;

  // Additional attempts derived from the AWS SDK's response metadata.
  sdkRetryCount?: number;

  // Whether a LastEvaluatedKey/NextToken remained when execution stopped.
  // This only means the later key range was not evaluated - it does not
  // guarantee a matching item exists there.
  continuationTokenPresent?: boolean;

  consumedCapacity?: RdhDynamoDbConsumedCapacity;
};

export type RdhSummary = {
  // Display text for Query Result-style headings. Callers usually leave
  // ResultSetDataBuilder.setSummary() to generate the default RDB-oriented
  // "N rows in set (...)"/"N rows affected (...)" text; a caller with
  // store-specific display rules (e.g. DynamoDB) can instead pass its own
  // `info` and have it stored verbatim.
  info: string;
  elapsedTimeMilli: number;
  selectedRows?: number;
  affectedRows?: number;
  insertId?: number;
  changedRows?: number;
  capacityUnits?: number;
  // DynamoDB API execution evidence, namespaced separately from the
  // generic fields above. See RdhDynamoDbSummary for field meanings.
  dynamoDb?: RdhDynamoDbSummary;
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

/** asyncDiff()へ渡す、途中キャンセルの問い合わせ用トークン。 */
export type CancelToken = { isCancellationRequested: boolean };

export type DiffResult = {
  ok: boolean;
  message: string;
  deleted: number;
  inserted: number;
  updated: number;
  updatedColumns: number;
  /** 引数rdh1のクローンにUpd/Del/Addアノテーションを付与したもの(ok:trueの場合のみ設定される)。 */
  rdh1?: ResultSetData;
  /** 引数rdh2のクローンにUpd/Del/Addアノテーションを付与したもの(ok:trueの場合のみ設定される)。 */
  rdh2?: ResultSetData;
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

export const isResultSetData = (item: unknown): item is ResultSetData =>
  isRecord(item) &&
  "created" in item &&
  !!item.created &&
  "keys" in item &&
  !!item.keys &&
  "rows" in item &&
  !!item.rows &&
  "meta" in item &&
  !!item.meta;
