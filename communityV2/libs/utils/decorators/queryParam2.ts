import { getMetadataArgsStorage } from 'routing-controllers';
import { ICustomParamOption } from './../interfaces/customParamOptions';

export function QueryParam2(name: string, options?: ICustomParamOption): Function {
  return (object: {}, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: 'query',
      object: object,
      method: methodName,
      index: index,
      name: name,
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      classTransform: options ? options.transform : undefined,
      explicitType: options ? options.type : undefined,
      validate: options ? options.validate : undefined,
      extraOptions: {
        encrypted: options ? options.encrypted : undefined,
        decryptor: options ? options.decryptor : undefined,
        stripMbrUid: options ? options.stripMbrUid : undefined
      }
    });
  };
}
