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

[resource/ResultSetDataBuilder.ts:227](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L227)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:225](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L225)

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

[resource/ResultSetDataBuilder.ts:623](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L623)

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

[resource/ResultSetDataBuilder.ts:558](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L558)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:236](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L236)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:636](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L636)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:480](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L480)

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

[resource/ResultSetDataBuilder.ts:548](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L548)

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

[resource/ResultSetDataBuilder.ts:648](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L648)

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

[resource/ResultSetDataBuilder.ts:644](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L644)

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

[resource/ResultSetDataBuilder.ts:540](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L540)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:544](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L544)

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

[resource/ResultSetDataBuilder.ts:726](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L726)

___

### normalizeValuesByTypes

▸ **normalizeValuesByTypes**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:444](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L444)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:676](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L676)

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

[resource/ResultSetDataBuilder.ts:474](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L474)

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

[resource/ResultSetDataBuilder.ts:640](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L640)

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

[resource/ResultSetDataBuilder.ts:735](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L735)

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

[resource/ResultSetDataBuilder.ts:607](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L607)

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

[resource/ResultSetDataBuilder.ts:615](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L615)

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

[resource/ResultSetDataBuilder.ts:611](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L611)

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

[resource/ResultSetDataBuilder.ts:619](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L619)

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

[resource/ResultSetDataBuilder.ts:592](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L592)

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

[resource/ResultSetDataBuilder.ts:285](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L285)

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

[resource/ResultSetDataBuilder.ts:253](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L253)

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

[resource/ResultSetDataBuilder.ts:260](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L260)

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

[resource/ResultSetDataBuilder.ts:240](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L240)

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

[resource/ResultSetDataBuilder.ts:278](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L278)

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

[resource/ResultSetDataBuilder.ts:292](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L292)

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

[resource/ResultSetDataBuilder.ts:298](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L298)

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

[resource/ResultSetDataBuilder.ts:310](https://github.com/l-v-yonsama/rdh/blob/a80ceda67cdd7e794cc186e024fd49d84ffb69fa/src/resource/ResultSetDataBuilder.ts#L310)
