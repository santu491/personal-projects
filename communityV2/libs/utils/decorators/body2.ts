import { BodyOptions, getMetadataArgsStorage } from 'routing-controllers';
import { ICustomBodyOption } from './../interfaces/customBodyOptions';

export function Body2(options?: ICustomBodyOption | BodyOptions | { options: ICustomBodyOption }): Function {
  return (object: {}, methodName: string, index: number) => {
    const opts: ICustomBodyOption = options ? options.options || {} : {};
    opts.isFormData = (options && (options as ICustomBodyOption).isFormData) || false;
    getMetadataArgsStorage().params.push({
      type: 'body',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: options ? (options as BodyOptions).required : undefined,
      classTransform: options ? (options as BodyOptions).transform : undefined,
      validate: options ? (options as BodyOptions).validate : undefined,
      explicitType: options ? (options as BodyOptions).type : undefined,
      extraOptions: opts
    });
  };
}
