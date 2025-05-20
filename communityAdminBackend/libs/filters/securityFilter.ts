import { ILogger, LoggerFactory } from '@anthem/communityadminapi/logger';
import { InputScanner } from '@anthem/communityadminapi/security';
import { APP } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';

@Service()
export class SecurityFilter {
  private _log: ILogger = LoggerFactory.getLogger(__filename);
  private _inputScanner = new InputScanner(
    [],
    APP.config.security ? (APP.config.security.encodeProps as string[]) : [],
    APP.config.security ? (APP.config.security.passthroughProps as string[]) : [],
    APP.config.security && APP.config.security.whitelist ? APP.config.security.whitelist.body.values : {},
    {},
    APP.config.security ? APP.config.security.outputEncryptedProps : []
  );

  scanRequest(
    url: string,
    method: string,
    headers: { [key: string]: string },
    cookies: { [key: string]: string },
    params: { [key: string]: string },
    query: { [key: string]: string }
  ): {
      headers: { [key: string]: string };
      cookies: { [key: string]: string };
      params: { [key: string]: string };
      query: { [key: string]: string };
    } {
    if (this.isScanable(url, method)) {
      return {
        headers: this.scanHeaders(headers),
        cookies: this.scanCookies(cookies),
        params: this.scanUrlParams(params),
        query: this.scanUrlQueryString(query)
      };
    } else {
      return {
        headers: headers,
        cookies: cookies,
        params: params,
        query: query
      };
    }
  }

  scanHeaders(headers: { [key: string]: string }) {
    const sanitizedHeaders: { [key: string]: string } = {};
    const unallowed = [];
    for (const key in headers) {
      if (APP.config.security.whitelist.headers.allowed.indexOf(key.toLowerCase()) >= 0) {
        if (key.toLowerCase() !== 'cookie') {
          const regexVal = new RegExp((APP.config.security.whitelist.headers.values[key.toLowerCase()] as string) || APP.config.security.whitelist.headers.values.default, 'i');
          if (!regexVal.test(headers[key])) {
            this._log.warn(`Header value not allowed: ${key} ${headers[key]}`);
          }
          if (headers[key].length > APP.config.security.whitelist.headers.values.maxLength) {
            this._log.warn(`Header value too long: ${key} ${headers[key]}`);
          }
        }
        sanitizedHeaders[key] = headers[key];
      } else if (APP.config.security.whitelist.headers.blocked.indexOf(key.toLowerCase()) < 0) {
        unallowed.push(key);
      }
    }

    if (unallowed.length) {
      this._log.error(`UnAllowed header(s): ${unallowed.join(',')}`);
    }

    return sanitizedHeaders;
  }

  scanCookies(cookies: { [key: string]: string }) {
    const sanitizedCookies: { [key: string]: string } = {};
    const unallowed = [];
    for (const key in cookies) {
      if (APP.config.security.whitelist.cookies.allowed.indexOf(key.toLowerCase()) >= 0) {
        /*NOT handled in original api
        let regexVal = new RegExp(APP.config.security.whitelist.cookies.values[key.toLowerCase()] || APP.config.security.whitelist.cookies.values.default, 'i');
        if (!regexVal.test(cookies[key])) {
          throw Error(`Cookie value not allowed: ${cookies[key]}`);
        }
        if (cookies[key].length > APP.config.security.whitelist.cookies.values.maxLength) {
          throw Error(`Cookie value too long: ${cookies[key]}`);
        }*/
        sanitizedCookies[key] = cookies[key];
      } else {
        unallowed.push(key);
      }
    }

    if (unallowed.length) {
      this._log.error(`UnAllowed cookie(s): ${unallowed.join(',')}`);
    }

    return sanitizedCookies;
  }

  scanUrlParams(urlParams: { [key: string]: string }) {
    const sanitizedUrlParams: { [key: string]: string } = {};
    const regexNm = new RegExp(APP.config.security.whitelist.urlParams.names.default, 'i');
    for (const key in urlParams) {
      const regexVal = new RegExp((APP.config.security.whitelist.urlParams.values[key.toLowerCase()] as string) || APP.config.security.whitelist.urlParams.values.default, 'i');
      if (!regexNm.test(key)) {
        throw Error(`URL Param name not allowed: ${key}`);
      }
      if (!regexVal.test(urlParams[key])) {
        throw Error(`URL Param value not allowed: ${urlParams[key]}`);
      }
      if (key.length > APP.config.security.whitelist.urlParams.names.maxLength) {
        throw Error(`URL Param name too long: ${key}`);
      }
      if (urlParams[key].length > APP.config.security.whitelist.urlParams.values.maxLength) {
        throw Error(`URL Param value too long: ${urlParams[key]}`);
      }
      sanitizedUrlParams[key] = urlParams[key];
    }

    return sanitizedUrlParams;
  }

  scanUrlQueryString(urlQueries: { [key: string]: string }) {
    const sanitizedUrlQueries: { [key: string]: string } = {};
    const regexNm = new RegExp(APP.config.security.whitelist.urlQueries.names.default, 'i');
    for (const key in urlQueries) {
      const regexVal = new RegExp((APP.config.security.whitelist.urlQueries.values[key.toLowerCase()] as string) || APP.config.security.whitelist.urlQueries.values.default, 'i');
      if (!regexNm.test(key)) {
        throw Error(`URL Query name not allowed: ${key}`);
      }
      if (!regexVal.test(urlQueries[key])) {
        throw Error(`URL Query value not allowed: ${urlQueries[key]}`);
      }
      if (key.length > APP.config.security.whitelist.urlQueries.names.maxLength) {
        throw Error(`URL Query name too long: ${key}`);
      }
      if (urlQueries[key].length > APP.config.security.whitelist.urlQueries.values.maxLength) {
        throw Error(`URL Query value too long: ${urlQueries[key]}`);
      }
      sanitizedUrlQueries[key] = urlQueries[key];
    }

    return sanitizedUrlQueries;
  }

  scanBody(body: Array<object> | object | string): Array<object> | object | string {
    if (body) {
      return this._inputScanner.scanInput(body, 'root', '', APP.config.security.whitelist.body.values.maxLength);
    }

    return body;
  }

  private isScanable(url: string, method: string): boolean {
    let result = true;
    const rUrl = `${method.toUpperCase()}.${url}`;
    for (const urlRegex of APP.config.security.optionalUrls) {
      if (new RegExp(urlRegex, 'ig').test(rUrl)) {
        result = false;
        break;
      }
    }

    return result;
  }
}
