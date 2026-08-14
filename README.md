# RDH

RDH (Resultset Data Holder) is a small TypeScript library for representing database-like result sets in a consistent, portable structure.

It provides:

- typed column metadata and row values;
- a fluent-style builder for creating and transforming result sets;
- plain-text, Markdown, HTML, and CSV rendering;
- non-destructive result-set comparison;
- undo-operation generation from result-set differences;
- cell annotations for additions, deletions, updates, errors, rules, styles, files, and code labels;
- utilities for column-type classification, value conversion, and code-to-label resolution.

RDH is used by [db-drivers](https://github.com/l-v-yonsama/db-drivers) and [db-notebook](https://github.com/l-v-yonsama/db-notebook), but it can also be used independently.

## Requirements

- Node.js 18 or later
- TypeScript is optional for consumers; declaration files are included in the package

## Installation

```bash
npm install @l-v-yonsama/rdh
```

## Quick start

```ts
import {
  GeneralColumnType,
  ResultSetDataBuilder,
  createRdhKey,
} from "@l-v-yonsama/rdh";

const users = new ResultSetDataBuilder([
  createRdhKey({
    name: "id",
    type: GeneralColumnType.INTEGER,
    required: true,
  }),
  createRdhKey({ name: "name", type: GeneralColumnType.TEXT }),
  createRdhKey({ name: "active", type: GeneralColumnType.BOOLEAN }),
]);

users.addRow({ id: 1, name: "Alice", active: true });
users.addRow({ id: 2, name: "Bob", active: false });

console.log(users.toMarkdown({ withType: true }));
```

Output:

```markdown
| id | name | active |
| ---: | :--- | :---: |
| INTEGER | TEXT | BOOLEAN |
| 1 | Alice | true |
| 2 | Bob | false |
```

Call `build()` when an API expects the plain `ResultSetData` structure:

```ts
const resultSet = users.build();
```

`build()` returns the object currently held by the builder; it does not create a clone. Use `ResultSetDataBuilder.from(existingResultSet)` when an independent copy is required.

## Data model

The central data structure is `ResultSetData`:

```ts
type ResultSetData = {
  readonly created: Date;
  readonly keys: RdhKey[];
  readonly rows: RdhRow[];
  readonly meta: RdhMeta;
  readonly noRecordsReason?: string;
  summary?: RdhSummary;
  queryConditions?: QueryConditions;
  sqlStatement?: string;
  mergeCells?: MergedCell[];
};
```

The main parts are:

| Property | Purpose |
| --- | --- |
| `keys` | Ordered column definitions, including name, type, comment, width, alignment, and display metadata |
| `rows` | Row values plus per-cell annotations |
| `meta` | Result-level context such as connection, schema, table, comparison keys, rules, and code-label definitions |
| `summary` | Optional execution information such as elapsed time, affected rows, and insert ID |
| `sqlStatement` | Optional SQL statement associated with the result |

Each row stores values by column name:

```ts
type RdhRow = {
  readonly values: Record<string, unknown>;
  readonly meta: RdhRowMeta;
};
```

## Defining columns

Use `createRdhKey()` to define a column:

```ts
const createdAt = createRdhKey({
  name: "created_at",
  comment: "Creation timestamp",
  type: GeneralColumnType.TIMESTAMP,
  width: 180,
  align: "left",
});
```

For simple data, column definitions can be inferred with `createRdhKeysOf()`:

```ts
import { createRdhKeysOf } from "@l-v-yonsama/rdh";

const keys = createRdhKeysOf([
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
]);
```

Inference recognizes strings, numbers, bigints, booleans, dates, JSON-like objects, `null`, and mixed or unknown values.

`GeneralColumnType` contains common relational, PostgreSQL, DynamoDB, binary, date/time, JSON, array, set, UUID, and geometry-oriented types. Helper functions such as `isNumericLike()`, `isTextLike()`, `isDateTime()`, `isJsonLike()`, and `parseColumnType()` are also exported.

## Creating and cloning result sets

### From explicit columns

```ts
const result = new ResultSetDataBuilder(["id", "message"]);
result.addRow({ id: 1, message: "ready" });
result.updateKeyType("id", GeneralColumnType.INTEGER);
result.updateKeyType("message", GeneralColumnType.TEXT);
```

String column names initially use `GeneralColumnType.UNKNOWN`. Use `createRdhKey()` when the type is known in advance.

### From a two-dimensional array

```ts
const result = ResultSetDataBuilder.from(
  [
    ["id", "name"],
    [1, "Alice"],
    [2, "Bob"],
  ],
  { firstRowAsTitle: true }
);
```

### From a record

A record is represented as `KEY`, `TYPE`, and `VALUE` rows:

```ts
const result = ResultSetDataBuilder.from({
  host: "localhost",
  port: 5432,
  ssl: false,
});
```

### From an existing RDH

```ts
const cloned = ResultSetDataBuilder.from(existingResultSet);
```

Cloning preserves RDH metadata and supported value types without sharing mutable row values with the source. This includes nested objects and arrays as well as `Date`, `Buffer`, `Uint8Array`, `Set`, and special numeric values.

### Empty results

```ts
const empty = ResultSetDataBuilder.createEmpty({
  noRecordsReason: "The query returned no rows.",
});
```

Renderers use `noRecordsReason` when present.

## Rendering

`ResultSetDataBuilder` supports four output formats:

```ts
result.toString();   // aligned plain-text table
result.toMarkdown();
result.toHtml();
result.toCsv();
```

All renderers accept `ToStringParam` options:

```ts
const markdown = result.toMarkdown({
  maxPrintLines: 100,
  maxCellValueLength: 500,
  withType: true,
  withComment: true,
  withRowNo: true,
  withCodeLabel: true,
  withRuleViolation: true,
  keyNames: ["id", "name"],
  dateFormat: "YYYY-MM-DD",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
  eol: "\n",
  binaryToHex: false,
});
```

CSV delimiters can be selected independently:

```ts
const tsv = result.toCsv({
  csv: { delimiter: "\t" },
});
```

When `maxPrintLines` is smaller than the number of rows, renderers show rows from the beginning and end with an omission marker between them. Binary-to-hex rendering is capped at 64 bytes before cell-length abbreviation is applied.

## Comparing result sets

RDH can compare an older result set with a newer result set by using a primary, unique, or custom comparison key.

```ts
import {
  GeneralColumnType,
  ResultSetDataBuilder,
  createRdhKey,
  diff,
} from "@l-v-yonsama/rdh";

const keys = [
  createRdhKey({ name: "id", type: GeneralColumnType.INTEGER }),
  createRdhKey({ name: "name", type: GeneralColumnType.TEXT }),
];

const before = new ResultSetDataBuilder(keys);
before.addRow({ id: 1, name: "Alice" });
before.addRow({ id: 2, name: "Bob" });
before.updateMeta({
  compareKeys: [{ kind: "primary", names: ["id"] }],
});

const after = new ResultSetDataBuilder(keys);
after.addRow({ id: 1, name: "Alicia" });
after.addRow({ id: 3, name: "Carol" });
after.updateMeta({
  compareKeys: [{ kind: "primary", names: ["id"] }],
});

const comparison = diff(before.build(), after.build());

if (!comparison.ok) {
  throw new Error(comparison.message);
}

console.log({
  inserted: comparison.inserted,
  deleted: comparison.deleted,
  updated: comparison.updated,
  updatedColumns: comparison.updatedColumns,
});
```

`diff()` does not mutate either input. On success, `comparison.rdh1` and `comparison.rdh2` contain independent clones annotated with:

- `"Add"` for inserted rows;
- `"Del"` for removed rows;
- `"Upd"` for changed cells.

Comparison keys must be available in both result sets and must contain supported scalar column types. Duplicate comparison-key values are reported as an unsuccessful result rather than matched ambiguously.

### Asynchronous comparison and cancellation

Use `asyncDiff()` for large result sets when the event loop must remain responsive:

```ts
import { asyncDiff } from "@l-v-yonsama/rdh";

const cancelToken = { isCancellationRequested: false };
const comparison = await asyncDiff(
  before.build(),
  after.build(),
  cancelToken
);

// Set cancelToken.isCancellationRequested = true from your UI or task handler
// when cancellation is requested.
```

`asyncDiff()` uses the same comparison rules as `diff()` while yielding periodically and checking the cancellation token.

### Generating undo operations

`diffToUndoChanges()` describes the operations required to restore the newer result to the older state:

```ts
import { diffToUndoChanges } from "@l-v-yonsama/rdh";

const undo = diffToUndoChanges(before.build(), after.build());

if (undo.ok) {
  console.log(undo.toBeInserted);
  console.log(undo.toBeUpdated);
  console.log(undo.toBeDeleted);
}
```

The result contains data and comparison-key conditions; it does not generate database-specific SQL. A database adapter can translate these operations into parameterized statements.

## Cell annotations

Annotations add presentation or analysis information without changing cell values. Use `RowHelper` for individual rows and `RdhHelper` for a whole result set.

```ts
import { RowHelper } from "@l-v-yonsama/rdh";

const row = result.build().rows[0];

RowHelper.pushAnnotation(row, "name", {
  type: "Err",
});

if (RowHelper.hasAnnotation(row, "Err")) {
  console.log("The row contains an error annotation");
}
```

Supported annotation categories include:

| Type | Meaning |
| --- | --- |
| `Add` | Added row/cell |
| `Del` | Deleted row/cell |
| `Upd` | Updated cell, including the other value |
| `Err` | Error marker |
| `Rul` | Record-rule violation |
| `Cod` | Resolved code label |
| `Lnt` | Lint result |
| `Stl` | Display style |
| `Fil` | File metadata |
| `Cin` | Numeric change information |

Markdown, HTML, CSV, and plain-text renderers can include code labels and rule-violation markers. HTML output also applies classes for addition, deletion, update, and error annotations.

## Resolving code labels

`resolveCodeLabel()` converts stored code values into display labels and writes `Cod` annotations to matching cells.

```ts
import { resolveCodeLabel } from "@l-v-yonsama/rdh";

result.updateMeta({
  tableName: "orders",
  codeItems: [
    {
      title: "Order status",
      resource: {
        table: { regex: false, pattern: "orders" },
        column: { regex: false, pattern: "status" },
      },
      details: [
        { code: "0", label: "Pending" },
        { code: "1", label: "Completed" },
      ],
    },
  ],
});

await resolveCodeLabel(result.build());
console.log(result.toMarkdown({ withCodeLabel: true }));
```

Calling `resolveCodeLabel()` again first removes existing `Cod` annotations, so changing or removing label definitions does not leave stale labels behind. Invalid regular expressions are treated as non-matching definitions rather than stopping the entire resolution process.

## Builder operations

Frequently used `ResultSetDataBuilder` methods include:

| Method | Purpose |
| --- | --- |
| `addRow()` | Add a row while normalizing it to the defined keys |
| `build()` | Return the held `ResultSetData` |
| `updateKeyType()` | Change a column type |
| `updateKeyName()` | Rename a column and its row values/metadata |
| `updateKeyComment()` | Add or change a column comment |
| `updateKeyWidth()` / `updateKeyAlign()` | Set display hints |
| `updateMeta()` | Merge result-level metadata |
| `drop()` | Remove a column |
| `assign()` | Assign a value list to a column |
| `toVector()` | Extract a column as an array |
| `fillnull()` | Fill numeric null values with the mean or median |
| `describe()` | Produce descriptive statistics for numeric columns |
| `setSummary()` | Set query/execution summary information |
| `clearRows()` | Remove every row |

## Utility exports

The package root also exports:

- column-type parsing and predicates from `GeneralColumnUtil`;
- value helpers such as `toNum()`, `toBoolean()`, `toDate()`, and `toTime()`;
- string helpers such as `abbr()`, `escapeHtml()`, and case-insensitive comparison;
- RDH and annotation type guards;
- TypeScript types for result sets, rows, keys, summaries, rules, comparison keys, query conditions, code-label definitions, and annotations.

Prefer importing from the package root:

```ts
import {
  ResultSetDataBuilder,
  type ResultSetData,
  type RdhKey,
} from "@l-v-yonsama/rdh";
```

Imports from internal `built/src/...` paths are not part of the supported public API.

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/l-v-yonsama/rdh.git
cd rdh
npm install
```

Common commands:

```bash
npm run lint          # ESLint
npm test              # Jest test suite
npm run test0         # Jest with coverage
npm run build         # Development build
npm run build:release # Declaration-emitting release build
npm run prettier      # Format the repository
```

Before submitting a change, run at least:

```bash
npm run lint
npm test
npm run build:release
```

## License

[MIT](./LICENSE)
