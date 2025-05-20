import { getMetadataArgsStorage } from 'routing-controllers';
import { ICustomParamOption } from './../interfaces/customParamOptions';

export function Param2(name: string, options?: ICustomParamOption): Function {
  return (object: {}, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: 'param',
      object: object,
      method: methodName,
      index: index,
      name: name,
      parse: false, // it does not make sense for Param to be parsed
      required: true, // params are always required, because if they are missing router will not match the route
      classTransform: undefined,
      extraOptions: {
        encrypted: options ? options.encrypted : undefined,
        decryptor: options ? options.decryptor : undefined,
        stripMbrUid: options ? options.stripMbrUid : undefined
      }
    });
  };
}
