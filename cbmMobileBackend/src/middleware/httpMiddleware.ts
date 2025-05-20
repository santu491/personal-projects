import * as express from 'express';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
} from 'routing-controllers';
import {ResponseData} from '../types/customRequest';
import {TokenExpiredError} from 'jsonwebtoken';

@Middleware({type: 'after'})
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  global = true;

  public error(
    error: HttpError | Error | string,
    req: express.Request,
    res: express.Response,
  ): void {
    let httpCode = 500;
    let finalErrorResponse = {
      exceptionMsg: 'Application Error',
      code: '',
      serial: '',
    };
    try {
      let errorResponse:
        | ResponseData
        | {
            exceptionMsg: string | HttpError | Error;
          };
      if (error instanceof HttpError || error instanceof TokenExpiredError) {
        if (typeof error.message !== 'string') {
          errorResponse = error.message;
        } else {
          try {
            errorResponse = JSON.parse(error.message);
          } catch (ex) {
            errorResponse = {
              errors: [
                {
                  title:
                    (error as Error).message ||
                    error.message ||
                    'Application Error',
                },
              ],
            };
          }
        }
      } else {
        errorResponse = {
          exceptionMsg:
            (error as Error).stack ||
            (error as Error).message ||
            error ||
            'Application Error',
        };
      }
      if (!(error as HttpError).httpCode && res.statusCode >= 400) {
        httpCode = res.statusCode;
      } else if ((error as HttpError).httpCode >= 400) {
        httpCode = (error as HttpError).httpCode;
      }

      //make sure only to return json object as error response
      finalErrorResponse = JSON.parse(JSON.stringify(errorResponse));
    } catch (ex) {
      console.log('Error in error handler', ex);
    }
    // Set HSTS headers to the response if not present already
    if (!res.get('Strict-Transport-Security')) {
      res.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }
    res.status(httpCode).json(finalErrorResponse);
  }
}
