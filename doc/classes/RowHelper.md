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

[resource/ResultSetDataBuilder.ts:151](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L151)

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

[resource/ResultSetDataBuilder.ts:157](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L157)

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

[resource/ResultSetDataBuilder.ts:139](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L139)

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

[resource/ResultSetDataBuilder.ts:123](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L123)

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

[resource/ResultSetDataBuilder.ts:109](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L109)

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

[resource/ResultSetDataBuilder.ts:211](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L211)

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

[resource/ResultSetDataBuilder.ts:81](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L81)

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

[resource/ResultSetDataBuilder.ts:197](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L197)

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

[resource/ResultSetDataBuilder.ts:186](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L186)

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

[resource/ResultSetDataBuilder.ts:201](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L201)

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

[resource/ResultSetDataBuilder.ts:98](https://github.com/l-v-yonsama/rdh/blob/2c7e91758907fd25841a224f8d6d22a269cd601c/src/resource/ResultSetDataBuilder.ts#L98)
