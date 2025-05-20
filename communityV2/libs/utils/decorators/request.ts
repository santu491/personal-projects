import { getMetadataArgsStorage } from 'routing-controllers';
import { ParamType } from 'routing-controllers/cjs/metadata/types/ParamType';

export function Request(): Function {
  return (object: {}, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: ('request-custom' as unknown) as ParamType,
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false
    });
  };
}

export interface IRequest {
  getHeaders: Function;
  url: string;
  headers: { [key: string]: string };
}
