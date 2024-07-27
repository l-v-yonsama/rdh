[@l-v-yonsama/rdh](../README.md) / [Exports](../modules.md) / ResultSetDataBuilder

# Class: ResultSetDataBuilder

## Table of contents

### Constructors

- [constructor](ResultSetDataBuilder.md#constructor)

### Properties

- [rs](ResultSetDataBuilder.md#rs)

### Methods

- [addRow](ResultSetDataBuilder.md#addrow)
- [assign](ResultSetDataBuilder.md#assign)
- [build](ResultSetDataBuilder.md#build)
- [clearRows](ResultSetDataBuilder.md#clearrows)
- [describe](ResultSetDataBuilder.md#describe)
- [drop](ResultSetDataBuilder.md#drop)
- [fillnull](ResultSetDataBuilder.md#fillnull)
- [hasAnyAnnotation](ResultSetDataBuilder.md#hasanyannotation)
- [hasKey](ResultSetDataBuilder.md#haskey)
- [hasKeyComment](ResultSetDataBuilder.md#haskeycomment)
- [keynames](ResultSetDataBuilder.md#keynames)
- [resetKeyTypeByRows](ResultSetDataBuilder.md#resetkeytypebyrows)
- [sampleCorrelation](ResultSetDataBuilder.md#samplecorrelation)
- [setSqlStatement](ResultSetDataBuilder.md#setsqlstatement)
- [setSummary](ResultSetDataBuilder.md#setsummary)
- [toCsv](ResultSetDataBuilder.md#tocsv)
- [toHtml](ResultSetDataBuilder.md#tohtml)
- [toMarkdown](ResultSetDataBuilder.md#tomarkdown)
- [toMatrixArray](ResultSetDataBuilder.md#tomatrixarray)
- [toString](ResultSetDataBuilder.md#tostring)
- [toVector](ResultSetDataBuilder.md#tovector)
- [updateKeyAlign](ResultSetDataBuilder.md#updatekeyalign)
- [updateKeyComment](ResultSetDataBuilder.md#updatekeycomment)
- [updateKeyName](ResultSetDataBuilder.md#updatekeyname)
- [updateKeyType](ResultSetDataBuilder.md#updatekeytype)
- [updateKeyWidth](ResultSetDataBuilder.md#updatekeywidth)
- [updateMeta](ResultSetDataBuilder.md#updatemeta)
- [createEmpty](ResultSetDataBuilder.md#createempty)
- [from](ResultSetDataBuilder.md#from)

## Constructors

### constructor

• **new ResultSetDataBuilder**(`keys`): [`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | (`string` \| [`RdhKey`](../modules.md#rdhkey))[] |

#### Returns

[`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Defined in

[resource/ResultSetDataBuilder.ts:233](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L233)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:231](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L231)

## Methods

### addRow

▸ **addRow**(`recordData`, `defaultMeta?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordData` | `any` |
| `defaultMeta?` | [`RdhRowMeta`](../modules.md#rdhrowmeta) |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:608](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L608)

___

### assign

▸ **assign**(`key`, `list`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `list` | `any` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:517](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L517)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:242](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L242)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:621](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L621)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:437](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L437)

___

### drop

▸ **drop**(`key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:507](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L507)

___

### fillnull

▸ **fillnull**(`how`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `how` | ``"mean"`` \| ``"median"`` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:633](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L633)

___

### hasAnyAnnotation

▸ **hasAnyAnnotation**(`types`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `types` | [`AnnotationType`](../modules.md#annotationtype)[] |

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:629](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L629)

___

### hasKey

▸ **hasKey**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:499](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L499)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:503](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L503)

___

### keynames

▸ **keynames**(`is_only_numeric_like?`): `string`[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `is_only_numeric_like` | `boolean` | `false` |

#### Returns

`string`[]

#### Defined in

[resource/ResultSetDataBuilder.ts:713](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L713)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:661](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L661)

___

### sampleCorrelation

▸ **sampleCorrelation**(`key_x`, `key_y`): `number`

The correlation is a measure of how correlated two datasets are, between -1 and 1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key_x` | `string` | first input |
| `key_y` | `string` | first input |

#### Returns

`number`

sample correlation

#### Defined in

[resource/ResultSetDataBuilder.ts:431](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L431)

___

### setSqlStatement

▸ **setSqlStatement**(`sqlStatement`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sqlStatement` | `string` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:625](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L625)

___

### setSummary

▸ **setSummary**(`«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `affectedRows?` | `number` |
| › `changedRows?` | `number` |
| › `elapsedTimeMilli` | `number` |
| › `insertId?` | `number` |
| › `selectedRows?` | `number` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:722](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L722)

___

### toCsv

▸ **toCsv**(`params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`ToStringParam`](../modules.md#tostringparam) |

#### Returns

`string`

#### Defined in

[resource/ResultSetDataBuilder.ts:592](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L592)

___

### toHtml

▸ **toHtml**(`params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`ToStringParam`](../modules.md#tostringparam) |

#### Returns

`string`

#### Defined in

[resource/ResultSetDataBuilder.ts:600](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L600)

___

### toMarkdown

▸ **toMarkdown**(`params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`ToStringParam`](../modules.md#tostringparam) |

#### Returns

`string`

#### Defined in

[resource/ResultSetDataBuilder.ts:596](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L596)

___

### toMatrixArray

▸ **toMatrixArray**(`key_names?`): `any`[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `key_names?` | `string`[] |

#### Returns

`any`[][]

#### Defined in

[resource/ResultSetDataBuilder.ts:574](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L574)

___

### toString

▸ **toString**(`params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`ToStringParam`](../modules.md#tostringparam) |

#### Returns

`string`

#### Defined in

[resource/ResultSetDataBuilder.ts:604](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L604)

___

### toVector

▸ **toVector**(`key_name`, `is_only_number?`): `any`[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key_name` | `string` | `undefined` |
| `is_only_number` | `boolean` | `false` |

#### Returns

`any`[]

#### Defined in

[resource/ResultSetDataBuilder.ts:559](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L559)

___

### updateKeyAlign

▸ **updateKeyAlign**(`keyName`, `align`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyName` | `string` |
| `align` | ``"left"`` \| ``"center"`` \| ``"right"`` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:284](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L284)

___

### updateKeyComment

▸ **updateKeyComment**(`keyName`, `comment`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyName` | `string` |
| `comment` | `string` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:252](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L252)

___

### updateKeyName

▸ **updateKeyName**(`keyName`, `newKeyName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyName` | `string` |
| `newKeyName` | `string` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:259](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L259)

___

### updateKeyType

▸ **updateKeyType**(`keyName`, `type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyName` | `string` |
| `type` | [`GeneralColumnType`](../modules.md#generalcolumntype) |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:246](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L246)

___

### updateKeyWidth

▸ **updateKeyWidth**(`keyName`, `width`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyName` | `string` |
| `width` | `number` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:277](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L277)

___

### updateMeta

▸ **updateMeta**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`RdhMeta`](../modules.md#rdhmeta) |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:291](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L291)

___

### createEmpty

▸ **createEmpty**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:297](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L297)

___

### from

▸ **from**(`list`, `options?`): [`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | `any` |
| `options?` | `Object` |
| `options.keyNames?` | `string`[] |

#### Returns

[`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Defined in

[resource/ResultSetDataBuilder.ts:310](https://github.com/l-v-yonsama/rdh/blob/8c1b9277335e277123f4e4b9e4b988b878ec6187/src/resource/ResultSetDataBuilder.ts#L310)
