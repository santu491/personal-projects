import { AuditHelper } from '@anthem/communityapi/audit';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';

@Service()
export class AuditFilter {
  protected optionalUrlRegEx: RegExp[] = [];

  constructor(@LoggerParam(__filename) private _log: ILogger) {
    for (const optionalUrl of APP.config.audit.optionalUrls) {
      this.optionalUrlRegEx.push(new RegExp(optionalUrl));
    }
  }

  public auditRequest(
    headers: { [key: string]: string },
    reqBody: object | Buffer | string | Array<unknown>,
    reqStartTime: Date,
    respBody: object | Buffer | string | Array<unknown>,
    status: number,
    reqMethod: string,
    reqUrl: string,
    reqFiles: Blob[] = [],
    debugMode?: boolean
  ) {
    try {
      let optional = false;
      for (const optionalUrlRegEx of this.optionalUrlRegEx) {
        if (optionalUrlRegEx.test(reqUrl)) {
          optional = true;
          break;
        }
      }

      if (!optional) {
        if (headers['cookie']) {
          this._log.debug(AuditHelper.getRequestCookieLog(headers['cookie']));
        }

      }
    } catch (e) {
      this._log.error(e as Error);
    }
  }
}
