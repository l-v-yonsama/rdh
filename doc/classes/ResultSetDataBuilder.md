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

[resource/ResultSetDataBuilder.ts:283](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L283)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:281](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L281)

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

[resource/ResultSetDataBuilder.ts:679](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L679)

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

[resource/ResultSetDataBuilder.ts:614](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L614)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:292](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L292)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:692](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L692)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:536](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L536)

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

[resource/ResultSetDataBuilder.ts:604](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L604)

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

[resource/ResultSetDataBuilder.ts:704](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L704)

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

[resource/ResultSetDataBuilder.ts:700](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L700)

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

[resource/ResultSetDataBuilder.ts:596](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L596)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:600](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L600)

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

[resource/ResultSetDataBuilder.ts:782](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L782)

___

### normalizeValuesByTypes

▸ **normalizeValuesByTypes**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:500](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L500)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:732](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L732)

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

[resource/ResultSetDataBuilder.ts:530](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L530)

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

[resource/ResultSetDataBuilder.ts:696](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L696)

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

[resource/ResultSetDataBuilder.ts:791](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L791)

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

[resource/ResultSetDataBuilder.ts:663](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L663)

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

[resource/ResultSetDataBuilder.ts:671](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L671)

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

[resource/ResultSetDataBuilder.ts:667](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L667)

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

[resource/ResultSetDataBuilder.ts:675](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L675)

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

[resource/ResultSetDataBuilder.ts:648](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L648)

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

[resource/ResultSetDataBuilder.ts:341](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L341)

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

[resource/ResultSetDataBuilder.ts:309](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L309)

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

[resource/ResultSetDataBuilder.ts:316](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L316)

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

[resource/ResultSetDataBuilder.ts:296](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L296)

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

[resource/ResultSetDataBuilder.ts:334](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L334)

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

[resource/ResultSetDataBuilder.ts:348](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L348)

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

[resource/ResultSetDataBuilder.ts:354](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L354)

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

[resource/ResultSetDataBuilder.ts:366](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L366)
