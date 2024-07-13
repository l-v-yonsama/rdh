import dayjs from "dayjs";

export function castTo<T>(o: unknown): T {
  return o as T;
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

export const toNum = (s: string | number | undefined): number | undefined => {
  if (s === null || s === undefined) {
    return undefined;
  }
  if (typeof s === "number") {
    return s;
  }
  if (s.trim().length === 0) {
    return undefined;
  }

  const n = Number(s);
  if (isNaN(n)) {
    return undefined;
  }
  return n;
};

export const toBoolean = (
  s: Buffer | boolean | string | undefined
): boolean | undefined => {
  if (s === null || s === undefined) {
    return undefined;
  }
  if (typeof s === "boolean") {
    return s;
  }
  if (s instanceof Buffer) {
    const buf = s as Buffer;
    return buf.at(0) === 1;
  }
  if (s.trim().length === 0) {
    return undefined;
  }
  return (
    "t" === s.toLowerCase() ||
    "true" === s.toLowerCase() ||
    "1" === s.toLowerCase()
  );
};

export const toDate = (
  s: string | number | Date | undefined
): Date | undefined => {
  if (s === null || s === undefined) {
    return undefined;
  }

  if (typeof s === "object") {
    if (s instanceof Date) {
      return s;
    }
  }

  if (typeof s === "number") {
    return new Date(s);
  }
  if (s.trim().length === 0) {
    return undefined;
  }
  if (/^(now|CURRENT_TIMESTAMP)$/i.test(s)) {
    return new Date();
  }

  if (/^(today|CURRENT_DATE)$/i.test(s)) {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
  }

  const r = dayjs(s).toDate();
  return r;
};

export const toTime = (s: string | undefined): string | undefined => {
  if (s === null || s === undefined) {
    return undefined;
  }

  if (s.trim().length === 0) {
    return undefined;
  }

  if ("now" === s.toLowerCase()) {
    return dayjs().format("HH:mm:ss");
  }

  return s;
};

export const getUniqObjectKeys = (list: any[]): string[] => {
  const keys = new Set<string>();
  list
    .filter((it) => it !== undefined && it !== null)
    .forEach((it) => {
      Object.keys(it).forEach((key) => {
        keys.add(key);
      });
    });
  return [...keys];
};
