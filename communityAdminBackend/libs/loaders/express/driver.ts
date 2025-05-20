import { SecurityFilter } from '@anthem/communityadminapi/filters';
import { EncryptionUtil } from '@anthem/communityadminapi/security';
import { APP, ICookie, ICustomExpressRequest, RequestContext } from '@anthem/communityadminapi/utils';
import * as express from 'express';
import { Action, ActionMetadata, ExpressDriver, ExpressErrorMiddlewareInterface, ExpressMiddlewareInterface, HttpError, MiddlewareMetadata, ParamMetadata } from 'routing-controllers';
import { ICustomActionMetadata } from '../interfaces/iCustomActionMetadata';
import { isPromiseLike } from './isPromiseLike';

export interface ICustomMiddleware {
  priority?: number;
  use: express.RequestHandler;
  global?: boolean;
}

export class ExpressDriver2 extends ExpressDriver {
  private _secFilter: SecurityFilter = new SecurityFilter();
  private _beforeMiddlewares: ICustomMiddleware[] = [];
  private _afterMiddlewares: ICustomMiddleware[] = [];

  registerMiddleware(middleware: MiddlewareMetadata) {
    // if its an error handler then register it with proper signature in express
    if ((middleware.instance as ExpressErrorMiddlewareInterface).error) {
      this.express.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
        (middleware.instance as ExpressErrorMiddlewareInterface).error(error, request, response, next);
      });
      return;
    }

    // if its a regular middleware then register it as express middleware
    if ((middleware.instance as ExpressMiddlewareInterface).use) {
      const use = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
          const useResult = (middleware.instance as ExpressMiddlewareInterface).use(request, response, next);
          if (isPromiseLike(useResult)) {
            useResult.catch((error: Error) => {
              this.handleError(error, undefined, { request, response, next });
              return error;
            });
          }
        } catch (error) {
          this.handleError(error, undefined, { request, response, next });
        }
      };

      if ((middleware.instance as ICustomMiddleware)['global'] === true) {
        this.express.use(use);
      } else {
        const sort = (a: ICustomMiddleware, b: ICustomMiddleware) => {
          return b.priority - a.priority;
        };
        if (middleware.type === 'before') {
          this._beforeMiddlewares.push({ priority: middleware.priority, use: use });
          this._beforeMiddlewares.sort(sort);
        } else {
          this._afterMiddlewares.push({ priority: middleware.priority, use: use });
          this._afterMiddlewares.sort(sort);
        }
      }
    }
  }

  registerAction(actionMetadata: ActionMetadata | ICustomActionMetadata, executeCallback: (options: Action) => unknown): void {
    // middlewares required for this action
    const defaultMiddlewares: express.RequestHandler[] = [];
    if (actionMetadata.isBodyUsed) {
      //default request maz size is 100kb. changing this to 10mb
      const options = { ...(actionMetadata.bodyExtraOptions || {}), ...{ limit: '10mb' } };
      if (actionMetadata.isJsonTyped && (!actionMetadata.bodyExtraOptions || !actionMetadata.bodyExtraOptions.isFormData)) {
        this._beforeMiddlewares.unshift({ use: this.loadBodyParser().json(options) });
      } else if (actionMetadata.bodyExtraOptions && actionMetadata.bodyExtraOptions.isFormData) {
        this._beforeMiddlewares.unshift({
          use: this.loadBodyParser().urlencoded({
            extended: true
          })
        });
      } else {
        this._beforeMiddlewares.unshift({ use: this.loadBodyParser().text(options) });
      }
    }

    if (actionMetadata.isFileUsed || actionMetadata.isFilesUsed) {
      const multer = this.loadMulter();
      actionMetadata.params
        .filter((param) => param.type === 'file')
        .forEach((param) => {
          defaultMiddlewares.push(multer(param.extraOptions).single(param.name));
        });
      actionMetadata.params
        .filter((param) => param.type === 'files')
        .forEach((param) => {
          defaultMiddlewares.push(multer(param.extraOptions).array(param.name));
        });
    }

    defaultMiddlewares.push((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.url.indexOf(APP.config.app.apiRoute) >= 0) {
        try {
          this.scanBody(req);
        } catch (e) {
          res.status(400);
          throw e;
        }
      }
      next();
    });

    // user used middlewares
    const uses = [...actionMetadata.controllerMetadata.uses, ...actionMetadata.uses];
    const beforeMiddlewares = this.prepareMiddlewares(uses.filter((use) => !use.afterAction));
    const afterMiddlewares = this.prepareMiddlewares(uses.filter((use) => use.afterAction));

    // prepare route and route handler function
    const route = ActionMetadata.appendBaseRoute(this.routePrefix, actionMetadata.fullRoute);
    //tslint:disable
    // eslint-disable-next-line custom-rules/prefer-arrow-functions
    const routeHandler = function routeHandler(request: ICustomExpressRequest, response: express.Response, next: Function) {
      if ((actionMetadata as ICustomActionMetadata).isGraphql) {
        request.getResponse = () => {
          return response;
        };
        return ((executeCallback as unknown) as (req: express.Request, res: express.Response) => void)(request, response);
      } else {
        return executeCallback({ request, response, next });
      }
    };
    //tslint:enable

    // finally register action in express
    this.express[actionMetadata.type.toLowerCase()](
      ...[
        route,
        ...beforeMiddlewares,
        ...this._beforeMiddlewares.map((m) => {
          return m.use;
        }),
        ...defaultMiddlewares,
        routeHandler,
        ...afterMiddlewares,
        ...this._afterMiddlewares.map((m) => {
          return m.use;
        })
      ]
    );
  }

  //tslint:disable
  // eslint-disable-next-line complexity
  getParamFromRequest(action: Action, param: ParamMetadata) {
    if (((param.type as unknown) as string) === 'request-custom') {
      return action.request;
    } else if (((param.type as unknown) as string) === 'response-custom') {
      action.request.customResponse = action.request.customResponse || {
        setHeader: (key: string, value: string) => {
          action.response.setHeader(key, value);
        },
        setStatus: (status: number) => {
          action.response.status(status);
        },
        setCookie: (cookie: ICookie) => {
          action.response.cookie(cookie.name, cookie.value, cookie.options);
        }
      };
      return action.request.customResponse;
    }

    let result = super.getParamFromRequest(action, param);
    //TODO move to config file.
    if (
      action.request.url.indexOf('member/virtual') < 0 &&
      param.type === 'param' &&
      param.name === 'mbrUid' &&
      action.request.url.indexOf('/dcs/secured/v1/user/') < 0 &&
      action.request.url.indexOf('/features') < 0
    ) {
      let encMbrUid = '';
      try {
        encMbrUid = EncryptionUtil.decrypt(result, 'aes');
      } catch (error) {
        //tslint:disable
        // eslint-disable-next-line no-console
        console.error(error);
        //tslint:enable
      }

      result = RequestContext.getContextItem('MbrUid') || result;
      if (encMbrUid !== result) {
        throw new HttpError(401, `mbruid mismatch url param: ${encMbrUid} jwt: ${result}`);
      }
    }
    //do not decrypt virtual api requests
    else if (action.request.url.indexOf('member/virtual') < 0) {
      let encrypted = param.extraOptions ? param.extraOptions.encrypted : false;
      if (/(param|query|header)/.test(param.type) && APP.config.security.outputEncryptedProps.indexOf(param.name) >= 0) {
        param.extraOptions.decryptor = param.extraOptions.decryptor || 'aes';
        encrypted = true;
      }

      if (encrypted && result) {
        result = EncryptionUtil.decrypt(result, param.extraOptions.decryptor);
        if (param.extraOptions && param.extraOptions.stripMbrUid) {
          if (result.indexOf(RequestContext.getContextItem('MbrUid')) >= 0) {
            result = result.replace(RequestContext.getContextItem('MbrUid'), '');
          } else {
            throw new HttpError(401, `strip mbruid mismatch url param: ${result}`);
          }
        }
      }
    }

    return result;
  }
  //tslint:enable

  protected transformResult(result: object, action: ActionMetadata, options: Action): object {
    //disable transform response result
    return result;
  }

  protected loadMulter() {
    try {
      //using anthem-multer pkg which adds a fix for existing multer pkg multipart msg parsing.
      return require('multer');
    } catch (e) {
      throw new Error('multer package was not found installed. Try to install it: npm install multer --save');
    }
  }

  private scanBody(req: express.Request) {
    req.body = this._secFilter.scanBody(req.body);
  }
}
