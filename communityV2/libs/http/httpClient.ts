import { ILogger, LoggerFactory } from '@anthem/communityapi/logger';
import request, * as http from 'request';
import { Service } from 'typedi';
import { IHttpClient } from './interfaces/iHttpClient';
import { IHttpRequest } from './interfaces/iHttpRequest';
import { IHttpRequestInterceptor } from './interfaces/iHttpRequestInterceptor';
import { IHttpResponse } from './interfaces/iHttpResponse';
import { IHttpResponseInterceptor } from './interfaces/iHttpResponseInterceptor';
import { IUrlParam } from './interfaces/iUrlParam';
import { UrlHelper } from './urlHelper';

/**
 *  Custom HTTP Client to be used for any http calls from the application.
 *  This uses Http provider from Angular framework.
 *  and allows modifying request headers and request data and also handle response using interceptors.
 */
@Service()
export class HttpClient implements IHttpClient {
  protected _respInterceptors: IHttpResponseInterceptor[] = [];
  protected _reqInterceptors: IHttpRequestInterceptor[] = [];
  private _log: ILogger = LoggerFactory.getLogger(__filename);
  private _http: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;

  constructor(private _urlHelper: UrlHelper) {
    this._http = http;
  }

  mockHttp(httpRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>) {
    this._http = httpRequest;
  }

  /**
   *  allows making HTTP request with given HTTP method and other feature.
   *  @param requestOptions - request opetions for making the Request.
   *  @return - returned promise which can be used to handle http response success/fail.
   */
  async request(requestOptions: IHttpRequest): Promise<IHttpResponse> {
    try {
      requestOptions.responseInterceptors = (requestOptions.responseInterceptors || []).concat(this._respInterceptors);
      requestOptions.requestInterceptors = (requestOptions.requestInterceptors || []).concat(this._reqInterceptors);

      requestOptions = this.runRequestInterceptors(requestOptions);
      requestOptions = this.trimSpaces(requestOptions);
      const finalReqUrl = this.getUrl(requestOptions.url, requestOptions.urlParams);

      let resp: IHttpResponse = null;
      resp = await this.internalRequest(requestOptions, finalReqUrl);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   *  Add/Register global request interceptor to be run on all HTTP requests from this provider.
   *  @param interceptor - request internceptor
   */
  addRequestInterceptor(interceptor: IHttpRequestInterceptor) {
    this._reqInterceptors.push(interceptor);
  }

  /**
   *  Add/Register global response interceptor to be run on all HTTP responses from this provider.
   *  @param {IHttpResponseInterceptor} interceptor - response internceptor
   */
  addResponseInterceptor(interceptor: IHttpResponseInterceptor) {
    this._respInterceptors.push(interceptor);
  }

  protected runRequestInterceptors(httpRequest: IHttpRequest): IHttpRequest {
    httpRequest.requestInterceptors.forEach((interceptor) => {
      httpRequest = interceptor.transform(httpRequest);
    });

    return httpRequest;
  }

  protected trimSpaces(httpRequest: IHttpRequest): IHttpRequest {
    if (httpRequest.trimSpaces === true) {
      (httpRequest.urlParams || []).forEach((p) => {
        p.value = p.value.trim();
      });

      if (!httpRequest.isMultiPartRequest && httpRequest.data) {
        try {
          httpRequest.data = JSON.parse(JSON.stringify(httpRequest.data).replace(/"\s+|\s+"/g, '"'));
        } catch (e) {
          this._log.error(`error trimming spaces: ${e}`);
        }
      }
    }

    return httpRequest;
  }

  protected runResponseInterceptors(response: IHttpResponse, httpRequest: IHttpRequest, interceptors: IHttpResponseInterceptor[]): IHttpResponse {
    interceptors.forEach((interceptor) => {
      response = interceptor.transform(response, httpRequest);
    });

    return response;
  }

  protected internalRequest(requestOptions: IHttpRequest, finalRequestUrl: string): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {
      const options: http.CoreOptions & http.UrlOptions = {
        url: finalRequestUrl,
        headers: this.getHttpHeaders(requestOptions),
        method: this.getHttpMethod(requestOptions),
        forever: requestOptions.keepAlive
        //qs: this.getHttpParams(requestOptions.urlParams)
      };
      if (requestOptions.raw) {
        options.encoding = null;
      }

      if (requestOptions.noSsl) {
        options.strictSSL = false;
      }

      if (requestOptions.proxy && requestOptions.noSsl) {
        options.proxy = requestOptions.proxy;
      }

      if (requestOptions.isMultiPartRequest) {
        options.body = undefined;
        options.multipart = {
          data: (requestOptions.data as unknown) as { 'content-type'?: string; body: request.MultipartBody }[]
        };
      } else {
        options.body = this.getHttpBody(requestOptions);
      }

      if (requestOptions.timeout) {
        options.timeout = requestOptions.timeout;
      }

      this._http(options, (error: object, response: http.RequestResponse) => {
        // Verify if the requests was successful and append user
        // information to our extended express request object
        let resp = this.getHttpResponse(response, finalRequestUrl, error);
        if (requestOptions.responseInterceptors && requestOptions.responseInterceptors.length) {
          resp = this.runResponseInterceptors(resp, requestOptions, requestOptions.responseInterceptors);
        }

        if (resp.status >= 200 && resp.status <= 206) {
          return resolve(resp);
        } else {
          return reject(resp);
        }
      });
    });
  }

  protected getHttpResponse(rawResp: http.RequestResponse, finalRequestUrl: string, error: object): IHttpResponse {
    if (!rawResp) {
      return {
        status: undefined,
        body: error,
        headers: {},
        requestUrl: finalRequestUrl,
        contentType: ''
      };
    }

    let data = {};
    let contentType = '';
    try {
      if (rawResp.headers && rawResp.headers['content-type']) {
        contentType = rawResp.headers['content-type'];
      }

      if (contentType.indexOf('application/json') >= 0 && rawResp.body) {
        data = JSON.parse(rawResp.body);
      } else if (contentType.indexOf('text/html') >= 0 && rawResp.body) {
        data = (rawResp.body || '').replace(/(\r|\n)/g, '');
      } else if (rawResp.body) {
        data = rawResp.body;
      } else if (error && rawResp.statusCode !== 200 && rawResp.statusCode !== 201) {
        data = error;
      } else {
        data = {};
      }
    } catch (e) {
      this._log.error(e as Error);
      data = {};
    }

    return {
      status: rawResp.statusCode,
      body: data,
      headers: rawResp.headers,
      requestUrl: finalRequestUrl,
      contentType: contentType
    };
  }

  protected getHttpHeaders(requestOptions: IHttpRequest): http.Headers {
    const headers: http.Headers = {};
    (requestOptions.headers || []).forEach((header) => {
      if (typeof header.value !== 'undefined') {
        headers[header.name] = header.value;
      }
    });

    return headers;
  }

  protected getHttpBody(requestOptions: IHttpRequest): string | Buffer | object {
    if (requestOptions.data) {
      return requestOptions.isMultiPartRequest || requestOptions.isFormData ? requestOptions.data : JSON.stringify(requestOptions.data);
    }

    return null;
  }

  protected getHttpMethod(requestOptions: IHttpRequest): string {
    return requestOptions.method;
  }

  protected getUrl(url: string, urlParams: IUrlParam[] = []): string {
    for (const param of urlParams) {
      if (!param.isQueryParam && !new RegExp('^\\d+$').test(param.name) && param.value && new RegExp('(^|[^\\\\]):' + param.name + '(\\W|$)').test(url)) {
        const encVal = this._urlHelper.encodeUriSegment(param.value);
        url = url.replace(new RegExp(':' + param.name + '(\\W|$)', 'g'), (match, p1) => {
          return encVal + p1;
        });
      } else if (param.isQueryParam && param.value && param.name) {
        url = url + this.addQueryparam(url, param.name, param.value);
      }
    }

    return url;
  }

  protected addQueryparam(url: string, name: string, value: string) {
    let param = '';
    if (url.toLowerCase().indexOf(name.toLowerCase() + '=') < 0) {
      if (url.indexOf('?') < 0) {
        param = '?';
      } else {
        param = '&';
      }

      param = param + name + '=' + this._urlHelper.encodeUriSegment(value);
    }

    return param;
  }
}
