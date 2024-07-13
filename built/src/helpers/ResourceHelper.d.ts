import { DiffResult, DiffToUndoChangesResult, ResultSetData } from "../types";
export declare const diff: (rdh1: ResultSetData, rdh2: ResultSetData) => DiffResult;
export declare const diffToUndoChanges: (rdh1: ResultSetData, rdh2: ResultSetData) => DiffToUndoChangesResult;
