import { HttpMethod } from './../enums/httpMethodEnum';
import { IHttpHeader } from './iHttpHeader';
import { IHttpRequestInterceptor } from './iHttpRequestInterceptor';
import { IHttpResponseInterceptor } from './iHttpResponseInterceptor';
import { IUrlParam } from './iUrlParam';

/**
 * Interface representing HTTP request object
 */
export interface IHttpRequest {
  /**
   * url of the http request
   * dynamic parameters can be included that will be replaced using urlParams
   *  Ex: member/:uid/sso. where :uid can be a urlParam
   */
  url: string;

  /**
   * list of url parameters that can either be part of the url or query string.
   * use in conjunction with url property.
   */
  urlParams?: IUrlParam[];

  /**
   * list of http headers
   */
  headers?: IHttpHeader[];

  /**
   * http method
   * Ex: POST, GET, DELETE, PUT etc...
   */
  method: HttpMethod;

  /**
   * timeout for http request. if value given, http request will be cancelled on timeout if still pendig.
   */
  timeout?: number;

  /**
   * array of response interceptors for this http request
   */
  responseInterceptors?: IHttpResponseInterceptor[];

  /**
   * array of request interceptors for this request
   */
  requestInterceptors?: IHttpRequestInterceptor[];

  /**
   * JSON data to be sent as part of request
   */
  data?: string | object | Array<unknown>;

  /**
   * set if http request data contains multipart data, which needs to be handled differently from httpclient
   */
  isMultiPartRequest?: boolean;

  /**
   * set the data as form data to support header application/x-www-form-urlencoded
   */
  isFormData?: boolean;

  /**
   * allows trimming spaces from request data and url parameter values
   */
  trimSpaces?: boolean;

  raw?: boolean;

  noSsl?: boolean;

  proxy?: string;

  cacheable?: boolean;

  cacheExpiry?: number;

  keepAlive?: boolean;

  skipReplaceHost?: boolean;

  resetCache?: boolean;
}
