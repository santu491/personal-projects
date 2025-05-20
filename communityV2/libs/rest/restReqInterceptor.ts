import { HttpMethod, IHttpHeader, IHttpRequest, IHttpRequestInterceptor } from '@anthem/communityapi/http';
import { APP, RequestContext } from '@anthem/communityapi/utils';
import { v4 as uuid } from 'uuid';

export class RestRequestInterceptor implements IHttpRequestInterceptor {
  transform(requestOptions: IHttpRequest): IHttpRequest {

    if (APP.config.restApi.timeout && typeof requestOptions.timeout === 'undefined' && requestOptions.method === HttpMethod.Get) {
      if (requestOptions.url.includes('zipcodes') && requestOptions.url.includes('programs')) {
        requestOptions.timeout = APP.config.restApi.timeoutAuntBertha;
      }
      else {
        requestOptions.timeout = APP.config.restApi.timeout;
      }
    }
    if (requestOptions.data !== undefined && requestOptions.data !== null) {
      this.addHeader(requestOptions.headers, 'Content-Type', 'application/json');
    }
    this.addHeader(requestOptions.headers, 'Accept', 'application/json');

    this.addHeader(requestOptions.headers, 'meta-sessionid', uuid());
    this.addHeader(requestOptions.headers, 'meta-transid', uuid());
    this.addHeader(requestOptions.headers, 'meta-messageid', uuid());
    this.addHeader(requestOptions.headers, 'meta-ipaddress', RequestContext.getContextItem('clientIp'));
    this.addHeader(requestOptions.headers, 'meta-locale', RequestContext.getContextItem('locale'));

    if (APP.config.restApi.replaceHost && requestOptions.url && !requestOptions.skipReplaceHost) {
      (APP.config.restApi.replaceHost || []).forEach((h) => {
        (h.default || '').split('|').forEach((url: string) => {
          requestOptions.url = requestOptions.url.replace(url, h.new);
        });
      });
    }

    if (APP.config.restApi.customHeaders) {
      (APP.config.restApi.customHeaders || []).forEach((h) => {
        if (h.name && h.value) {
          this.addHeader(requestOptions.headers, h.name, h.value);
        }
      });
    }

    return requestOptions;
  }

  private addHeader(existingHeaders: IHttpHeader[], headerName: string, headerValue: string) {
    if (headerValue && (!existingHeaders || !existingHeaders.find((h) => h.name === headerName))) {
      existingHeaders = existingHeaders || [];
      existingHeaders.push({
        name: headerName,
        value: headerValue
      });
    }
  }
}
