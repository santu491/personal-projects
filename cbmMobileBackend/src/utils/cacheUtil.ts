import NodeCache from 'node-cache';

const tokenCache = new NodeCache();

export const setCache = (key: string, value: string, timeOut: number) => {
  try {
    tokenCache.set(key, value, timeOut);
    return true;
  } catch (error) {
    return false;
  }
};

export const getCache = (key: string): string => {
  try {
    return tokenCache.get(key) ?? '';
  } catch (error) {
    return '';
  }
};

export const clearCache = (key: string) => {
  return tokenCache.del(key);
};
