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

[resource/ResultSetDataBuilder.ts:233](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L233)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:231](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L231)

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

[resource/ResultSetDataBuilder.ts:602](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L602)

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

[resource/ResultSetDataBuilder.ts:511](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L511)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:242](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L242)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:615](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L615)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:431](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L431)

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

[resource/ResultSetDataBuilder.ts:501](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L501)

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

[resource/ResultSetDataBuilder.ts:627](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L627)

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

[resource/ResultSetDataBuilder.ts:623](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L623)

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

[resource/ResultSetDataBuilder.ts:493](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L493)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:497](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L497)

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

[resource/ResultSetDataBuilder.ts:707](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L707)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:655](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L655)

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

[resource/ResultSetDataBuilder.ts:425](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L425)

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

[resource/ResultSetDataBuilder.ts:619](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L619)

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

[resource/ResultSetDataBuilder.ts:716](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L716)

___

### toCsv

▸ **toCsv**(`params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`ToStringParam`](../modules.md#tostringparam) & \{ `delimiter?`: `string`  } |

#### Returns

`string`

#### Defined in

[resource/ResultSetDataBuilder.ts:586](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L586)

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

[resource/ResultSetDataBuilder.ts:594](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L594)

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

[resource/ResultSetDataBuilder.ts:590](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L590)

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

[resource/ResultSetDataBuilder.ts:568](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L568)

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

[resource/ResultSetDataBuilder.ts:598](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L598)

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

[resource/ResultSetDataBuilder.ts:553](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L553)

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

[resource/ResultSetDataBuilder.ts:278](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L278)

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

[resource/ResultSetDataBuilder.ts:246](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L246)

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

[resource/ResultSetDataBuilder.ts:253](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L253)

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

[resource/ResultSetDataBuilder.ts:271](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L271)

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

[resource/ResultSetDataBuilder.ts:285](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L285)

___

### createEmpty

▸ **createEmpty**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:291](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L291)

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

[resource/ResultSetDataBuilder.ts:304](https://github.com/l-v-yonsama/rdh/blob/ec19fd713ff8ed5857e9b12cdd955be16e7453f4/src/resource/ResultSetDataBuilder.ts#L304)
