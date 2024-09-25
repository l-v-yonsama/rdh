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

[resource/ResultSetDataBuilder.ts:225](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L225)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:223](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L223)

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

[resource/ResultSetDataBuilder.ts:620](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L620)

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

[resource/ResultSetDataBuilder.ts:555](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L555)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:234](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L234)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:633](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L633)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:477](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L477)

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

[resource/ResultSetDataBuilder.ts:545](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L545)

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

[resource/ResultSetDataBuilder.ts:645](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L645)

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

[resource/ResultSetDataBuilder.ts:641](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L641)

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

[resource/ResultSetDataBuilder.ts:537](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L537)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:541](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L541)

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

[resource/ResultSetDataBuilder.ts:723](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L723)

___

### normalizeValuesByTypes

▸ **normalizeValuesByTypes**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:441](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L441)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:673](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L673)

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

[resource/ResultSetDataBuilder.ts:471](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L471)

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

[resource/ResultSetDataBuilder.ts:637](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L637)

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

[resource/ResultSetDataBuilder.ts:732](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L732)

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

[resource/ResultSetDataBuilder.ts:604](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L604)

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

[resource/ResultSetDataBuilder.ts:612](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L612)

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

[resource/ResultSetDataBuilder.ts:608](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L608)

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

[resource/ResultSetDataBuilder.ts:616](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L616)

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

[resource/ResultSetDataBuilder.ts:589](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L589)

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

[resource/ResultSetDataBuilder.ts:283](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L283)

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

[resource/ResultSetDataBuilder.ts:251](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L251)

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

[resource/ResultSetDataBuilder.ts:258](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L258)

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

[resource/ResultSetDataBuilder.ts:238](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L238)

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

[resource/ResultSetDataBuilder.ts:276](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L276)

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

[resource/ResultSetDataBuilder.ts:290](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L290)

___

### createEmpty

▸ **createEmpty**(`opt?`): [`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `Object` |
| `opt.message?` | `string` |

#### Returns

[`ResultSetDataBuilder`](ResultSetDataBuilder.md)

#### Defined in

[resource/ResultSetDataBuilder.ts:296](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L296)

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

[resource/ResultSetDataBuilder.ts:308](https://github.com/l-v-yonsama/rdh/blob/361426b9cc6c02a4b0f1f5d39eef308b25a14a52/src/resource/ResultSetDataBuilder.ts#L308)
