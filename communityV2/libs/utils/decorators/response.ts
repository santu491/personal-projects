import { CookieOptions } from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { ParamType } from 'routing-controllers/cjs/metadata/types/ParamType';

export function Response(): Function {
  return (object: {}, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: ('response-custom' as unknown) as ParamType,
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false
    });
  };
}

export interface IResponse {
  setHeader(key: string, value: string): void;
  setStatus(status: number): void;
  setCookie(cookie: ICookie): void;
}

export interface ICookie {
  name: string;
  value: string;
  options?: CookieOptions;
}
