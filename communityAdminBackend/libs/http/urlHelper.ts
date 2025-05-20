import { Service } from 'typedi';
import { IUrlParam } from './interfaces/iUrlParam';

/**
 * Helper provider to handle various url level functions.
 */
@Service()
export class UrlHelper {
  /**
   * Allow encoding chars on url.
   * @param val - url string
   */
  encodeUriSegment(val: string) {
    return this.encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
  }

  /**
   *  Allow encoding parameters in url
   *  @param val - url stirng
   *  @param pctEncodeSpaces - should encode spaces or not
   */
  encodeUriQuery(val: string, pctEncodeSpaces: boolean) {
    return encodeURIComponent(val)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
  }

  /**
   *  Add url parameter to url. include & or = depending on the url.
   * */
  getUrlParam(name: string, value: string, url: string) {
    let param = '';
    if (url.toLowerCase().indexOf(name.toLowerCase() + '=') < 0) {
      if (url.indexOf('?') < 0) {
        param = '?';
      } else {
        param = '&';
      }

      param = param + name + '=' + value;
    }

    return param;
  }

  getAllUrlParameters(url = ''): IUrlParam[] {
    const params: IUrlParam[] = [];
    if (url.indexOf('?') >= 0) {
      url
        .split('?')[1]
        .split('&')
        .forEach((p) => {
          const s = p.split('=');
          params.push({
            name: s[0],
            value: s.length >= 2 ? s[1] : '',
            isQueryParam: true
          });
        });
    }

    return params;
  }

  getUrlParameter(name: string, url: string): string {
    let value = '';
    this.getAllUrlParameters(url).forEach((param) => {
      if (name === param.name) {
        value = param.value;
        return;
      }
    });

    return value;
  }
}
