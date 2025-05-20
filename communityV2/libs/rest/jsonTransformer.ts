import { classToPlain, ClassTransformOptions, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/cjs/ClassTransformer';
// eslint-disable-next-line no-restricted-imports
import { merge } from 'lodash';
import { Service } from 'typedi';

@Service()
export class JsonTransformer {
  jsonToClass<T>(json: string | object, responseClass: ClassType<unknown>, transformOptions: ClassTransformOptions = {}): T | unknown {
    return plainToClass(responseClass, json, transformOptions);
  }

  classToJson<T>(object: T | object, transformOptions: ClassTransformOptions = {}): object | Array<unknown> {
    return classToPlain(object, merge({ strategy: 'excludeAll', excludePrefixes: ['_'] }, transformOptions));
  }
}
