import * as express from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { ICustomExpressRequest } from '../interfaces/iCustomExpressRequest';

export function RouteOptions(options?: IRouteOptions): Function {
  return (objectOrFunction: object | Function, methodName?: string) => {
    getMetadataArgsStorage().uses.push({
      target: methodName ? objectOrFunction.constructor : (objectOrFunction as Function),
      method: methodName,
      middleware: (req: ICustomExpressRequest, _res: express.Response, next: express.NextFunction) => {
        if (options) {
          req['routeOptions'] = {
            customErrorMap: options.customErrorMap
          };
        }
        next();
      },
      afterAction: false
    });
  };
}

export interface IRouteOptions {
  customErrorMap?: { [key: string]: string };
}
