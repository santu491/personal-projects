import * as express from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {ExpressMiddlewareInterface, Middleware} from 'routing-controllers';
import {HeaderKeys} from '../constants';
import {AUTH_ROUTES} from '../routingConstants';
import {Request as CustomRequest} from '../types/customRequest';
import {APP} from '../utils/app';
import {ResponseUtil} from '../utils/responseUtil';
import {decrypt} from '../utils/security/encryptionHandler';
import {getCache} from '../utils/cacheUtil';

@Middleware({type: 'before', priority: 95})
export class JwtMiddleware implements ExpressMiddlewareInterface {
  global = false;

  public async use(
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    try {
      const response = new ResponseUtil();
      const jwtVerifyOptions = {
        ignoreExpiration: false,
      };

      if (
        req.url &&
        new RegExp(/public/, 'i').test(req.url) &&
        !req.url.includes('public/content')
      ) {
        next();
        return;
      }

      if (
        req.url &&
        new RegExp(`${AUTH_ROUTES.refreshMemberAuth}`, 'i').test(req.url)
      ) {
        jwtVerifyOptions.ignoreExpiration = true;
      }

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith(`${HeaderKeys.BEARER} `)
      ) {
        const token = req.headers.authorization.split(' ')[1];

        const jwtSecret = decrypt(APP.config.JWT) ?? '';
        const decoded = jwt.verify(
          token,
          jwtSecret,
          jwtVerifyOptions,
        ) as JwtPayload;

        if (decoded) {
          next();
          return;
        } else {
          const result = response.createException('Token not found');
          // Set HSTS headers to the response if not present already
          if (!res.get('Strict-Transport-Security')) {
            res.set(
              'Strict-Transport-Security',
              'max-age=31536000; includeSubDomains; preload',
            );
          }
          res.status(401).send(result);
          return;
        }
      }
    } catch (error) {
      // Set HSTS headers to the response if not present already
      if (!res.get('Strict-Transport-Security')) {
        res.set(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload',
        );
      }
      res.status(401).send(error);
    }
  }
}
