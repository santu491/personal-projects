import { IHttpResponse } from './iHttpResponse';
import { IHttpRequest } from './iHttpRequest';

export interface IHttpClient {
  request(requestOptions: IHttpRequest): Promise<IHttpResponse>;
}
