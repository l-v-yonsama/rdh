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

[resource/ResultSetDataBuilder.ts:290](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L290)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:288](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L288)

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

[resource/ResultSetDataBuilder.ts:717](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L717)

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

[resource/ResultSetDataBuilder.ts:652](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L652)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:299](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L299)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:730](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L730)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:574](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L574)

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

[resource/ResultSetDataBuilder.ts:642](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L642)

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

[resource/ResultSetDataBuilder.ts:742](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L742)

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

[resource/ResultSetDataBuilder.ts:738](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L738)

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

[resource/ResultSetDataBuilder.ts:634](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L634)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:638](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L638)

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

[resource/ResultSetDataBuilder.ts:820](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L820)

___

### normalizeValuesByTypes

▸ **normalizeValuesByTypes**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:538](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L538)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:770](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L770)

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

[resource/ResultSetDataBuilder.ts:568](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L568)

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

[resource/ResultSetDataBuilder.ts:734](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L734)

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

[resource/ResultSetDataBuilder.ts:829](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L829)

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

[resource/ResultSetDataBuilder.ts:701](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L701)

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

[resource/ResultSetDataBuilder.ts:709](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L709)

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

[resource/ResultSetDataBuilder.ts:705](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L705)

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

[resource/ResultSetDataBuilder.ts:713](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L713)

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

[resource/ResultSetDataBuilder.ts:686](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L686)

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

[resource/ResultSetDataBuilder.ts:348](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L348)

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

[resource/ResultSetDataBuilder.ts:316](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L316)

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

[resource/ResultSetDataBuilder.ts:323](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L323)

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

[resource/ResultSetDataBuilder.ts:303](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L303)

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

[resource/ResultSetDataBuilder.ts:341](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L341)

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

[resource/ResultSetDataBuilder.ts:355](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L355)

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

[resource/ResultSetDataBuilder.ts:361](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L361)

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

[resource/ResultSetDataBuilder.ts:373](https://github.com/l-v-yonsama/rdh/blob/132f6b315c4a1fd5dc50a7ee702b920edaa278f1/src/resource/ResultSetDataBuilder.ts#L373)
