import { APP, ICustomExpressRequest, Middleware2, RequestContext } from '@anthem/communityapi/utils';
import * as express from 'express';
import * as os from 'os';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { v4 as uuid } from 'uuid';

@Middleware2({ type: 'before', priority: 100 })
export class LogContextMiddleware implements ExpressMiddlewareInterface {
  global = true;

  use(request: ICustomExpressRequest, response: express.Response, next: () => express.NextFunction): void {
    if (request.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }

    this.setRequestId(request);
    this.setStartTime(request);
    this.setResponseHeaders(request, response);
    RequestContext.initLoggingContext(request, response, request.headers as { [key: string]: string }, request.cookies, next, request.id);
  }

  private setRequestId(req: ICustomExpressRequest) {
    let reqId: string;
    if (req.headers && req.headers['meta-transid']) {
      reqId = req.headers['meta-transid'] as string;
    } else {
      reqId = uuid();
    }
    req.id = reqId;
  }

  private setStartTime(req: ICustomExpressRequest) {
    req.startTime = new Date();
  }

  private setResponseHeaders(req: ICustomExpressRequest, resp: express.Response) {
    resp.setHeader('X-Rid', req.id);
    resp.setHeader('X-Tcp-Info', this.getTcpInfo());
  }

  private getTcpInfo(): string {
    const serverAbbr = (os.hostname() || '').split('.')[0].slice(-4);
    return `${serverAbbr}`;
  }
}
