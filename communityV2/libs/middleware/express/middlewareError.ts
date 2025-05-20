export class MiddlewareError implements Error {
  name: string;
  message: string;
  stack?: string;
  code: string;

  constructor(message: string, code?: string) {
    this.code = code;
    this.message = message;
  }
}
