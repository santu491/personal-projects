import * as express from 'express';

export interface ICustomExpressRequest extends express.Request {
  id?: string;
  startTime?: Date | number;
  routeOptions?: { customErrorMap?: { [key: string]: string } };
  getResponse?: () => express.Response;
  cacheBust?: {
    keyPatterns?: string[];
    shouldBust?: (requestBody: object | Buffer | string | Array<unknown>, queryParams?: { [key: string]: string }, respBody?: object | Buffer | string | Array<unknown>) => boolean;
    resetValue?: boolean;
    encrypted?: boolean;
    cacheStatus?: number[];
  };
  cacheable?: {
    encrypt?: boolean;
    keyPrefix?: string;
    expiry?: number;
    readDisabled?: boolean;
    cacheStatus?: number[];
  };
  files?: Blob[];
}
