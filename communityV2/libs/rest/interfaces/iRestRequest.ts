import { HttpMethod, IHttpHeader, IHttpRequestInterceptor, IHttpResponseInterceptor, IUrlParam } from '@anthem/communityapi/http';

export interface IRestRequest {
  url: string;
  urlParams?: IUrlParam[];
  headers?: IHttpHeader[];
  method: HttpMethod;
  timeout?: number;
  data?: object | Array<object> | string;
  responseType: ResponseType;
  isMultiPartRequest?: boolean;
  isFormData?: boolean;
  responseInterceptors?: IHttpResponseInterceptor[];
  requestInterceptors?: IHttpRequestInterceptor[];
  allowExceptions?: boolean;
  cacheable?: boolean;
  cacheExpiry?: number;
  requestName?: string;
  allowRawResponse?: boolean;
  skipReplaceHost?: boolean;
  skipAudit?: boolean;
  resetCache?: boolean;
}

export enum ResponseType {
  JSON = 1,
  TEXT = 2,
  BINARY = 3,
  BINARY_RAW = 4
}
