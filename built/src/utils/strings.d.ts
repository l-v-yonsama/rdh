export declare const toLines: (s: string) => string[];
export declare const eolToSpace: (s: string) => string;
export declare const abbr: (s: string | undefined, len?: number) => string | undefined;
export declare const equalsIgnoreCase: (s1: string, s2: string) => boolean;
export declare const containsIgnoreCase: (keyword: string, list: (string | undefined)[]) => boolean;
export default function isDate(value: unknown): value is Date;
export declare const escapeHtml: (s: string) => string;
