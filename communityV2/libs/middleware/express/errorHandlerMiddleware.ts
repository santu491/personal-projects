import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { getErrorMessage } from '@anthem/communityapi/rest';
import { APP, ICustomExpressRequest, Middleware2 } from '@anthem/communityapi/utils';
import * as express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';

/* Global error handler
This class is responsible for:
- Intercepting all unhandled errors and acting as final/default error handler
- Log errors - unless there's a specific reason to handle or log errors in your own code, let errors bubble up to this handler
  - In those rare cases when we need to throw a specific error code so that the UI can look for and handle,
    you can just do this: throw new TcpError('Some error message', 'engage.badges.500-1');
  - Otherwise, most of the time we can just throw errors like this: throw 'Failed to look up member's active coverage.'
- Add default properties to error response
  - code: <feature>.<subfeature>.<number> where number will default to the HttpStatus. Example: engage.deviceintegration.500.
  - serial: generated serial (phrase with 3 words) that can be displayed to the user and can be quickly looked up in Splunk.
*/
@Middleware2({ type: 'after', priority: 98 })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  global = true;

  constructor(@LoggerParam(__filename) private log: ILogger) {}

  public error(error: HttpError | Error | string, req: ICustomExpressRequest, res: express.Response, next: express.NextFunction): void {
    /* if ((req.url || '').indexOf(APP.config.app.apiRoute) < 0) {
      next();
      return;
    }*/

    let httpCode = 500;
    let finalErrorResponse: IFinalError = { exceptionMsg: 'Application Error' };
    try {
      let errorResponse: { exceptionMsg: string | HttpError | Error; code?: string; serial?: string };
      //log error globally and extract final error response
      if (error instanceof HttpError) {
        if (typeof error.message !== 'string') {
          errorResponse = error.message;
        } else {
          try {
            //sometime HttpError.message prroperty can have none json string. we will try to parse message to json (for soa errors this will be valid json)
            errorResponse = JSON.parse(error.message);
          } catch (ex) {
            //no need to handle as we know sometime message can have none json strings and can be extended of Error object
            //prriority .message or .stack
            errorResponse = {
              exceptionMsg: (error as Error).message || (error as Error).stack || error || 'Application Error'
            };
          }
        }
      } else {
        //this is generic javascript Error object orr any other type (generic string/object/array etc...).
        //we will try error.stack , error.message or directly assign incoming error
        errorResponse = {
          exceptionMsg: (error as Error).stack || (error as Error).message || error || 'Application Error'
        };
      }

      //if error is not HttpError and response status is already set previously use that status if >= 400
      if (!(error as HttpError).httpCode && res.statusCode >= 400) {
        httpCode = res.statusCode;
      } else if ((error as HttpError).httpCode >= 400) {
        httpCode = (error as HttpError).httpCode;
      }

      //make sure only to return json object as error response
      //otherwise it could lead internal error information as string which is security riisk
      finalErrorResponse = JSON.parse(JSON.stringify(errorResponse));

      // add customerrormap properties
      if (typeof finalErrorResponse === 'object') {
        const routeOptions = req.routeOptions;
        const customErrorMap = routeOptions && routeOptions.customErrorMap ? routeOptions.customErrorMap : null;
        const customError = this.tryGetCustomError(error, httpCode, finalErrorResponse, req.url, customErrorMap);
        finalErrorResponse.code = customError.code;
        finalErrorResponse.serial = customError.serial;
      }
    } catch (ex) {
      this.log.error(ex as Error);
    }

    res.status(httpCode);
    res.json(finalErrorResponse);
  }

  protected tryGetCustomError(error: HttpError | Error | string | IFinalError, httpCode: number, errorBody: IFinalError, url: string, customErrorMap?: { [key: string]: string }) {
    return this.getCustomHttpError(error, httpCode, errorBody, url, customErrorMap);
  }

  protected getCustomHttpError(error: HttpError | Error | string | IFinalError, httpCode: number, errorBody: IFinalError, url: string, customErrorMap?: { [key: string]: string }) {
    let errCode = '';
    try {
      errCode = this.extractErrorCode(errorBody);
    } catch (err) {
      this.log.error(err as Error);
    }

    return getErrorMessage(this.extractErrorMapCode(error, customErrorMap, httpCode, errCode, url));
  }

  protected extractErrorCode(errorBody: IFinalError): string {
    //go through error json obj and try get error code from known error response schemas from backend apis
    let errCode = '';
    if (typeof errorBody === 'object') {
      if (errorBody.exceptions && Array.isArray(errorBody.exceptions) && errorBody.exceptions.length) {
        errCode = errorBody.exceptions[0].code || '';
      } else if (errorBody.exceptions && !Array.isArray(errorBody.exceptions)) {
        errCode = errorBody.exceptions.code || '';
      } else if (errorBody.messageCode) {
        errCode = errorBody.messageCode || '';
      } else if (errorBody.errors && Array.isArray(errorBody.errors) && errorBody.errors.length) {
        errCode = errorBody.errors[0].code || '';
      }
    }
    return errCode;
  }

  protected extractErrorMapCode(error: HttpError | Error | string | IFinalError, customErrorMap: { [key: string]: string }, httpCode: number, errCode: string, url: string): string {
    let ret = '';

    if ((error as IFinalError).code) {
      // Get code from error if thrower spcified it
      ret = (error as IFinalError).code;
    } else if (customErrorMap) {
      ret = customErrorMap[`${httpCode}.${errCode}`] || customErrorMap[`${httpCode}`] || customErrorMap['default'];
    }

    if (!ret) {
      ret = this.getDefaultErrorCode(url, httpCode);
    }

    return ret;
  }

  /* Get default error code for DCS errors - The standard convention for most errors is '<feature>-<subFeature>-<httpStatus>'  */
  protected getDefaultErrorCode(url: string, httpCode: number): string {
    // TODO work on standardizing URL patterns for all DCS APIs - should look something like this:
    // /member/secure/api/tcp/<version>/<main-feature>/member/<mbrUid>/<sub-feature>/metrics.

    // Use regex to get feature/sub-feature from path. Since this code only runs for errors - performance impact should be minimal
    const rg = new RegExp(APP.config.security.regexFeatureSubFeatureFromPath, 'gi');
    const matches = rg.exec(url);
    let feature = 'community';
    let subFeature = 'default';
    if (matches && matches.groups) {
      feature = matches.groups['feature'];
      subFeature = matches.groups['subFeature'];
    }

    return `${feature}.${subFeature}.${httpCode}`.toLowerCase();
  }
}

interface IErrorBody {
  exceptions?: { code: string }[] | { code?: string };
  messageCode?: string;
  errors?: { code: string }[];
}

interface IFinalError extends IErrorBody {
  exceptionMsg: string;
  code?: string;
  serial?: string;
}
