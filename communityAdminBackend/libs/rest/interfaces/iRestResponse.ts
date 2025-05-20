export interface IRestResponse {
  headers: { [key: string]: string };
  body: string | object | Array<object> | Buffer;
  status: number;
}
