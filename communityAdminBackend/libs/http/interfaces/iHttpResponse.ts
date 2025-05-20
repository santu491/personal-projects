import { IncomingHttpHeaders } from 'http';

export interface IHttpResponse {
  status: number;
  body: string | Buffer | object;
  headers: IncomingHttpHeaders;
  requestUrl: string;
  contentType: string;
}
