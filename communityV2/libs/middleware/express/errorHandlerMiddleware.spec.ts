import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { HttpError } from 'routing-controllers';
import { ErrorHandlerMiddleware } from './errorHandlerMiddleware';

describe('ErrorHandlerMiddleware UTest', () => {
  let middleware: ErrorHandlerMiddleware;

  beforeEach(() => {
    middleware = new ErrorHandlerMiddleware(<any>mockILogger);
  });

  it('should message property if error is HttpError', () => {
    let status = 0;
    let body: any = '1';
    let res: any = {
      statusCode: undefined,
      status: (s: number) => {
        status = s;
      },
      json: (r: string) => {
        body = r;
      }
    };

    middleware.error(
      new HttpError(400, 'error message'),
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(status).toBe(400);
    expect(body.exceptionMsg).toBe('error message');

    middleware.error(
      new HttpError(100, { test: 'error message' } as any),
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(status).toBe(500);
    expect(body.test).toBe('error message');

    middleware.error(
      new HttpError(200, '{ "test": "error message" }' as any),
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(status).toBe(500);
    expect(body.test).toBe('error message');
  });

  it('should stack property if error is Error', () => {
    let status = 0;
    let body: any = '1';
    let res: any = {
      statusCode: 200,
      status: (s: number) => {
        status = s;
      },
      json: (r: string) => {
        body = r;
      }
    };

    let e = new Error('error message');
    middleware.error(
      e,
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(status).toBe(500);
    expect(body.exceptionMsg).toBe(e.stack);

    e = new Error('error message');
    e.stack = null;
    middleware.error(
      e,
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(body.exceptionMsg).toBe('error message');

    e = new Error();
    e.stack = null;
    middleware.error(
      e,
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(body.exceptionMsg).toStrictEqual({});

    middleware.error(
      'test error',
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(body.exceptionMsg).toBe('test error');

    middleware.error(
      { test: 'test error' } as any,
      <any>{
        url: '/api/test'
      },
      res,
      () => {}
    );
    expect(body.exceptionMsg.test).toBe('test error');
  });


  afterEach(() => {
    //nop
  });
});
