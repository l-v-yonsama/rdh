import type { ContentTypeInfo } from "./ContentTypeInfo";
export declare const AnnotationTypeConst: {
    readonly Del: "Del";
    readonly Upd: "Upd";
    readonly Add: "Add";
    readonly Err: "Err";
    readonly Lnt: "Lnt";
    readonly Stl: "Stl";
    readonly Rul: "Rul";
    readonly Cod: "Cod";
    readonly Fil: "Fil";
    readonly CIN: "Cin";
};
export type AnnotationType = (typeof AnnotationTypeConst)[keyof typeof AnnotationTypeConst];
export type CellAnnotation = DeleteAnnotation | AddAnnotation | UpdateAnnotation | RuleAnnotation | LintAnnotation | StyleAnnotation | CodeResolvedAnnotation | FileAnnotation | ChangeInNumbersAnnotation;
export type BaseCellAnnotation<T = AnnotationType, U = any> = {
    type: T;
    values?: U;
};
export type DeleteAnnotation = BaseCellAnnotation<"Del">;
export type AddAnnotation = BaseCellAnnotation<"Add">;
export type UpdateAnnotation = BaseCellAnnotation<"Upd", {
    otherValue: any;
}>;
export type RuleAnnotation = BaseCellAnnotation<"Rul", {
    name: string;
    message: string;
    conditionValues: {
        [key: string]: any;
    };
}>;
export type CodeResolvedAnnotation = BaseCellAnnotation<"Cod", {
    label: string;
    isUndefined: boolean;
}>;
export type LintAnnotation = BaseCellAnnotation<"Lnt", {
    ruleId: string;
    message: string;
    fix: string;
}>;
export type StyleAnnotation = BaseCellAnnotation<"Stl", {
    f?: {
        s: number;
        n: string;
    };
    a?: {
        h?: string;
        v?: string;
    };
    b?: string;
    fmt?: string;
}>;
export type FileAnnotation = BaseCellAnnotation<"Fil", {
    name: string;
    size: number;
    lastModified: Date;
    contentTypeInfo: ContentTypeInfo;
    encoding?: string;
    downloadUrl?: string;
}>;
export type ChangeInNumbersAnnotation = BaseCellAnnotation<"Cin", {
    value: number;
}>;
