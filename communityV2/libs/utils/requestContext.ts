import * as cls from 'cls-hooked';
import * as express from 'express';

export class RequestContext {
  private static CONTEXT_NAME = 'RequestLogContext';
  private static _context: {
    bindEmitter: (param: express.Request | express.Response) => void;
    run: (func: () => void) => void;
  };

  public static createNamespace() {
    this._context = cls.createNamespace(RequestContext.CONTEXT_NAME);
  }

  public static initLoggingContext(req: express.Request, res: express.Response, headers: { [key: string]: string }, cookies: { [key: string]: string }, cb: () => void, requestId = '') {
    if (!this._context) {
      throw Error('CLS namespace required');
    }
    this._context.bindEmitter(req);
    this._context.bindEmitter(res);
    this._context.run(() => {
      const context: { set: (key: string, value: string) => void } = cls.getNamespace(RequestContext.CONTEXT_NAME);
      context.set('requestId', requestId);
      context.set('sessionId', this.getSessionId(cookies, headers));
      context.set('clientIp', this.getClientIp(headers));
      context.set('flow', this.getFlow(headers));
      context.set('brandCd', this.getBrandCd(headers));
      context.set('consumerApp', this.getConsumerApp(headers));
      context.set('debugMode', this.getDebugModeInternal(cookies));
      context.set('locale', this.getLocale(headers));
      cb();
    });
  }

  public static getContextItem(itemName: string): string {
    const context = cls.getNamespace(RequestContext.CONTEXT_NAME);
    return context && context.get(itemName) ? context.get(itemName) : '';
  }

  public static setContextItem(name: string, value: string | number | boolean) {
    if (value && value !== null) {
      const context = cls.getNamespace(RequestContext.CONTEXT_NAME);
      if (context && context !== null) {
        context.set(name, value);
      }
    }
  }

  //** True if cookie debug mode is enabled. It's used to log additional info when it's enabled. */
  public static debugModeEnabled(): boolean {
    return this.getContextItem('debugMode') === 'y';
  }

  private static getDebugModeInternal(cookies: { [key: string]: string }): string {
    const debugMode = this.getCookieAttr(cookies, 'tcpdebug') === 'y' ? 'y' : '';
    return debugMode;
  }

  private static getSessionId(cookies: { [key: string]: string }, headers: { [key: string]: string }): string {
    const cid = cookies ? cookies['TLTSID'] : '';
    const hid = headers ? headers['meta-sessionid'] : '';
    return cid || hid || '';
  }

  private static getClientIp(headers: { [key: string]: string }): string {
    let ip = 'unknown';
    const ipHeaders = ['true-client-ip', 'x-forwarded-for', 'remote_addr'];

    for (const ipHeader of ipHeaders) {
      if (typeof headers[ipHeader] !== 'undefined' && headers[ipHeader] !== '') {
        ip = headers[ipHeader];
        break;
      }
    }

    return ip;
  }

  private static getFlow(headers: { [key: string]: string }): string {
    return headers['meta-flow'] || '';
  }

  private static getBrandCd(headers: { [key: string]: string }): string {
    return headers['meta-brandcd'] || '';
  }

  private static getConsumerApp(headers: { [key: string]: string }): string {
    return headers['meta-consumer'] || '';
  }

  private static getLocale(headers: { [key: string]: string }): string {
    // Default set to EN if no value is sent by UI
    return headers['meta-locale'] || 'EN';
  }

  /** Get value of a specific cookie attribute */
  private static getCookieAttr(cookies: { [key: string]: string }, attr: string) {
    if (!cookies) {
      return undefined;
    } else {
      return cookies[attr];
    }
  }
}
