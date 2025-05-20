import { Audit, ILogger, LoggerFactory } from '@anthem/communityadminapi/logger';
import { InputScanner } from '@anthem/communityadminapi/security';
import { APP, StringUtils } from '@anthem/communityadminapi/utils';
import * as fs from 'fs';
import { AuditCode } from './enums/auditCode';
import { AuditParam } from './enums/auditParam';

export class AuditHelper {
  private static _log: ILogger = LoggerFactory.getLogger(__filename);
  private static _scanner: InputScanner;

  public static getRequestCookieLog(cookies: string) {
    return `Cookie="${this.getHeaderCookies(cookies)}"`;
  }

  public static getRequestAudit(
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
    const endTime = new Date();
    const audit = new Audit();
    audit.code = AuditCode.REST_API_METHOD;
    try {
      audit.parameters = [
        {
          name: AuditParam.HTTP_METHOD,
          value: reqMethod
        },
        {
          name: AuditParam.URL,
          value: reqUrl
        },
        {
          name: AuditParam.REFERER,
          value: this.getHeaderValue(headers['referer'])
        },
        {
          name: AuditParam.USER_AGENT,
          value: this.getHeaderValue(headers['user-agent'])
        },
        {
          name: AuditParam.CONSUMER,
          value: this.getHeaderValue(headers['meta-consumer'])
        },
        {
          name: AuditParam.VERSION,
          value: this.getHeaderValue(headers['meta-version'])
        },
        {
          name: AuditParam.X_HOST,
          value: this.getHeaderValue(headers['x-host'])
        },
        {
          name: AuditParam.RESPONSE_STATUS,
          value: status
        },
        {
          name: AuditParam.ELAPSED,
          value: ((endTime as unknown) as number) - (((reqStartTime as unknown) as number) || ((endTime as unknown) as number))
        },
        {
          name: AuditParam.REQUEST,
          value: reqMethod === 'GET' ? '' : this.getAuditRequest(reqBody, reqUrl)
        },
        {
          name: AuditParam.RESPONSE,
          value: this.getAuditResponse(respBody, reqUrl)
        }
      ];

      if (debugMode) {
        // Log all headers (except the ones we always log above)
        Object.keys(headers).forEach((key) => {
          switch (key.toLowerCase()) {
            case 'user-agent':
            case 'referer':
              break;
            default:
              audit.parameters.push({ name: 'H_' + key, value: headers[key] });
              break;
          }
        });
      }

      if (reqFiles.length) {
        audit.parameters.push({
          name: AuditParam.MULTIPART_REQUEST,
          value: this.getFilesInfo(reqFiles)
        });
      }
    } catch (e) {
      this._log.error(e);
      audit.parameters = [];
    }
    return audit;
  }

  public static maskUrlParams(url: string): string {
    return this.getScanner().scanUrlParams(url);
  }

  public static maskProps(input: object | string | Array<unknown>) {
    if (typeof input === 'object' || Array.isArray(input)) {
      return this.getScanner().scanInput(JSON.parse(JSON.stringify(input)));
    }

    return input;
  }

  private static getFilesInfo(files: Blob[]) {
    let size = 0;
    (files || []).forEach((f) => {
      size += f.size;
    });

    return JSON.stringify({ totalSize: size });
  }

  private static getAuditRequest(reqBody: object | string | Array<unknown> | { files?: Blob[] }, url: string): string {
    if (reqBody && typeof reqBody !== 'string' && (reqBody as { files?: Blob[] }).files) {
      (reqBody as { files?: Blob[] }).files = undefined;
    }

    if (this.needRequestMasking(url)) {
      reqBody = this.maskProps(reqBody);
    }

    if (typeof reqBody !== 'string') {
      reqBody = reqBody ? JSON.stringify(reqBody) : '';
    }

    return StringUtils.trimRight(StringUtils.trimLeft(reqBody, '"'), '"');
  }

  private static getHeaderValue(headerValue: string) {
    return headerValue || '';
  }

  private static getHeaderCookies(cookies: string) {
    return cookies || '';
  }

  private static getAuditResponse(body: object | string | Array<unknown> | Buffer, url: string): string {
    if (this.needSkipResponseBody(url)) {
      return 'response body skipped';
    }

    let resp = body;
    if (body instanceof fs.ReadStream) {
      resp = 'binary';
    } else if (this.needResponseMasking(url)) {
      resp = this.maskProps(body);
    }

    if (typeof resp !== 'string') {
      resp = JSON.stringify(resp || '').replace(/(\r|\n)/g, '');
    }

    return resp;
  }

  private static getScanner(): InputScanner {
    if (!this._scanner) {
      this._scanner = new InputScanner(APP.config.security ? APP.config.security.maskedProps : [], [], [], [], {}, []);
    }
    return this._scanner;
  }

  private static needRequestMasking(url: string): boolean {
    for (const regExString of APP.config.audit.restMaskRequestUrls || []) {
      const regex = new RegExp(regExString, 'gi');
      if (regex.test(url)) {
        return true;
      }
    }

    return false;
  }

  private static needResponseMasking(url: string): boolean {
    for (const regExString of APP.config.audit.restMaskResponseUrls || []) {
      const regex = new RegExp(regExString, 'gi');
      if (regex.test(url)) {
        return true;
      }
    }

    return false;
  }

  private static needSkipResponseBody(url: string) {
    for (const regExString of APP.config.audit.restBodyOptional || []) {
      const regex = new RegExp(regExString, 'gi');
      if (regex.test(url)) {
        return true;
      }
    }

    return false;
  }
}
