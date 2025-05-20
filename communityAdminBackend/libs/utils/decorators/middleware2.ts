import { getMetadataArgsStorage } from 'routing-controllers';
import { MiddlewareMetadataArgs } from 'routing-controllers/cjs/metadata/args/MiddlewareMetadataArgs';

export function Middleware2(options: { type: 'after' | 'before'; priority?: number }): Function {
  return (target: Function) => {
    getMetadataArgsStorage().middlewares.push(({
      target: target,
      type: options && options.type ? options.type : 'before',
      global: true,
      priority: options && options.priority !== undefined ? options.priority : 0
    } as unknown) as MiddlewareMetadataArgs);
  };
}
