import { Audit, DefaultLogger, IUiAuditItem, IUiLogItem } from '@anthem/communityapi/logger';
import { APP, RequestContext, StringUtils, getApiArgument } from '@anthem/communityapi/utils';
import * as os from 'os';
import { StaticLogger } from './staticLogger';

export type LogLevelType = 'warn' | 'log' | 'error' | 'debug' | 'info' | 'audit';

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

// TODO: Since put in checks to make sure they cannot post huge audit messages and potentially cause problems with our logs

export class DefaultLogger2 extends DefaultLogger {
  constructor(scope?: string) {
    super(scope);
  }

  public error(message: string | Error | object, ...args: unknown[]) {
    try {
      if (message instanceof Error) {
        message = message.stack || message.message || message;
      } else {
        message = this.parseJson(message) || '';
      }
      if (typeof message !== 'string') {
        message = message.toString();
      }
      message = message.replace(/(\r|\n)/g, '');
    } catch (e) {
      // tslint:disable
      // eslint-disable-next-line no-console
      console.error(e.stack || e.message || e);
      // eslint-disable-next-line no-console
      console.error(message);
      // tslint:enable
    }
    super.error(message as string, args);
  }

  public audit(audit: Audit | string, args: unknown[]) {
    this.log('audit', this.formatAudit(audit as Audit), audit as Audit, args);
  }

  public uiLog(logItem: IUiLogItem, ...args: unknown[]): void {
    let level: LogLevelType = 'error';
    switch (logItem.level) {
      case 0:
        level = 'debug';
        break;
      case 1:
        level = 'info';
        break;
      case 2:
        level = 'warn';
        break;
      default:
        level = 'error';
    }

    try {
      const uiMessage = `UiTime="${new Date(logItem.timestamp).toISOString()}" UserAgent="${logItem.userAgent}" Url="${logItem.url}" ${logItem.message}`;
      this.log(level, uiMessage, logItem, args);
    } catch (e) {
      //tslint:disable
      // eslint-disable-next-line no-console
      console.error(e);
      //tslint:enable
      throw e;
    }
  }

  public uiAudit(auditItem: IUiAuditItem, ...args: unknown[]) {
    try {
      const a = new Audit();
      a.code = auditItem.code;
      a.location = auditItem.location;
      a.elapsed = auditItem.elapsed;
      a.appName = auditItem.appName;
      a.operation = auditItem.operationName;
      a.message = auditItem.message;
      a.parameters = [
        {
          name: 'UiTime',
          value: new Date(auditItem.actionTime).toISOString()
        }
      ];

      auditItem.parameters = auditItem.parameters || {};
      for (const key1 in auditItem.parameters) {
        // Transform keys to title case
        let key2 = key1;
        if (key2.indexOf('_') > -1) {
          key2 = StringUtils.toTitleCase(key2.replace(/_/g, ' ')).replace(/ /g, '');
        } else {
          const alreadyInTitleCase = key2.replace(/[^A-Z]/g, '').length !== key2.length;
          key2 = alreadyInTitleCase ? key2 : StringUtils.toTitleCase(key2);
        }

        a.parameters.push({
          name: key2,
          value: auditItem.parameters[key1]
        });
      }

      this.audit(a, args);
    } catch (error) {
      // tslint:disable
      // eslint-disable-next-line no-console
      console.error(error);
      // tslint:enable
    }
  }

  protected log(level: LogLevelType, message: string, logItem: { appName?: string; location?: string }, args: unknown[]): void {
    try {
      let customLevel: string = level;
      if (level === 'warn') {
        customLevel = 'warning';
      }
      StaticLogger.logger[customLevel](this.formatLog(level, message, logItem), args);
    } catch (e) {
      //tslint:disable
      // eslint-disable-next-line no-console
      console.error(e);
      // eslint-disable-next-line no-console
      console.error(level);
      // eslint-disable-next-line no-console
      console.error(StaticLogger.logger);
      //tslint:enable
      throw e;
    }
  }

  protected formatAudit(audit: Audit): string {
    let params = '';
    audit.parameters.forEach((p) => {
      if (p.value) {
        params += `${p.name}="${p.value}" `;
      }
    });

    let ret = `Code=${audit.code}`;

    if (audit.operation) {
      ret += ` Op=${audit.operation}`;
    }

    if (audit.elapsed) {
      ret += ` Elapsed=${audit.elapsed}`;
    }
    ret += ` ${params}`;

    if (audit.message) {
      ret += ` Message="${audit.message}"`;
    }
    return ret;
  }

  protected formatLog(level: string, message: string, logItem?: { appName?: string; location?: string }): string {
    let appName = `api-${APP.config.appInfo.root}-${getApiArgument('api') || 'all'}`;
    appName = logItem && logItem.appName ? logItem.appName : appName;
    let loc = `${this.scope}${this.tryGetLineNumber()}`;
    loc = logItem && logItem.location ? logItem.location : loc;
    return `App=${appName} Lvl=${level} Loc=${loc} ${this.getRequestContextData()}ServerName=${os.hostname()} ${message}`;
  }

  protected getRequestContextData() {
    // TODO on local CIP=unknown for some reason
    const cip = RequestContext.getContextItem('clientIp');
    const sid = RequestContext.getContextItem('sessionId');
    const rid = RequestContext.getContextItem('requestId');
    const userNm = RequestContext.getContextItem('UserNm');
    const webGuid = RequestContext.getContextItem('WebGuid');
    const mbrUid = RequestContext.getContextItem('MbrUid');

    let ret = `${cip ? 'CIP=' + cip + ' ' : ''}${sid ? 'SID=' + sid + ' ' : ''}${rid ? 'RID=' + rid + ' ' : ''}${userNm ? 'UserNm=' + userNm + ' ' : ''}`;
    ret += `${webGuid ? 'WebGuid=' + webGuid + ' ' : ''}${mbrUid ? 'MbrUid=' + mbrUid + ' ' : ''}`;
    return ret;
  }

  protected parseJson(message: object | string | Array<unknown>): object | string | Array<unknown> {
    try {
      if (message && (typeof message === 'object' || Array.isArray(message))) {
        return JSON.stringify(message);
      }
    } catch (error) {
      //nop
    }

    return message;
  }

  protected tryGetLineNumber() {
    try {
      if (!APP.config.logging.showLineNumber) {
        return '';
      }

      const file = (this.scope || '').split('/').pop();

      //use Error object to get call stack and seperate each stack to validation against callee file
      const e = new Error('test');
      const eLines = (e.stack || '').toString().split(/(\r|\n)/);

      //only lookup max 30 call stacks to not impact performance
      if (eLines.length < 30) {
        for (const line of eLines) {
          if (line.indexOf(file) >= 0) {
            const grps = line.match(/[0-9]+:[0-9]+/);
            if (grps.length) {
              return `:${grps[0]}`;
            }
          }
        }
      }
    } catch (error) {
      //unhandle
    }

    return '';
  }
}
