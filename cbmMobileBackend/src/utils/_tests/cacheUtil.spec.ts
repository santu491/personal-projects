import NodeCache from 'node-cache';
import {clearCache, getCache, setCache} from '../cacheUtil';

jest.mock('node-cache');

describe('cacheUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setCookie', () => {
    it('should set a value in the cache with the specified key and timeout', async () => {
      const key = 'testKey';
      const value = 'testValue';
      const timeout = 60;
      jest.spyOn(NodeCache.prototype, 'set').mockReturnValue(true);

      const response = await setCache(key, value, timeout);
      expect(response).toBe(true);
    });

    it('should return false if an error is thrown', async () => {
      const key = 'testKey';
      const value = 'testValue';
      const timeout = 60;
      jest.spyOn(NodeCache.prototype, 'set').mockImplementation(() => {
        throw new Error('err');
      });

      const response = await setCache(key, value, timeout);
      expect(response).toBe(false);
    });
  });

  describe('getCookie', () => {
    it('should retrieve a value from the cache with the specified key', async () => {
      const key = 'testKey';
      const value = 'testValue';

      jest.spyOn(NodeCache.prototype, 'get').mockReturnValue(value);

      const result = await getCache(key);

      expect(result).toBe(value);
    });

    it('should return empty string if cache value not found', async () => {
      const key = 'testKey';

      jest.spyOn(NodeCache.prototype, 'get').mockReturnValue(null);

      const result = await getCache(key);

      expect(result).toBe('');
    });

    it('should return false if an error is thrown', async () => {
      const key = 'testKey';
      jest.spyOn(NodeCache.prototype, 'get').mockImplementation(() => {
        throw new Error('err');
      });

      const response = await getCache(key);
      expect(response).toBe('');
    });
  });

  describe('clearCache', () => {
    it('should delete a value from the cache with the specified key', async () => {
      const key = 'testKey';
      jest.spyOn(NodeCache.prototype, 'del').mockReturnValue(1);

      const result = await clearCache(key);

      expect(result).toBe(1);
    });
  });
});
