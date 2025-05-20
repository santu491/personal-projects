export interface TokenInfo {
  expireTime: number;
  token: string;
}

export enum RequestMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}
