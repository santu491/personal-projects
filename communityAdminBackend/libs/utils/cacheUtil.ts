import * as NodeCache from 'node-cache';

export class CacheUtil {
  private _cluster: NodeCache;

  constructor() {
    this._cluster = new NodeCache({});
  }

  getCache(key: string): string | object {
    return this._cluster.get(key);
  }

  setCache(key: string, value: string | object , timetoLive: number) {
    this._cluster.set(key, value, timetoLive);
  }
}
