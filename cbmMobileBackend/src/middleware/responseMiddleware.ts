import * as express from 'express';
import {ExpressMiddlewareInterface, Middleware} from 'routing-controllers';
import {APIResponseCodes, AuditParam, SecureEnvironments} from '../constants';
import {ResponseData} from '../types/customRequest';
import logger from '../utils/logger';
import {AuditFilter} from '../utils/audit/auditFilter';
import {LogAudit} from '../utils/audit/logAudit';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {decrypt} from '../utils/security/encryptionHandler';
import {AuditService} from '../services/commons/auditService';
import {APP} from '../utils/app';

@Middleware({type: 'before', priority: 99})
export class ResponseMiddleware implements ExpressMiddlewareInterface {
  global = true;

  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void {
    // Set HSTS headers to the response if not present already
    if (!res.get('Strict-Transport-Security')) {
      res.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }
    const originalJson = res.json;

    const audit = (response: ResponseData, request: any): void => {
      if (
        response?.statusCode === APIResponseCodes.SUCCESS ||
        response?.statusCode === APIResponseCodes.CREATED ||
        typeof response === 'string'
      ) {
        return;
      }
      const auditFilter = new AuditFilter();
      const log = new LogAudit([
        {
          name: AuditParam.TYPE,
          value: AuditParam.INCOMING_TYPE,
        },
        {
          name: AuditParam.METHOD,
          value: request.method,
        },
        {
          name: AuditParam.URL,
          value: auditFilter.getRequestUrl(request),
        },
        {
          name: AuditParam.REQ,
          value: auditFilter.getAuditedRequestBody(request.body),
        },
        {
          name: AuditParam.RES,
          value: auditFilter.getAuditedRequestBody(response),
        },
      ]);
      logger().error(log.getAuditMessage());
    };

    const auditLog = async (
      response: ResponseData,
      request: any,
    ): Promise<void> => {
      try {
        const token = request.headers?.authorization?.split(' ')[1];
        if (token) {
          const jwtSecret = decrypt(APP.config.JWT) ?? '';
          const decoded = jwt.verify(token, jwtSecret, {
            ignoreExpiration: false,
          }) as JwtPayload;
          if (decoded.installationId && decoded.sessionId) {
            const auditService = new AuditService();
            await auditService.updateRecentAccess(
              decoded.installationId,
              decoded.sessionId,
            );
          }
        }
      } catch (error) {
        return;
      }
    };

    res.json = function (json: object) {
      if (
        typeof json !== 'string' &&
        typeof json !== 'object' &&
        !Array.isArray(json)
      ) {
        res.status(500);
        json = {
          data: {
            statusCode: 500,
          },
        };
      }
      audit(<ResponseData>json, req);
      auditLog(<ResponseData>json, req);

      if (typeof json === 'object') {
        const response = json as ResponseData;
        if (!response?.data) {
          res.status(response?.statusCode || 400);
        } else {
          // Handle the token cookie
          if (response.data && response.data.token) {
            res.cookie('jwt', (response.data as {token: string}).token, {
              httpOnly: true,
              secure:
                !process.env.NODE_ENV ||
                SecureEnvironments.includes(process.env.NODE_ENV)
                  ? true
                  : false,
              sameSite: 'strict',
              maxAge: 60 * 60 * 1000,
            });
            if ((response.data as {token: string}).token) {
              delete response.data.token;
            }
          } else {
            res.clearCookie('jwt');
          }

          if (response.data && response.data.headers) {
            for (const {key, value} of response.data.headers) {
              res.setHeader(key, value);
            }
            delete response.data.headers;
          }
          res.status(response.statusCode || 200);
        }
        delete response?.statusCode;
      }
      if (req.url && new RegExp(/logout/, 'i').test(req.url)) {
        res.cookie('jwt', '', {
          httpOnly: true,
          secure:
            !process.env.NODE_ENV ||
            SecureEnvironments.includes(process.env.NODE_ENV)
              ? true
              : false,
          expires: new Date(0),
        });
      }
      return originalJson.call(this, json);
    };
    next();
  }
}
