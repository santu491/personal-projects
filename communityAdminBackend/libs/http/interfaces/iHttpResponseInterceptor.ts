import { IHttpRequest } from './iHttpRequest';
import { IHttpResponse } from './iHttpResponse';

export interface IHttpResponseInterceptor {
  transform(response: IHttpResponse, request: IHttpRequest): IHttpResponse;
}
