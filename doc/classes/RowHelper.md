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

[resource/ResultSetDataBuilder.ts:207](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L207)

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

[resource/ResultSetDataBuilder.ts:213](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L213)

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

[resource/ResultSetDataBuilder.ts:195](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L195)

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

[resource/ResultSetDataBuilder.ts:179](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L179)

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

[resource/ResultSetDataBuilder.ts:165](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L165)

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

[resource/ResultSetDataBuilder.ts:256](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L256)

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

[resource/ResultSetDataBuilder.ts:137](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L137)

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

[resource/ResultSetDataBuilder.ts:242](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L242)

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

[resource/ResultSetDataBuilder.ts:231](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L231)

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

[resource/ResultSetDataBuilder.ts:246](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L246)

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

[resource/ResultSetDataBuilder.ts:154](https://github.com/l-v-yonsama/rdh/blob/9275420e33b736448182043d61a97d3c35f1a717/src/resource/ResultSetDataBuilder.ts#L154)
