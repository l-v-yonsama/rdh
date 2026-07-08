let debugEnabled = false;

export const setDebugEnabled = (enabled: boolean): void => {
  debugEnabled = enabled;
};

export const debugLog = (...args: unknown[]): void => {
  if (debugEnabled) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
