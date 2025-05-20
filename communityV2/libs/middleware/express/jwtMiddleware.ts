import { headers } from '@anthem/communityapi/common';
import { JwtFilter } from '@anthem/communityapi/filters';
import { APP, Middleware2 } from '@anthem/communityapi/utils';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware2({ type: 'before', priority: 95 })
export class JwtMiddleware implements ExpressMiddlewareInterface {
  global = false;

  constructor(private _jwtFilter: JwtFilter) { }

  public async use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    if (req.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }
    const response = await this._jwtFilter.validateToken(
      req.url,
      req.method,
      req.headers as { [key: string]: string },
      req.body,
      req.query as { [key: string]: string }
    );
    if (response !== headers.ERR_CODE_TOKEN_DELETED_USER || !response) {
      next();
    } else {
      res.setHeader(headers.ERR_CODE, response.toString());
      res.status(401).send();
      return;
    }
  }
}
