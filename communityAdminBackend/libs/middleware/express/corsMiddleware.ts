import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, Middleware2 } from '@anthem/communityadminapi/utils';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware2({ type: 'before', priority: 96 })
export class CorsMiddleware implements ExpressMiddlewareInterface {
  global = true;

  //dont use regex global flag as it will break on same string matches https://stackoverflow.com/a/4950498
  private _allowedRequestDomains = new RegExp(APP.config.cors.allowedRequestDomains, 'i');
  private _allowedOrigins = new RegExp(APP.config.cors.allowedOrigins, 'i');

  constructor(@LoggerParam(__filename) private log: ILogger) {}

  use(request: express.Request, response: express.Response, next: () => express.NextFunction): void {
    if (request.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }

    if (this.isCorsRequest(request) && APP.config.cors.enable) {
      if (!this.isCorsRequestAllowed(request)) {
        response.status(403).send();
        return;
      }

      if (this.isPreflightRequest(request)) {
        response.setHeader('access-control-allow-credentials', 'true');
        response.setHeader('access-control-allow-methods', APP.config.cors.allowedMethods);
        response.setHeader('access-control-max-age', APP.config.cors.maxAge);
        response.setHeader('access-control-allow-headers', APP.config.cors.allowedHeaders);
        response.setHeader('access-control-allow-origin', request.headers['origin'] || APP.config.cors.defaultOrigin);
        response.status(200).send();
        return;
      } else {
        //Allow cors requests on same parent domain without preflight request
        response.setHeader('access-control-allow-credentials', 'true');
        response.setHeader('access-control-allow-origin', request.headers['origin'] || APP.config.cors.defaultOrigin);
      }
    }

    next();
  }

  private isCorsRequestAllowed(request: express.Request): boolean {
    //use host header url instead of getRequestUrl as apache proxy config can only retain original request url in host header
    //apache "ProxyPreserveHost On" config retains original request url in Host header
    const host = request.headers['host'];
    const origin = request.headers['origin'] as string;
    if (this.isRequestDomainAllowed(host)) {
      return true;
    }

    if (this.isAllowedOrigin(origin)) {
      return true;
    }

    this.log.error(`CORS request not allowed for origin: ${origin}, host: ${host}`);
    return false;
  }

  private isRequestDomainAllowed(url: string): boolean {
    if (typeof url !== 'undefined' && this._allowedRequestDomains.test(url)) {
      return true;
    }

    return false;
  }

  private isAllowedOrigin(origin: string): boolean {
    if (typeof origin !== 'undefined' && this._allowedOrigins.test(origin)) {
      return true;
    }

    return false;
  }

  private isPreflightRequest(request: express.Request): boolean {
    if (this.isCorsRequest(request) && request.method === 'OPTIONS' && typeof request.headers['access-control-request-method'] !== 'undefined') {
      return true;
    }

    return false;
  }

  private isCorsRequest(request: express.Request): boolean {
    return typeof request.headers['origin'] !== 'undefined';
  }
}
