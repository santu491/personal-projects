import { getMetadataArgsStorage, ParamOptions } from 'routing-controllers';

export function CookieParam2(name: string, options?: ParamOptions) {
  return (object: {}, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: 'cookie',
      object: object,
      method: methodName,
      index: index,
      name: name,
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      explicitType: options ? options.type : undefined,
      classTransform: options ? options.transform : undefined,
      validate: options ? options.validate : undefined
    });
  };
}
