import { AnnotationType, CellAnnotation, GeneralColumnType, RdhKey, RdhMeta, RdhRow, RdhRowMeta, ResultSetData, RuleAnnotation, SampleGroupByClass, TableRuleDetail, ToStringParam } from "../types";
export declare function createRdhKey({ name, comment, type, width, required, align, meta, }: {
    name: string;
    comment?: string;
    type?: GeneralColumnType;
    width?: number;
    required?: boolean;
    align?: RdhKey["align"];
    meta?: RdhKey["meta"];
}): RdhKey;
export declare function isResultSetDataBuilder(item: any): item is ResultSetDataBuilder;
export declare class RowHelper {
    static getRuleEngineValues(row: RdhRow, keys: RdhKey[]): Record<string, any>;
    static pushAnnotation(row: RdhRow, key: string, annotation: CellAnnotation): void;
    static getFirstAnnotationOf<T extends CellAnnotation = CellAnnotation>(row: RdhRow, key: string, type: T["type"]): T | undefined;
    static filterAnnotationOf<T extends CellAnnotation = CellAnnotation>(row: RdhRow, type: T["type"]): {
        [key: string]: T[];
    };
    static filterAnnotationByKeyOf<T extends CellAnnotation = CellAnnotation>(row: RdhRow, key: string, type: T["type"]): T[];
    static clearAllAnnotations(row: RdhRow): void;
    static clearAnnotationByType(row: RdhRow, type: AnnotationType): void;
    static hasAnyAnnotation(row: RdhRow, types: AnnotationType[]): boolean;
    static hasAnnotation(row: RdhRow, type: AnnotationType): boolean;
    static hasRuleAnnotation(row: RdhRow, ruleDetail: TableRuleDetail): boolean;
    static getFirstRuleAnnotation(row: RdhRow, ruleDetail: TableRuleDetail): RuleAnnotation | undefined;
}
export declare class RdhHelper {
    static clearAllAnotations(rdh: ResultSetData): void;
}
export declare class ResultSetDataBuilder {
    readonly rs: ResultSetData;
    constructor(keys: Array<string | RdhKey>);
    build(): ResultSetData;
    updateKeyComment(keyName: string, comment: string): void;
    updateKeyName(keyName: string, newKeyName: string): void;
    updateKeyWidth(keyName: string, width: number): void;
    updateKeyAlign(keyName: string, align: RdhKey["align"]): void;
    updateMeta(params: RdhMeta): void;
    static createEmpty(): ResultSetData;
    static from(list: any, options?: {
        keyNames?: string[];
    }): ResultSetDataBuilder;
    sampleCorrelation(key_x: string, key_y: string): number;
    describe(): ResultSetData;
    splitRows(test_percentage: number, with_shuffle?: boolean): [ResultSetData, ResultSetData];
    sampleXKeysGroupByClass(numExamplesPerClass: number, xKeys: string[], clazzKey: string, shuffle?: boolean): SampleGroupByClass;
    nextXYBatch(batch_size: number, xKeys: string[], yKey: string): [any[][], any[]];
    hasKey(key: string): boolean;
    hasKeyComment(): boolean;
    drop(key: string): void;
    assign(key: string, list: any): void;
    assignFromDictionary(new_key: string, existing_key: string, dictionary: string[]): void;
    toVector(key_name: string, is_only_number?: boolean): Array<any>;
    toMatrixArray(key_names?: string[]): Array<Array<any>>;
    toCsv(params?: ToStringParam & {
        delimiter?: string;
    }): string;
    toMarkdown(params?: ToStringParam): string;
    toHtml(params?: ToStringParam): string;
    toString(params?: ToStringParam): string;
    addRow(recordData: any, defaultMeta?: RdhRowMeta): void;
    clearRows(): void;
    setSqlStatement(sqlStatement: string): void;
    hasAnyAnnotation(types: AnnotationType[]): boolean;
    fillnull(how: "mean" | "median"): void;
    resetKeyTypeByRows(): void;
    keynames(is_only_numeric_like?: boolean): string[];
    setSummary({ elapsedTimeMilli, selectedRows, affectedRows, insertId, changedRows, }: {
        elapsedTimeMilli: number;
        selectedRows?: number;
        affectedRows?: number;
        insertId?: number;
        changedRows?: number;
    }): void;
    private toShortString;
    private toCsvString;
    private toMarkdownString;
    private toHtmlString;
    private resolveCodeLabel;
    private resolveRuleMarkers;
    private createRuleMarkerLegend;
    private initToStringParam;
}
