import {APP} from '../../utils/app';
import {appConfig} from '../../utils/mockData';
import {ResponseMiddleware} from '../responseMiddleware';
import express from 'express';

describe('ResponseMiddleware', () => {
  let middleware: ResponseMiddleware;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: express.NextFunction;

  beforeEach(() => {
    APP.config.security = appConfig.security;
    middleware = new ResponseMiddleware();
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      setHeader: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle json response: Object', () => {
    const json = {
      data: {
        token: 'token',
      },
      statusCode: 200,
    };
    middleware.use(req as express.Request, res as express.Response, next);

    (res.json as jest.Mock)(json);

    expect(res.cookie).toHaveBeenCalledWith('jwt', 'token', expect.any(Object));
    expect(next).toHaveBeenCalled();
  });

  it('should handle json response', () => {
    const json = 1;
    (res.json as jest.Mock)(json);
    middleware.use(req as express.Request, res as express.Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should handle json response', () => {
    const json = {
      data: {
        isSuccess: false,
        statusCode: 401,
        value: {
          token: 'token',
        },
      },
    };
    middleware.use(req as express.Request, res as express.Response, next);
    (res.json as jest.Mock)(json);

    expect(next).toHaveBeenCalled();
  });

  it('should hanlde headers in response', () => {
    const json = {
      data: {
        isSuccess: false,
        statusCode: 401,
        value: {
          token: 'token',
        },
        token: 'token',
        headers: [{key: 'auth', value: 'token'}],
      },
    };
    middleware.use(req as express.Request, res as express.Response, next);
    (res.json as jest.Mock)(json);

    expect(next).toHaveBeenCalled();
  });
});
