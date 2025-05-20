import { SecurityFilter } from '@anthem/communityapi/filters';
import { APP, Middleware2 } from '@anthem/communityapi/utils';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

//highest priority value will get executed first
@Middleware2({ type: 'before', priority: 97 })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
  global = false;

  constructor(private _secFilter: SecurityFilter) {}

  public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }

    try {
      const result = this._secFilter.scanRequest(req.url, req.method, req.headers as { [key: string]: string }, req.cookies, req.params, req.query as { [key: string]: string });
      req.headers = result.headers;
      req.cookies = result.cookies;
      req.params = result.params;
      req.query = result.query;
    } catch (e) {
      res.status(400);
      throw e;
    }

    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  }
}
