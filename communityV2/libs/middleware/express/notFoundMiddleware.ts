import { APP, Middleware2 } from '@anthem/communityapi/utils';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware2({ type: 'after', priority: 99 })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  global = true;

  public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }

    if (!res.headersSent && req.url.indexOf('/graphiql') < 0 && req.url.indexOf('/graphql') < 0) {
      res.status(404).send('Document Not Found');
    }
    else {
      next();
    }
  }
}
