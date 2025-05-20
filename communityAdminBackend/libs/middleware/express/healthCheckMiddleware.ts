import { HealthCheckUtil } from '@anthem/communityadminapi/common';
import { APP, Middleware2 } from '@anthem/communityadminapi/utils';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware2({ type: 'before', priority: 98 })
export class HealthCheckMiddleware implements ExpressMiddlewareInterface {
  global = true;

  public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }

    if (/\/(health)\/?$/.test(req.url.toLowerCase()) && HealthCheckUtil.checkHealth()) {
      res.status(200).send({ status: 'UP' });
    } else {
      next();
      return;
    }
  }
}
