import type { RdhRow, RdhRowMeta, ResultSetData } from "../types";
import { toDate } from "../utils";
import { isBinaryLike, isDateTimeOrDate } from "./GeneralColumnUtil";

/**
 * cloneRdhValue()が複製できる値の種類。ResultSetData(RdhKey/RdhRow/RdhMeta/
 * CellAnnotationを含む)が実際に持ちうる値の型はこれで尽くされる想定:
 * プリミティブ、Date、Buffer、ArrayBuffer、TypedArray/DataView、Map、Set、
 * Array、プレーンオブジェクト。
 */
type Cloneable = WeakMap<object, unknown>;

/**
 * RDHが実際に扱う値を対象にしたディープクローン。
 *
 * `JSON.parse(JSON.stringify(...))` は手軽だが、次の値を静かに破壊するか例外を
 * 投げる: NaN/Infinity/-Infinity → null、-0 → 0、bigint → TypeError、
 * Date → ISO文字列、Buffer/Set/Map → 中身の失われたプレーンオブジェクト。
 * これらはGC.BIGINT・数値型・日付型・バイナリ型・STRING_SET/NUMERIC_SET/
 * BINARY_SET型として実際に扱われうる値であり、`ResultSetDataBuilder.from()`
 * (ひいては非破壊化されたdiff系関数の比較・戻り値)の正しさに直結する。
 *
 * 対応する型ごとに明示的な分岐を持ち、対応外のクラスインスタンス
 * (RegExp、Error、独自クラス等)は`{}`へ静かに壊すのではなく例外を投げる。
 * db-notebook/db-driversを確認した限り、RDHの値・アノテーション・meta
 * (JSON列の値も含む)はすべてここで挙げた型に収まる。未対応の値が来た
 * 場合に静かに壊すより、ここで例外にして呼び出し側に気づかせる方が安全
 * という判断による。
 *
 * 循環参照・同一オブジェクトの複数参照はWeakMapで検出し、無限再帰を避け、
 * 複製後も参照関係を保つ。
 */
export function cloneRdhValue<T>(value: T): T {
  return cloneValue(value, new WeakMap());
}

function cloneValue<T>(value: T, seen: Cloneable): T {
  if (value === null || typeof value !== "object") {
    // string/number(NaN・Infinity・-0含む)/boolean/null/undefined/bigint/
    // functionはイミュータブルまたは複製不要なのでそのまま返す。
    return value;
  }

  const alreadyCloned = seen.get(value);
  if (alreadyCloned !== undefined) {
    return alreadyCloned as T;
  }

  if (value instanceof Date) {
    const cloned = new Date(value.getTime());
    seen.set(value, cloned);
    return cloned as T;
  }
  if (Buffer.isBuffer(value)) {
    const cloned = Buffer.from(value);
    seen.set(value, cloned);
    return cloned as T;
  }
  if (value instanceof ArrayBuffer) {
    const cloned = value.slice(0);
    seen.set(value, cloned);
    return cloned as T;
  }
  if (ArrayBuffer.isView(value)) {
    // Uint8Array等のTypedArray、およびDataView。Bufferは上のBuffer.isBuffer()
    // 分岐で先に処理されるためここには来ない。
    // DataViewは元のbuffer全体ではなく、byteOffset/byteLengthで指定された
    // 範囲だけを見るビューなので、複製後もその範囲を保つ必要がある
    // (buffer.slice(0)だけでは常にoffset=0・長さ=buffer全体になってしまう)。
    const cloned = isDataView(value)
      ? new DataView(value.buffer.slice(0), value.byteOffset, value.byteLength)
      : cloneTypedArray(value);
    seen.set(value, cloned);
    return cloned as T;
  }
  if (value instanceof Map) {
    const cloned = new Map<unknown, unknown>();
    seen.set(value, cloned);
    value.forEach((v, k) => {
      cloned.set(cloneValue(k, seen), cloneValue(v, seen));
    });
    return cloned as T;
  }
  if (value instanceof Set) {
    const cloned = new Set<unknown>();
    seen.set(value, cloned);
    value.forEach((item) => {
      cloned.add(cloneValue(item, seen));
    });
    return cloned as T;
  }
  if (Array.isArray(value)) {
    const cloned: unknown[] = [];
    seen.set(value, cloned);
    value.forEach((item, idx) => {
      cloned[idx] = cloneValue(item, seen);
    });
    return cloned as T;
  }
  if (isPlainObject(value)) {
    const cloned: Record<string, unknown> = {};
    seen.set(value, cloned);
    Object.entries(value).forEach(([key, child]) => {
      cloned[key] = cloneValue(child, seen);
    });
    return cloned as T;
  }

  const ctorName =
    (value as { constructor?: { name?: string } })?.constructor?.name ??
    "unknown";
  throw new Error(
    `cloneRdhValue: unsupported value type for cloning (constructor: ${ctorName}). ` +
      "Supported types are: Date, Buffer, ArrayBuffer, TypedArray/DataView, Map, Set, Array, and plain objects."
  );
}

function isDataView(value: ArrayBufferView): value is DataView {
  return value instanceof DataView;
}

function cloneTypedArray<T extends ArrayBufferView>(value: T): T {
  const TypedArrayCtor = value.constructor as new (src: T) => T;
  return new TypedArrayCtor(value);
}

/** prototypeを見て「素のオブジェクトリテラル相当」かどうかを判定する。 */
function isPlainObject(value: object): value is Record<string, unknown> {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * JSON経由で一度平坦化された値(Dateが"2024-01-01T00:00:00.000Z"のような
 * 文字列、Bufferが{type:"Buffer",data:[...]}のようなプレーンオブジェクト)
 * を、列の宣言型(dateKeys/binaryKeys)に基づいて実際のDate/Bufferへ復元する。
 *
 * cloneRdhValueは値の「入れ物」の型(Date/Buffer/プレーンオブジェクト等)を
 * 保つだけで、プレーンオブジェクトの中身がBufferの平坦化表現かどうかまでは
 * 判断しない。この関数は、ResultSetDataBuilder.from()に渡された引数自体が
 * 既にJSONを経由して平坦化されていたケース(例: VS Code拡張のメッセージ
 * 境界やディスクへの保存を経由した場合)のための後方互換の復元処理。
 * 値が既に本物のDate/Bufferであれば何もしない(素通りする)。
 */
export function rehydrateSerializedRowValues(
  values: Record<string, unknown>,
  dateKeys: string[],
  binaryKeys: string[]
): void {
  for (const dateKey of dateKeys) {
    const v = values[dateKey];
    values[dateKey] = v === null || v === undefined ? v : toDate(v as any);
  }
  for (const binaryKey of binaryKeys) {
    const v = values[binaryKey];
    if (isSerializedBuffer(v)) {
      values[binaryKey] = Buffer.from(v.data);
    }
  }
}

/**
 * rehydrateSerializedRowValuesと同様の復元を、セルアノテーション(Upd.otherValue、
 * Fil.lastModified)の値に対して行う。
 */
export function rehydrateSerializedAnnotationValues(
  meta: RdhRowMeta,
  dateKeys: string[],
  binaryKeys: string[]
): void {
  Object.keys(meta).forEach((columnName) => {
    meta[columnName].forEach((annotation) => {
      if (annotation.type === "Upd" && annotation.values) {
        const otherValue = annotation.values.otherValue;
        if (otherValue === null || otherValue === undefined) {
          return;
        }
        if (dateKeys.includes(columnName)) {
          annotation.values.otherValue = toDate(otherValue);
        } else if (binaryKeys.includes(columnName) && isSerializedBuffer(otherValue)) {
          annotation.values.otherValue = Buffer.from(otherValue.data);
        }
      } else if (annotation.type === "Fil" && annotation.values) {
        const lastModified = annotation.values.lastModified;
        if (lastModified) {
          annotation.values.lastModified = toDate(lastModified);
        }
      }
    });
  });
}

function isSerializedBuffer(
  v: unknown
): v is { type: "Buffer"; data: number[] } {
  return (
    !!v &&
    typeof v === "object" &&
    (v as any)["type"] === "Buffer" &&
    Array.isArray((v as any)["data"])
  );
}

/**
 * ResultSetData(またはResultSetDataBuilder.rs)を非破壊的に複製する。
 *
 * 戻り値は独立したプレーンなResultSetDataであり、ResultSetDataBuilderの
 * インスタンスではない(ResultSetDataBuilder.from()側でBuilderへ包む)。
 * これにより、このファイルはResultSetDataBuilderクラスに依存しない
 * (循環参照を避ける)。
 */
export function cloneFromRdh(obj: ResultSetData): ResultSetData {
  const plainObj: ResultSetData = cloneRdhValue(obj);

  const keyNames = plainObj.keys.map((k) => k.name);
  const dateKeys = plainObj.keys
    .filter((k) => isDateTimeOrDate(k.type))
    .map((k) => k.name);
  const binaryKeys = plainObj.keys
    .filter((k) => isBinaryLike(k.type))
    .map((k) => k.name);

  const rows: RdhRow[] = plainObj.rows.map((row) => {
    // addRow()相当: 宣言された列名だけを持つvaluesへ正規化する(余分な
    // フィールドは落とし、値がない列はundefinedにする)。
    const values: Record<string, unknown> = {};
    keyNames.forEach((name) => {
      values[name] = row.values[name];
    });
    rehydrateSerializedRowValues(values, dateKeys, binaryKeys);

    const meta: RdhRowMeta = row.meta ?? {};
    rehydrateSerializedAnnotationValues(meta, dateKeys, binaryKeys);

    return { values, meta };
  });

  return {
    created: (toDate(plainObj.created as any) as Date) ?? new Date(),
    keys: plainObj.keys,
    rows,
    meta: plainObj.meta ?? {},
    noRecordsReason: plainObj.noRecordsReason,
    summary: plainObj.summary,
    queryConditions: plainObj.queryConditions,
    sqlStatement: plainObj.sqlStatement,
    shuffledIndexes: plainObj.shuffledIndexes,
    shuffledNextCounter: plainObj.shuffledNextCounter,
    mergeCells: plainObj.mergeCells,
  };
}
