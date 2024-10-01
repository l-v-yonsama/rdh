[@l-v-yonsama/rdh](../README.md) / [Exports](../modules.md) / RowHelper

# Class: RowHelper

## Table of contents

### Constructors

- [constructor](RowHelper.md#constructor)

### Methods

- [clearAllAnnotations](RowHelper.md#clearallannotations)
- [clearAnnotationByType](RowHelper.md#clearannotationbytype)
- [filterAnnotationByKeyOf](RowHelper.md#filterannotationbykeyof)
- [filterAnnotationOf](RowHelper.md#filterannotationof)
- [getFirstAnnotationOf](RowHelper.md#getfirstannotationof)
- [getFirstRuleAnnotation](RowHelper.md#getfirstruleannotation)
- [getRuleEngineValues](RowHelper.md#getruleenginevalues)
- [hasAnnotation](RowHelper.md#hasannotation)
- [hasAnyAnnotation](RowHelper.md#hasanyannotation)
- [hasRuleAnnotation](RowHelper.md#hasruleannotation)
- [pushAnnotation](RowHelper.md#pushannotation)

## Constructors

### constructor

• **new RowHelper**(): [`RowHelper`](RowHelper.md)

#### Returns

[`RowHelper`](RowHelper.md)

## Methods

### clearAllAnnotations

▸ **clearAllAnnotations**(`row`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:153](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L153)

___

### clearAnnotationByType

▸ **clearAnnotationByType**(`row`, `type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `type` | [`AnnotationType`](../modules.md#annotationtype) |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:159](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L159)

___

### filterAnnotationByKeyOf

▸ **filterAnnotationByKeyOf**\<`T`\>(`row`, `key`, `type`): `T`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CellAnnotation`](../modules.md#cellannotation) = [`CellAnnotation`](../modules.md#cellannotation) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `key` | `string` |
| `type` | `T`[``"type"``] |

#### Returns

`T`[]

#### Defined in

[resource/ResultSetDataBuilder.ts:141](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L141)

___

### filterAnnotationOf

▸ **filterAnnotationOf**\<`T`\>(`row`, `type`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CellAnnotation`](../modules.md#cellannotation) = [`CellAnnotation`](../modules.md#cellannotation) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `type` | `T`[``"type"``] |

#### Returns

`Object`

#### Defined in

[resource/ResultSetDataBuilder.ts:125](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L125)

___

### getFirstAnnotationOf

▸ **getFirstAnnotationOf**\<`T`\>(`row`, `key`, `type`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CellAnnotation`](../modules.md#cellannotation) = [`CellAnnotation`](../modules.md#cellannotation) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `key` | `string` |
| `type` | `T`[``"type"``] |

#### Returns

`T`

#### Defined in

[resource/ResultSetDataBuilder.ts:111](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L111)

___

### getFirstRuleAnnotation

▸ **getFirstRuleAnnotation**(`row`, `ruleDetail`): [`RuleAnnotation`](../modules.md#ruleannotation)

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `ruleDetail` | [`TableRuleDetail`](../modules.md#tableruledetail) |

#### Returns

[`RuleAnnotation`](../modules.md#ruleannotation)

#### Defined in

[resource/ResultSetDataBuilder.ts:202](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L202)

___

### getRuleEngineValues

▸ **getRuleEngineValues**(`row`, `keys`): `Record`\<`string`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `keys` | [`RdhKey`](../modules.md#rdhkey)[] |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[resource/ResultSetDataBuilder.ts:83](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L83)

___

### hasAnnotation

▸ **hasAnnotation**(`row`, `type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `type` | [`AnnotationType`](../modules.md#annotationtype) |

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:188](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L188)

___

### hasAnyAnnotation

▸ **hasAnyAnnotation**(`row`, `types`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `types` | [`AnnotationType`](../modules.md#annotationtype)[] |

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:177](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L177)

___

### hasRuleAnnotation

▸ **hasRuleAnnotation**(`row`, `ruleDetail`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `ruleDetail` | [`TableRuleDetail`](../modules.md#tableruledetail) |

#### Returns

`boolean`

#### Defined in

[resource/ResultSetDataBuilder.ts:192](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L192)

___

### pushAnnotation

▸ **pushAnnotation**(`row`, `key`, `annotation`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | [`RdhRow`](../modules.md#rdhrow) |
| `key` | `string` |
| `annotation` | [`CellAnnotation`](../modules.md#cellannotation) |

#### Returns

`void`

#### Defined in

[resource/ResultSetDataBuilder.ts:100](https://github.com/l-v-yonsama/rdh/blob/b529670111c3bd6e7b806c5e87a3bda6e59a6602/src/resource/ResultSetDataBuilder.ts#L100)
