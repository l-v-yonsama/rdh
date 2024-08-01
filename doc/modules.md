[@l-v-yonsama/rdh](README.md) / Exports

# @l-v-yonsama/rdh

## Table of contents

### Classes

- [RdhHelper](classes/RdhHelper.md)
- [ResultSetDataBuilder](classes/ResultSetDataBuilder.md)
- [RowHelper](classes/RowHelper.md)

### Type Aliases

- [AddAnnotation](modules.md#addannotation)
- [AnnotationType](modules.md#annotationtype)
- [ApplicableResources](modules.md#applicableresources)
- [BaseCellAnnotation](modules.md#basecellannotation)
- [CellAnnotation](modules.md#cellannotation)
- [ChangeInNumbersAnnotation](modules.md#changeinnumbersannotation)
- [CodeItem](modules.md#codeitem)
- [CodeItemDetail](modules.md#codeitemdetail)
- [CodeResolvedAnnotation](modules.md#coderesolvedannotation)
- [CompareKey](modules.md#comparekey)
- [ConditionPropertyParam](modules.md#conditionpropertyparam)
- [ContentTypeInfo](modules.md#contenttypeinfo)
- [CsvDelimiter](modules.md#csvdelimiter)
- [DeleteAnnotation](modules.md#deleteannotation)
- [DiffResult](modules.md#diffresult)
- [DiffToUndoChangesResult](modules.md#difftoundochangesresult)
- [FileAnnotation](modules.md#fileannotation)
- [GeneralColumnType](modules.md#generalcolumntype)
- [LintAnnotation](modules.md#lintannotation)
- [MergedCell](modules.md#mergedcell)
- [QueryConditions](modules.md#queryconditions)
- [RdhKey](modules.md#rdhkey)
- [RdhMeta](modules.md#rdhmeta)
- [RdhRow](modules.md#rdhrow)
- [RdhRowMeta](modules.md#rdhrowmeta)
- [RdhSummary](modules.md#rdhsummary)
- [RecordRuleValidationResult](modules.md#recordrulevalidationresult)
- [RecordRuleValidationResultDetail](modules.md#recordrulevalidationresultdetail)
- [ResultSetData](modules.md#resultsetdata)
- [RuleAnnotation](modules.md#ruleannotation)
- [SampleClassPair](modules.md#sampleclasspair)
- [SampleGroupByClass](modules.md#samplegroupbyclass)
- [StyleAnnotation](modules.md#styleannotation)
- [TableRule](modules.md#tablerule)
- [TableRuleDetail](modules.md#tableruledetail)
- [ToStringParam](modules.md#tostringparam)
- [UpdateAnnotation](modules.md#updateannotation)

### Variables

- [AnnotationTypeConst](modules.md#annotationtypeconst)
- [GeneralColumnType](modules.md#generalcolumntype-1)

### Functions

- [abbr](modules.md#abbr)
- [castTo](modules.md#castto)
- [containsIgnoreCase](modules.md#containsignorecase)
- [createRdhKey](modules.md#createrdhkey)
- [diff](modules.md#diff)
- [diffToUndoChanges](modules.md#difftoundochanges)
- [displayGeneralColumnType](modules.md#displaygeneralcolumntype)
- [eolToSpace](modules.md#eoltospace)
- [equalsIgnoreCase](modules.md#equalsignorecase)
- [escapeHtml](modules.md#escapehtml)
- [getUniqObjectKeys](modules.md#getuniqobjectkeys)
- [isArray](modules.md#isarray)
- [isBinaryLike](modules.md#isbinarylike)
- [isBooleanLike](modules.md#isbooleanlike)
- [isDateTime](modules.md#isdatetime)
- [isDateTimeOrDate](modules.md#isdatetimeordate)
- [isDateTimeOrDateOrTime](modules.md#isdatetimeordateortime)
- [isEnumOrSet](modules.md#isenumorset)
- [isGeometryLike](modules.md#isgeometrylike)
- [isJsonLike](modules.md#isjsonlike)
- [isNotSupportDiffType](modules.md#isnotsupportdifftype)
- [isNumericLike](modules.md#isnumericlike)
- [isResultSetData](modules.md#isresultsetdata)
- [isResultSetDataBuilder](modules.md#isresultsetdatabuilder)
- [isTextLike](modules.md#istextlike)
- [isTime](modules.md#istime)
- [isUUIDType](modules.md#isuuidtype)
- [parseColumnType](modules.md#parsecolumntype)
- [parseFaIconType](modules.md#parsefaicontype)
- [resolveCodeLabel](modules.md#resolvecodelabel)
- [sleep](modules.md#sleep)
- [toBoolean](modules.md#toboolean)
- [toDate](modules.md#todate)
- [toLines](modules.md#tolines)
- [toNum](modules.md#tonum)
- [toTime](modules.md#totime)

## Type Aliases

### AddAnnotation

Ƭ **AddAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Add"``\>

#### Defined in

[types/resource/Annonations.ts:37](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L37)

___

### AnnotationType

Ƭ **AnnotationType**: typeof [`AnnotationTypeConst`](modules.md#annotationtypeconst)[keyof typeof [`AnnotationTypeConst`](modules.md#annotationtypeconst)]

#### Defined in

[types/resource/Annonations.ts:16](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L16)

___

### ApplicableResources

Ƭ **ApplicableResources**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `column` | \{ `pattern`: `string` ; `regex`: `boolean`  } |
| `column.pattern` | `string` |
| `column.regex` | `boolean` |
| `table?` | \{ `pattern`: `string` ; `regex`: `boolean`  } |
| `table.pattern` | `string` |
| `table.regex` | `boolean` |

#### Defined in

[types/resource/CodeResolverTypes.ts:8](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/CodeResolverTypes.ts#L8)

___

### BaseCellAnnotation

Ƭ **BaseCellAnnotation**\<`T`, `U`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`AnnotationType`](modules.md#annotationtype) |
| `U` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | `T` |
| `values?` | `U` |

#### Defined in

[types/resource/Annonations.ts:30](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L30)

___

### CellAnnotation

Ƭ **CellAnnotation**: [`DeleteAnnotation`](modules.md#deleteannotation) \| [`AddAnnotation`](modules.md#addannotation) \| [`UpdateAnnotation`](modules.md#updateannotation) \| [`RuleAnnotation`](modules.md#ruleannotation) \| [`LintAnnotation`](modules.md#lintannotation) \| [`StyleAnnotation`](modules.md#styleannotation) \| [`CodeResolvedAnnotation`](modules.md#coderesolvedannotation) \| [`FileAnnotation`](modules.md#fileannotation) \| [`ChangeInNumbersAnnotation`](modules.md#changeinnumbersannotation)

#### Defined in

[types/resource/Annonations.ts:19](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L19)

___

### ChangeInNumbersAnnotation

Ƭ **ChangeInNumbersAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Cin"``, \{ `value`: `number`  }\>

#### Defined in

[types/resource/Annonations.ts:94](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L94)

___

### CodeItem

Ƭ **CodeItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description?` | `string` |
| `details` | [`CodeItemDetail`](modules.md#codeitemdetail)[] |
| `resource` | [`ApplicableResources`](modules.md#applicableresources) |
| `title` | `string` |

#### Defined in

[types/resource/CodeResolverTypes.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/CodeResolverTypes.ts#L1)

___

### CodeItemDetail

Ƭ **CodeItemDetail**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `label` | `string` |

#### Defined in

[types/resource/CodeResolverTypes.ts:19](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/CodeResolverTypes.ts#L19)

___

### CodeResolvedAnnotation

Ƭ **CodeResolvedAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Cod"``, \{ `isUndefined`: `boolean` ; `label`: `string`  }\>

#### Defined in

[types/resource/Annonations.ts:55](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L55)

___

### CompareKey

Ƭ **CompareKey**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `kind` | ``"custom"`` \| ``"uniq"`` \| ``"primary"`` |
| `names` | `string`[] |

#### Defined in

[types/resource/CompareKey.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/CompareKey.ts#L1)

___

### ConditionPropertyParam

Ƭ **ConditionPropertyParam**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `valColumn` | `string` |
| `valType` | ``"static"`` \| ``"column"`` |

#### Defined in

[types/resource/Rules.ts:17](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Rules.ts#L17)

___

### ContentTypeInfo

Ƭ **ContentTypeInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `fileName` | `string` |
| `isTextValue` | `boolean` |
| `renderType` | ``"Image"`` \| ``"Text"`` \| ``"Video"`` \| ``"Audio"`` \| ``"Font"`` \| ``"Unknown"`` |
| `shortLang?` | `string` |

#### Defined in

[types/resource/ContentTypeInfo.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ContentTypeInfo.ts#L1)

___

### CsvDelimiter

Ƭ **CsvDelimiter**: ``","`` \| ``"\t"`` \| ``" "``

#### Defined in

[types/resource/ResultSetDataType.ts:24](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L24)

___

### DeleteAnnotation

Ƭ **DeleteAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Del"``\>

#### Defined in

[types/resource/Annonations.ts:35](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L35)

___

### DiffResult

Ƭ **DiffResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `number` |
| `inserted` | `number` |
| `message` | `string` |
| `ok` | `boolean` |
| `updated` | `number` |

#### Defined in

[types/resource/ResultSetDataType.ts:104](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L104)

___

### DiffToUndoChangesResult

Ƭ **DiffToUndoChangesResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `ok` | `boolean` |
| `toBeDeleted` | \{ `conditions`: \{ `[key: string]`: `any`;  }  }[] |
| `toBeInserted` | \{ `values`: \{ `[key: string]`: `any`;  }  }[] |
| `toBeUpdated` | \{ `conditions`: \{ `[key: string]`: `any`;  } ; `values`: \{ `[key: string]`: `any`;  }  }[] |

#### Defined in

[types/resource/ResultSetDataType.ts:112](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L112)

___

### FileAnnotation

Ƭ **FileAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Fil"``, \{ `contentTypeInfo`: [`ContentTypeInfo`](modules.md#contenttypeinfo) ; `downloadUrl?`: `string` ; `encoding?`: `string` ; `lastModified`: `Date` ; `name`: `string` ; `size`: `number`  }\>

#### Defined in

[types/resource/Annonations.ts:82](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L82)

___

### GeneralColumnType

Ƭ **GeneralColumnType**: typeof [`GeneralColumnType`](modules.md#generalcolumntype-1)[keyof typeof [`GeneralColumnType`](modules.md#generalcolumntype-1)]

#### Defined in

[types/resource/GeneralColumnType.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/GeneralColumnType.ts#L1)

[types/resource/GeneralColumnType.ts:75](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/GeneralColumnType.ts#L75)

___

### LintAnnotation

Ƭ **LintAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Lnt"``, \{ `fix`: `string` ; `message`: `string` ; `ruleId`: `string`  }\>

#### Defined in

[types/resource/Annonations.ts:63](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L63)

___

### MergedCell

Ƭ **MergedCell**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `col` | `number` |
| `colspan` | `number` |
| `row` | `number` |
| `rowspan` | `number` |

#### Defined in

[types/resource/ResultSetDataType.ts:54](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L54)

___

### QueryConditions

Ƭ **QueryConditions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `binds?` | `string`[] | - |
| `rawQueries?` | `boolean` | you want to run a heavily optimized query |

#### Defined in

[types/resource/QueryConditions.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/QueryConditions.ts#L1)

___

### RdhKey

Ƭ **RdhKey**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `align?` | ``"left"`` \| ``"center"`` \| ``"right"`` |
| `comment` | `string` |
| `meta?` | \{ `[key: string]`: `any`; `is_hyperlink?`: `boolean` ; `is_image?`: `boolean`  } |
| `meta.is_hyperlink?` | `boolean` |
| `meta.is_image?` | `boolean` |
| `name` | `string` |
| `required?` | `boolean` |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |
| `width?` | `number` |

#### Defined in

[types/resource/ResultSetDataType.ts:61](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L61)

___

### RdhMeta

Ƭ **RdhMeta**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `codeItems?` | [`CodeItem`](modules.md#codeitem)[] |
| `comment?` | `string` |
| `compareKeys?` | [`CompareKey`](modules.md#comparekey)[] |
| `connectionName?` | `string` |
| `editable?` | `boolean` |
| `ruleViolationSummary?` | \{ `[ruleName: string]`: `number`;  } |
| `schemaName?` | `string` |
| `tableName?` | `string` |
| `tableRule?` | [`TableRule`](modules.md#tablerule) |
| `type?` | `string` |

#### Defined in

[types/resource/ResultSetDataType.ts:8](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L8)

___

### RdhRow

Ƭ **RdhRow**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `meta` | [`RdhRowMeta`](modules.md#rdhrowmeta) |
| `values` | \{ `[key: string]`: `any`;  } |

#### Defined in

[types/resource/ResultSetDataType.ts:77](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L77)

___

### RdhRowMeta

Ƭ **RdhRowMeta**: `Object`

#### Index signature

▪ [key: `string`]: [`CellAnnotation`](modules.md#cellannotation)[]

#### Defined in

[types/resource/ResultSetDataType.ts:75](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L75)

___

### RdhSummary

Ƭ **RdhSummary**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `affectedRows?` | `number` |
| `changedRows?` | `number` |
| `elapsedTimeMilli` | `number` |
| `info` | `string` |
| `insertId?` | `number` |
| `selectedRows?` | `number` |

#### Defined in

[types/resource/ResultSetDataType.ts:82](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L82)

___

### RecordRuleValidationResult

Ƭ **RecordRuleValidationResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details` | [`RecordRuleValidationResultDetail`](modules.md#recordrulevalidationresultdetail)[] |
| `tableName` | `string` |

#### Defined in

[types/resource/Rules.ts:23](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Rules.ts#L23)

___

### RecordRuleValidationResultDetail

Ƭ **RecordRuleValidationResultDetail**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conditionText` | `string` |
| `errorRows` | \{ `conditionValues`: \{ `[key: string]`: `any`;  } ; `rowNo`: `number`  }[] |
| `ruleDetail` | [`TableRuleDetail`](modules.md#tableruledetail) |

#### Defined in

[types/resource/Rules.ts:28](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Rules.ts#L28)

___

### ResultSetData

Ƭ **ResultSetData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `created` | `Date` |
| `keys` | [`RdhKey`](modules.md#rdhkey)[] |
| `mergeCells?` | [`MergedCell`](modules.md#mergedcell)[] |
| `meta` | [`RdhMeta`](modules.md#rdhmeta) |
| `queryConditions?` | [`QueryConditions`](modules.md#queryconditions) |
| `rows` | [`RdhRow`](modules.md#rdhrow)[] |
| `shuffledIndexes?` | `number`[] |
| `shuffledNextCounter?` | `number` |
| `sqlStatement?` | `string` |
| `summary?` | [`RdhSummary`](modules.md#rdhsummary) |

#### Defined in

[types/resource/ResultSetDataType.ts:91](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L91)

___

### RuleAnnotation

Ƭ **RuleAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Rul"``, \{ `conditionValues`: \{ `[key: string]`: `any`;  } ; `message`: `string` ; `name`: `string`  }\>

#### Defined in

[types/resource/Annonations.ts:46](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L46)

___

### SampleClassPair

Ƭ **SampleClassPair**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clazzValue` | `any` |
| `sampleValues` | `any`[] |

#### Defined in

[types/resource/ResultSetDataType.ts:42](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L42)

___

### SampleGroupByClass

Ƭ **SampleGroupByClass**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clazzKey` | `string` |
| `is_shuffled` | `boolean` |
| `pairs` | [`SampleClassPair`](modules.md#sampleclasspair)[] |
| `sampleKeys` | `string`[] |

#### Defined in

[types/resource/ResultSetDataType.ts:47](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L47)

___

### StyleAnnotation

Ƭ **StyleAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Stl"``, \{ `a?`: \{ `h?`: `string` ; `v?`: `string`  } ; `b?`: `string` ; `f?`: \{ `n`: `string` ; `s`: `number`  } ; `fmt?`: `string`  }\>

#### Defined in

[types/resource/Annonations.ts:72](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L72)

___

### TableRule

Ƭ **TableRule**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details` | [`TableRuleDetail`](modules.md#tableruledetail)[] |
| `table` | `string` |

#### Defined in

[types/resource/Rules.ts:3](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Rules.ts#L3)

___

### TableRuleDetail

Ƭ **TableRuleDetail**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conditions` | `TopLevelCondition` |
| `error` | \{ `column`: `string` ; `limit`: `number`  } |
| `error.column` | `string` |
| `error.limit` | `number` |
| `ruleName` | `string` |

#### Defined in

[types/resource/Rules.ts:8](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Rules.ts#L8)

___

### ToStringParam

Ƭ **ToStringParam**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binaryToHex?` | `boolean` |
| `csv?` | \{ `delimiter`: [`CsvDelimiter`](modules.md#csvdelimiter)  } |
| `csv.delimiter` | [`CsvDelimiter`](modules.md#csvdelimiter) |
| `dateFormat?` | ``"YYYY-MM-DD"`` \| ``"YYYY-MM-DD HH:mm:ss"`` |
| `eol?` | ``"\n"`` \| ``"\r"`` \| ``"\r\n"`` |
| `keyNames?` | `string`[] |
| `maxCellValueLength?` | `number` |
| `maxPrintLines?` | `number` |
| `withCodeLabel?` | `boolean` |
| `withComment?` | `boolean` |
| `withRowNo?` | `boolean` |
| `withRuleViolation?` | `boolean` |
| `withType?` | `boolean` |

#### Defined in

[types/resource/ResultSetDataType.ts:25](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L25)

___

### UpdateAnnotation

Ƭ **UpdateAnnotation**: [`BaseCellAnnotation`](modules.md#basecellannotation)\<``"Upd"``, \{ `otherValue`: `any`  }\>

#### Defined in

[types/resource/Annonations.ts:39](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L39)

## Variables

### AnnotationTypeConst

• `Const` **AnnotationTypeConst**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Add` | ``"Add"`` |
| `CIN` | ``"Cin"`` |
| `Cod` | ``"Cod"`` |
| `Del` | ``"Del"`` |
| `Err` | ``"Err"`` |
| `Fil` | ``"Fil"`` |
| `Lnt` | ``"Lnt"`` |
| `Rul` | ``"Rul"`` |
| `Stl` | ``"Stl"`` |
| `Upd` | ``"Upd"`` |

#### Defined in

[types/resource/Annonations.ts:3](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/Annonations.ts#L3)

___

### GeneralColumnType

• `Const` **GeneralColumnType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ARRAY` | ``"array"`` |
| `BIGINT` | ``"bigint"`` |
| `BINARY` | ``"binary"`` |
| `BIT` | ``"bit"`` |
| `BLOB` | ``"blob"`` |
| `BOOLEAN` | ``"boolean"`` |
| `BOX` | ``"box"`` |
| `BYTEA` | ``"bytea"`` |
| `CHAR` | ``"char"`` |
| `CIDR` | ``"cidr"`` |
| `CIRCLE` | ``"circle"`` |
| `CLOB` | ``"clob"`` |
| `DATE` | ``"date"`` |
| `DECIMAL` | ``"decimal"`` |
| `DOUBLE_PRECISION` | ``"double_precision"`` |
| `ENUM` | ``"enum"`` |
| `FLOAT` | ``"float"`` |
| `GEOMETRY` | ``"geometry"`` |
| `INET` | ``"inet"`` |
| `INTEGER` | ``"integer"`` |
| `INTERVAL` | ``"interval"`` |
| `JSON` | ``"json"`` |
| `JSONB` | ``"jsonb"`` |
| `LINE` | ``"line"`` |
| `LONG` | ``"long"`` |
| `LONGBLOB` | ``"longblob"`` |
| `LONGLONG` | ``"longlong"`` |
| `LONGTEXT` | ``"longtext"`` |
| `LSEG` | ``"lseg"`` |
| `MACADDR` | ``"macaddr"`` |
| `MEDIUMBLOB` | ``"mediumblob"`` |
| `MEDIUMINT` | ``"mediumint"`` |
| `MEDIUMTEXT` | ``"mediumtext"`` |
| `MONEY` | ``"money"`` |
| `NAME` | ``"name"`` |
| `NUMERIC` | ``"numeric"`` |
| `OBJECT` | ``"object"`` |
| `OID` | ``"oid"`` |
| `PATH` | ``"path"`` |
| `PG_DEPENDENCIES` | ``"pg_dependencies"`` |
| `PG_LSN` | ``"pg_lsn"`` |
| `PG_NDISTINCT` | ``"pg_ndistinct"`` |
| `PG_NODE_TREE` | ``"pg_node_tree"`` |
| `POINT` | ``"point"`` |
| `POLYGON` | ``"polygon"`` |
| `REAL` | ``"real"`` |
| `REGPROC` | ``"regproc"`` |
| `REGTYPE` | ``"regtype"`` |
| `SERIAL` | ``"serial"`` |
| `SET` | ``"set"`` |
| `SMALLINT` | ``"smallint"`` |
| `TEXT` | ``"text"`` |
| `TIME` | ``"time"`` |
| `TIMESTAMP` | ``"timestamp"`` |
| `TIMESTAMP_WITH_TIME_ZONE` | ``"timestamp_with_time_zone"`` |
| `TIME_WITH_TIME_ZONE` | ``"time_with_time_zone"`` |
| `TINYBLOB` | ``"tinyblob"`` |
| `TINYINT` | ``"tinyint"`` |
| `TINYTEXT` | ``"tinytext"`` |
| `TSQUERY` | ``"tsquery"`` |
| `TSVECTOR` | ``"tsvector"`` |
| `TXID_SNAPSHOT` | ``"txid_snapshot"`` |
| `UNKNOWN` | ``"unknown"`` |
| `UUID` | ``"uuid"`` |
| `VARBINARY` | ``"varbinary"`` |
| `VARBIT` | ``"varbit"`` |
| `VARCHAR` | ``"varchar"`` |
| `VARIANT` | ``"variant"`` |
| `XID` | ``"xid"`` |
| `XML` | ``"xml"`` |
| `YEAR` | ``"year"`` |

#### Defined in

[types/resource/GeneralColumnType.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/GeneralColumnType.ts#L1)

[types/resource/GeneralColumnType.ts:75](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/GeneralColumnType.ts#L75)

## Functions

### abbr

▸ **abbr**(`s`, `len?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `s` | `string` | `undefined` |
| `len` | `number` | `10` |

#### Returns

`string`

#### Defined in

[utils/strings.ts:13](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/strings.ts#L13)

___

### castTo

▸ **castTo**\<`T`\>(`o`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `unknown` |

#### Returns

`T`

#### Defined in

[utils/base.ts:3](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L3)

___

### containsIgnoreCase

▸ **containsIgnoreCase**(`keyword`, `list`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyword` | `string` |
| `list` | `string`[] |

#### Returns

`boolean`

#### Defined in

[utils/strings.ts:29](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/strings.ts#L29)

___

### createRdhKey

▸ **createRdhKey**(`«destructured»`): [`RdhKey`](modules.md#rdhkey)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `align?` | ``"left"`` \| ``"center"`` \| ``"right"`` |
| › `comment?` | `string` |
| › `meta?` | `Object` |
| › `meta.is_hyperlink?` | `boolean` |
| › `meta.is_image?` | `boolean` |
| › `name` | `string` |
| › `required?` | `boolean` |
| › `type?` | [`GeneralColumnType`](modules.md#generalcolumntype) |
| › `width?` | `number` |

#### Returns

[`RdhKey`](modules.md#rdhkey)

#### Defined in

[resource/ResultSetDataBuilder.ts:28](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/ResultSetDataBuilder.ts#L28)

___

### diff

▸ **diff**(`rdh1`, `rdh2`): [`DiffResult`](modules.md#diffresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rdh1` | [`ResultSetData`](modules.md#resultsetdata) |
| `rdh2` | [`ResultSetData`](modules.md#resultsetdata) |

#### Returns

[`DiffResult`](modules.md#diffresult)

#### Defined in

[helpers/ResourceHelper.ts:18](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/helpers/ResourceHelper.ts#L18)

___

### diffToUndoChanges

▸ **diffToUndoChanges**(`rdh1`, `rdh2`): [`DiffToUndoChangesResult`](modules.md#difftoundochangesresult)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rdh1` | [`ResultSetData`](modules.md#resultsetdata) |
| `rdh2` | [`ResultSetData`](modules.md#resultsetdata) |

#### Returns

[`DiffToUndoChangesResult`](modules.md#difftoundochangesresult)

#### Defined in

[helpers/ResourceHelper.ts:124](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/helpers/ResourceHelper.ts#L124)

___

### displayGeneralColumnType

▸ **displayGeneralColumnType**(`columnType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `columnType` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`string`

#### Defined in

[resource/GeneralColumnUtil.ts:3](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L3)

___

### eolToSpace

▸ **eolToSpace**(`s`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` |

#### Returns

`string`

#### Defined in

[utils/strings.ts:5](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/strings.ts#L5)

___

### equalsIgnoreCase

▸ **equalsIgnoreCase**(`s1`, `s2`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s1` | `string` |
| `s2` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/strings.ts:25](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/strings.ts#L25)

___

### escapeHtml

▸ **escapeHtml**(`s`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` |

#### Returns

`string`

#### Defined in

[utils/strings.ts:51](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/strings.ts#L51)

___

### getUniqObjectKeys

▸ **getUniqObjectKeys**(`list`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | `any`[] |

#### Returns

`string`[]

#### Defined in

[utils/base.ts:107](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L107)

___

### isArray

▸ **isArray**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:187](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L187)

___

### isBinaryLike

▸ **isBinaryLike**(`type`): `boolean`

Tests whether type is BYTEA,BLOB,MEDIUMBLOB,LONGBLOB OR BINARY

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) | GC |

#### Returns

`boolean`

true:BYTEA,BLOB,MEDIUMBLOB,LONGBLOB OR BINARY

#### Defined in

[resource/GeneralColumnUtil.ts:80](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L80)

___

### isBooleanLike

▸ **isBooleanLike**(`type`): `boolean`

Tests whether type is BOOLEAN or BIT

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) | GC |

#### Returns

`boolean`

true:BOOLEAN or BIT

#### Defined in

[resource/GeneralColumnUtil.ts:181](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L181)

___

### isDateTime

▸ **isDateTime**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:146](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L146)

___

### isDateTimeOrDate

▸ **isDateTimeOrDate**(`type`): `boolean`

Tests whether type is DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) | GC |

#### Returns

`boolean`

true:DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE

#### Defined in

[resource/GeneralColumnUtil.ts:119](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L119)

___

### isDateTimeOrDateOrTime

▸ **isDateTimeOrDateOrTime**(`type`): `boolean`

Tests whether type is TIME,TIME_WITH_TIME_ZONE,DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) | GC |

#### Returns

`boolean`

true:TIME,TIME_WITH_TIME_ZONE,DATE,TIMESTAMP OR TIMESTAMP_WITH_TIME_ZONE

#### Defined in

[resource/GeneralColumnUtil.ts:134](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L134)

___

### isEnumOrSet

▸ **isEnumOrSet**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:184](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L184)

___

### isGeometryLike

▸ **isGeometryLike**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:94](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L94)

___

### isJsonLike

▸ **isJsonLike**(`type`): `boolean`

Tests whether type is JSON or JSONB

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) | GC |

#### Returns

`boolean`

true:JSON or JSONB

#### Defined in

[resource/GeneralColumnUtil.ts:173](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L173)

___

### isNotSupportDiffType

▸ **isNotSupportDiffType**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:104](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L104)

___

### isNumericLike

▸ **isNumericLike**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:40](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L40)

___

### isResultSetData

▸ **isResultSetData**(`item`): item is ResultSetData

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

item is ResultSetData

#### Defined in

[types/resource/ResultSetDataType.ts:127](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/types/resource/ResultSetDataType.ts#L127)

___

### isResultSetDataBuilder

▸ **isResultSetDataBuilder**(`item`): item is ResultSetDataBuilder

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

item is ResultSetDataBuilder

#### Defined in

[resource/ResultSetDataBuilder.ts:66](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/ResultSetDataBuilder.ts#L66)

___

### isTextLike

▸ **isTextLike**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:62](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L62)

___

### isTime

▸ **isTime**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:155](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L155)

___

### isUUIDType

▸ **isUUIDType**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`boolean`

#### Defined in

[resource/GeneralColumnUtil.ts:164](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L164)

___

### parseColumnType

▸ **parseColumnType**(`s`): [`GeneralColumnType`](modules.md#generalcolumntype)

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` |

#### Returns

[`GeneralColumnType`](modules.md#generalcolumntype)

#### Defined in

[resource/GeneralColumnUtil.ts:7](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L7)

___

### parseFaIconType

▸ **parseFaIconType**(`type`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GeneralColumnType`](modules.md#generalcolumntype) |

#### Returns

`string`

#### Defined in

[resource/GeneralColumnUtil.ts:191](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/resource/GeneralColumnUtil.ts#L191)

___

### resolveCodeLabel

▸ **resolveCodeLabel**(`rdh`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rdh` | [`ResultSetData`](modules.md#resultsetdata) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[helpers/CodeResolver.ts:5](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/helpers/CodeResolver.ts#L5)

___

### sleep

▸ **sleep**(`ms`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[utils/base.ts:7](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L7)

___

### toBoolean

▸ **toBoolean**(`s`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` \| `boolean` \| `Buffer` |

#### Returns

`boolean`

#### Defined in

[utils/base.ts:28](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L28)

___

### toDate

▸ **toDate**(`s`): `Date`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` \| `number` \| `Date` |

#### Returns

`Date`

#### Defined in

[utils/base.ts:51](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L51)

___

### toLines

▸ **toLines**(`s`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` |

#### Returns

`string`[]

#### Defined in

[utils/strings.ts:1](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/strings.ts#L1)

___

### toNum

▸ **toNum**(`s`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` \| `number` |

#### Returns

`number`

#### Defined in

[utils/base.ts:10](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L10)

___

### toTime

▸ **toTime**(`s`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` |

#### Returns

`string`

#### Defined in

[utils/base.ts:91](https://github.com/l-v-yonsama/rdh/blob/e7aeae04bb4954180f0a3883b793819325e09131/src/utils/base.ts#L91)
