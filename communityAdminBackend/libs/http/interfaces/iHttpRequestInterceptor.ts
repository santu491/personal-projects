import { IHttpRequest } from './iHttpRequest';

export interface IHttpRequestInterceptor {
  transform(requestOptions: IHttpRequest): IHttpRequest;
}
