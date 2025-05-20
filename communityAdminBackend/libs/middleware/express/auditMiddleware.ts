import { AuditFilter, OutputFilter } from '@anthem/communityadminapi/filters';
import { LoggerFactory } from '@anthem/communityadminapi/logger';
import { APP, ICustomExpressRequest, ICustomExpressResponse, Middleware2, RequestContext } from '@anthem/communityadminapi/utils';
import { BaseResponse } from 'api/adminresources/models/resultModel';
import * as express from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware2({ type: 'before', priority: 99 })
export class AuditMiddleware implements ExpressMiddlewareInterface {
  global = true;

  private _log = LoggerFactory.getLogger(__filename);

  constructor(private _auditFilter: AuditFilter) {}

  public use(req: ICustomExpressRequest, res: ICustomExpressResponse, next: express.NextFunction): void {
    if (req.url.indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }

    let originalResp: string | object | Array<unknown>;
    const originalJson = res.json;
    const auditFilter = this._auditFilter;

    const debugMode = RequestContext.debugModeEnabled();
    res.json = function (json: object | Array<unknown> | BaseResponse) {
      if (typeof json !== 'string' && typeof json !== 'object' && !Array.isArray(json)) {
        res.status(500);
        json = {};
      }
      if (typeof json === 'object') {
        const response = json as BaseResponse;
        if (!response?.data?.isSuccess) {
          res.status(400);
        }
      }
      originalResp = json;

      //TODO: need to invoke below code for erquired api responses.
      //running below on large responses will lead to performance issues
      //this will suppress error info, assign custom error for error ersponses or scan and encrypt encryptable props for success responses
      const t = OutputFilter.scanOutput(json, res.statusCode);

      return originalJson.call(this, t);
    };

    const originalWrite: (chunk: unknown, cb?: (error: Error | null | undefined) => void) => boolean = res.write;
    res.write = function (chunk: unknown) {
      originalResp = originalResp || 'buffered response';
      /*TODO: capture binary data if needed
          if (res.getHeader('Content-Type').indexOf('text/html') >= 0) {
              if (chunk instanceof Buffer) {
                  chunk = chunk.toString();
              }
              chunk = chunk.replace(/(<\/body>)/, '<script>alert(\'hi\')</script>\n\n$1');
              res.setHeader('Content-Length', chunk.length);
          }*/
      return originalWrite.call(this, chunk);
    };

    res.on('finish', () => {
      try {

        if (!res['audited']) {
          auditFilter.auditRequest(
            (req.headers as unknown) as { [key: string]: string },
            req.body,
            req['startTime'] as Date,
            originalResp,
            res.statusCode,
            req.method,
            this.getRequestUrl(req.protocol, req.headers ? req.headers.host : 'unknown', req.url),
            req['files'],
            debugMode
          );
          res['audited'] = true;
        }

      } catch (error) {
        this._log.error(error as Error);
      }
    });

    const originalSend = res.send;
    res.send = function (data) {
      originalResp = originalResp || data;
      return originalSend.call(this, data);
    };
    next();
  }

  getRequestUrl(protocol: string, host: string, url: string) {
    return `${protocol}://${host}${url}`;
  }

}
