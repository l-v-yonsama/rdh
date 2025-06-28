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

[resource/ResultSetDataBuilder.ts:211](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L211)

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

[resource/ResultSetDataBuilder.ts:217](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L217)

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

[resource/ResultSetDataBuilder.ts:199](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L199)

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

[resource/ResultSetDataBuilder.ts:183](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L183)

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

[resource/ResultSetDataBuilder.ts:169](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L169)

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

[resource/ResultSetDataBuilder.ts:260](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L260)

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

[resource/ResultSetDataBuilder.ts:141](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L141)

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

[resource/ResultSetDataBuilder.ts:246](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L246)

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

[resource/ResultSetDataBuilder.ts:235](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L235)

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

[resource/ResultSetDataBuilder.ts:250](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L250)

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

[resource/ResultSetDataBuilder.ts:158](https://github.com/l-v-yonsama/rdh/blob/f229ac3f5603e786b26a558c60a9b050b0795c83/src/resource/ResultSetDataBuilder.ts#L158)
