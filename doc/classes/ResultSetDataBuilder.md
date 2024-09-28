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
- [normalizeValuesByTypes](ResultSetDataBuilder.md#normalizevaluesbytypes)
- [resetKeyTypeByRows](ResultSetDataBuilder.md#resetkeytypebyrows)
- [sampleCorrelation](ResultSetDataBuilder.md#samplecorrelation)
- [setSqlStatement](ResultSetDataBuilder.md#setsqlstatement)
- [setSummary](ResultSetDataBuilder.md#setsummary)
- [toCsv](ResultSetDataBuilder.md#tocsv)
- [toHtml](ResultSetDataBuilder.md#tohtml)
- [toMarkdown](ResultSetDataBuilder.md#tomarkdown)
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

[resource/ResultSetDataBuilder.ts:225](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L225)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:223](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L223)

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

[resource/ResultSetDataBuilder.ts:621](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L621)

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

[resource/ResultSetDataBuilder.ts:556](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L556)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:234](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L234)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:634](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L634)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:478](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L478)

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

[resource/ResultSetDataBuilder.ts:546](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L546)

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

[resource/ResultSetDataBuilder.ts:646](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L646)

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

[resource/ResultSetDataBuilder.ts:642](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L642)

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

[resource/ResultSetDataBuilder.ts:538](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L538)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:542](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L542)

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

[resource/ResultSetDataBuilder.ts:724](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L724)

___

### normalizeValuesByTypes

▸ **normalizeValuesByTypes**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:442](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L442)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:674](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L674)

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

[resource/ResultSetDataBuilder.ts:472](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L472)

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

[resource/ResultSetDataBuilder.ts:638](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L638)

___

### setSummary

▸ **setSummary**(`«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `affectedRows?` | `number` |
| › `capacityUnits?` | `number` |
| › `changedRows?` | `number` |
| › `elapsedTimeMilli` | `number` |
| › `insertId?` | `number` |
| › `selectedRows?` | `number` |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:733](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L733)

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

[resource/ResultSetDataBuilder.ts:605](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L605)

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

[resource/ResultSetDataBuilder.ts:613](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L613)

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

[resource/ResultSetDataBuilder.ts:609](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L609)

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

[resource/ResultSetDataBuilder.ts:617](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L617)

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

[resource/ResultSetDataBuilder.ts:590](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L590)

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

[resource/ResultSetDataBuilder.ts:283](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L283)

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

[resource/ResultSetDataBuilder.ts:251](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L251)

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

[resource/ResultSetDataBuilder.ts:258](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L258)

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

[resource/ResultSetDataBuilder.ts:238](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L238)

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

[resource/ResultSetDataBuilder.ts:276](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L276)

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

[resource/ResultSetDataBuilder.ts:290](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L290)

___

### createEmpty

▸ **createEmpty**(`opt?`): [`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `Object` |
| `opt.noRecordsReason?` | `string` |

#### Returns

[`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Defined in

[resource/ResultSetDataBuilder.ts:296](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L296)

___

### from

▸ **from**(`list`, `options?`): [`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | `any` |
| `options?` | `Object` |
| `options.firstRowAsTitle?` | `boolean` |

#### Returns

[`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Defined in

[resource/ResultSetDataBuilder.ts:308](https://github.com/l-v-yonsama/rdh/blob/81be04d16c7a040113817d0725e6c7e36b39f274/src/resource/ResultSetDataBuilder.ts#L308)
