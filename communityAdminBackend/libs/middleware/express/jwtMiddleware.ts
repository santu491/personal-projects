import { JwtFilter } from '@anthem/communityadminapi/filters';
import { APP, Middleware2 } from '@anthem/communityadminapi/utils';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware2({ type: 'before', priority: 95 })
export class JwtMiddleware implements ExpressMiddlewareInterface {
  global = false;

  constructor(private _jwtFilter: JwtFilter) {}

  public async use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    if (req.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }
    if (
      await this._jwtFilter.validateToken(
        req.url,
        req.method,
        req.headers as { [key: string]: string },
        req.body,
        req.query as { [key: string]: string }
      )
    ) {
      next();
    } else {
      res.status(401).send();
      return;
    }
  }
}
