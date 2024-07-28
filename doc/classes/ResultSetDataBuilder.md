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

[resource/ResultSetDataBuilder.ts:234](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L234)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:232](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L232)

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

[resource/ResultSetDataBuilder.ts:614](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L614)

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

[resource/ResultSetDataBuilder.ts:531](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L531)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:243](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L243)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:627](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L627)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:453](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L453)

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

[resource/ResultSetDataBuilder.ts:521](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L521)

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

[resource/ResultSetDataBuilder.ts:639](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L639)

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

[resource/ResultSetDataBuilder.ts:635](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L635)

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

[resource/ResultSetDataBuilder.ts:513](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L513)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:517](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L517)

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

[resource/ResultSetDataBuilder.ts:719](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L719)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:667](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L667)

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

[resource/ResultSetDataBuilder.ts:447](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L447)

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

[resource/ResultSetDataBuilder.ts:631](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L631)

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

[resource/ResultSetDataBuilder.ts:728](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L728)

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

[resource/ResultSetDataBuilder.ts:598](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L598)

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

[resource/ResultSetDataBuilder.ts:606](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L606)

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

[resource/ResultSetDataBuilder.ts:602](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L602)

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

[resource/ResultSetDataBuilder.ts:580](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L580)

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

[resource/ResultSetDataBuilder.ts:610](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L610)

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

[resource/ResultSetDataBuilder.ts:565](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L565)

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

[resource/ResultSetDataBuilder.ts:285](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L285)

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

[resource/ResultSetDataBuilder.ts:253](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L253)

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

[resource/ResultSetDataBuilder.ts:260](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L260)

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

[resource/ResultSetDataBuilder.ts:247](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L247)

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

[resource/ResultSetDataBuilder.ts:278](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L278)

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

[resource/ResultSetDataBuilder.ts:292](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L292)

___

### createEmpty

▸ **createEmpty**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:298](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L298)

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

[resource/ResultSetDataBuilder.ts:311](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L311)
