import {ExpressMiddlewareInterface, Middleware} from 'routing-controllers';
import * as express from 'express';
import logger from '../utils/logger';
import {decrypt} from '../utils/security/encryptionHandler';
import {APP} from '../utils/app';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {AuditParam} from '../constants';
import {AuditFilter} from '../utils/audit/auditFilter';
import {LogAudit} from '../utils/audit/logAudit';

@Middleware({type: 'before', priority: 99})
export class RequestMiddleware implements ExpressMiddlewareInterface {
  global = true;

  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    const token = req.headers?.authorization?.split(' ')[1];
    if (token) {
      const jwtSecret = decrypt(APP.config.JWT) ?? '';
      const decoded = jwt.verify(token, jwtSecret, {
        ignoreExpiration: false,
      }) as JwtPayload;
      if (decoded.sessionId) {
        // Add this to the request header
        req.headers[AuditParam.TRACE_ID] = decoded.sessionId;
      }
    }

    // Log using the custom log level
    const Logger = logger();
    const auditFilter = new AuditFilter();
    const log = new LogAudit([
      {
        name: AuditParam.TYPE,
        value: AuditParam.INCOMING_TYPE,
      },
      {
        name: AuditParam.METHOD,
        value: req.method,
      },
      {
        name: AuditParam.URL,
        value: auditFilter.getRequestUrl(req),
      },
      {
        name: AuditParam.REQ,
        value: auditFilter.getAuditedRequestBody(req.body),
      },
      {
        name: AuditParam.HEADERS,
        value: auditFilter.getAuditedRequestHeaders(req.headers),
      },
    ]);
    const logLevel = log.getAuditMessage();
    Logger.info(`Incoming Request: ${logLevel}`);

    next();
  }
}
