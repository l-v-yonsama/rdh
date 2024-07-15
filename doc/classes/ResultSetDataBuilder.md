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
- [assignFromDictionary](ResultSetDataBuilder.md#assignfromdictionary)
- [build](ResultSetDataBuilder.md#build)
- [clearRows](ResultSetDataBuilder.md#clearrows)
- [describe](ResultSetDataBuilder.md#describe)
- [drop](ResultSetDataBuilder.md#drop)
- [fillnull](ResultSetDataBuilder.md#fillnull)
- [hasAnyAnnotation](ResultSetDataBuilder.md#hasanyannotation)
- [hasKey](ResultSetDataBuilder.md#haskey)
- [hasKeyComment](ResultSetDataBuilder.md#haskeycomment)
- [keynames](ResultSetDataBuilder.md#keynames)
- [nextXYBatch](ResultSetDataBuilder.md#nextxybatch)
- [resetKeyTypeByRows](ResultSetDataBuilder.md#resetkeytypebyrows)
- [sampleCorrelation](ResultSetDataBuilder.md#samplecorrelation)
- [sampleXKeysGroupByClass](ResultSetDataBuilder.md#samplexkeysgroupbyclass)
- [setSqlStatement](ResultSetDataBuilder.md#setsqlstatement)
- [setSummary](ResultSetDataBuilder.md#setsummary)
- [splitRows](ResultSetDataBuilder.md#splitrows)
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

[resource/ResultSetDataBuilder.ts:244](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L244)

## Properties

### rs

• `Readonly` **rs**: [`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:242](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L242)

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

[resource/ResultSetDataBuilder.ts:1369](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1369)

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

[resource/ResultSetDataBuilder.ts:641](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L641)

___

### assignFromDictionary

▸ **assignFromDictionary**(`new_key`, `existing_key`, `dictionary`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `new_key` | `string` |
| `existing_key` | `string` |
| `dictionary` | `string`[] |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:683](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L683)

___

### build

▸ **build**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:253](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L253)

___

### clearRows

▸ **clearRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:1382](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1382)

___

### describe

▸ **describe**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:442](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L442)

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

[resource/ResultSetDataBuilder.ts:631](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L631)

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

[resource/ResultSetDataBuilder.ts:1394](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1394)

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

[resource/ResultSetDataBuilder.ts:1390](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1390)

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

[resource/ResultSetDataBuilder.ts:623](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L623)

___

### hasKeyComment

▸ **hasKeyComment**(): `boolean`

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:627](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L627)

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

[resource/ResultSetDataBuilder.ts:1474](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1474)

___

### nextXYBatch

▸ **nextXYBatch**(`batch_size`, `xKeys`, `yKey`): [`any`[][], `any`[]]

#### Parameters

| Name | Type |
| :------ | :------ |
| `batch_size` | `number` |
| `xKeys` | `string`[] |
| `yKey` | `string` |

#### Returns

[`any`[][], `any`[]]

#### Defined in

[resource/ResultSetDataBuilder.ts:590](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L590)

___

### resetKeyTypeByRows

▸ **resetKeyTypeByRows**(): `void`

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:1422](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1422)

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

[resource/ResultSetDataBuilder.ts:436](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L436)

___

### sampleXKeysGroupByClass

▸ **sampleXKeysGroupByClass**(`numExamplesPerClass`, `xKeys`, `clazzKey`, `shuffle?`): [`SampleGroupByClass`](../modules.md#samplegroupbyclass)

Sample a data from each class of this resutlsets.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `numExamplesPerClass` | `number` | `undefined` | Number of examples per class. |
| `xKeys` | `string`[] | `undefined` | - |
| `clazzKey` | `string` | `undefined` | - |
| `shuffle` | `boolean` | `false` | - |

#### Returns

[`SampleGroupByClass`](../modules.md#samplegroupbyclass)

#### Defined in

[resource/ResultSetDataBuilder.ts:537](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L537)

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

[resource/ResultSetDataBuilder.ts:1386](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1386)

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

[resource/ResultSetDataBuilder.ts:1483](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1483)

___

### splitRows

▸ **splitRows**(`test_percentage`, `with_shuffle?`): [[`ResultSetData`](../modules.md#resultsetdata), [`ResultSetData`](../modules.md#resultsetdata)]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `test_percentage` | `number` | `undefined` |
| `with_shuffle` | `boolean` | `false` |

#### Returns

[[`ResultSetData`](../modules.md#resultsetdata), [`ResultSetData`](../modules.md#resultsetdata)]

#### Defined in

[resource/ResultSetDataBuilder.ts:504](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L504)

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

[resource/ResultSetDataBuilder.ts:743](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L743)

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

[resource/ResultSetDataBuilder.ts:1053](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1053)

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

[resource/ResultSetDataBuilder.ts:889](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L889)

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

[resource/ResultSetDataBuilder.ts:725](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L725)

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

[resource/ResultSetDataBuilder.ts:1230](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L1230)

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

[resource/ResultSetDataBuilder.ts:710](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L710)

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

[resource/ResultSetDataBuilder.ts:289](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L289)

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

[resource/ResultSetDataBuilder.ts:257](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L257)

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

[resource/ResultSetDataBuilder.ts:264](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L264)

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

[resource/ResultSetDataBuilder.ts:282](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L282)

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

[resource/ResultSetDataBuilder.ts:296](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L296)

___

### createEmpty

▸ **createEmpty**(): [`ResultSetData`](../modules.md#resultsetdata)

#### Returns

[`ResultSetData`](../modules.md#resultsetdata)

#### Defined in

[resource/ResultSetDataBuilder.ts:302](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L302)

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

[resource/ResultSetDataBuilder.ts:315](https://github.com/l-v-yonsama/rdh/blob/967e20c40a0481062b3a65a0ad7047e6417e1de1/src/resource/ResultSetDataBuilder.ts#L315)
