/// <reference types="node" />
export declare function castTo<T>(o: unknown): T;
export declare const sleep: (ms: number) => Promise<void>;
export declare const toNum: (s: string | number | undefined) => number | undefined;
export declare const toBoolean: (s: Buffer | boolean | string | undefined) => boolean | undefined;
export declare const toDate: (s: string | number | Date | undefined) => Date | undefined;
export declare const toTime: (s: string | undefined) => string | undefined;
export declare const getUniqObjectKeys: (list: any[]) => string[];
