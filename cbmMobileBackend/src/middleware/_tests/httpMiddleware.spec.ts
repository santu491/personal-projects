import express from 'express';
import {HttpError} from 'routing-controllers';
import {HttpErrorHandler} from '../httpMiddleware';

describe('httpMiddleware', () => {
  let middleware: HttpErrorHandler;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: express.NextFunction;

  beforeEach(() => {
    middleware = new HttpErrorHandler();
    req = {};
    res = {
      statusCode: 401,
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle error: HttpError', () => {
    const error: HttpError = {
      message: 'Error',
      httpCode: 401,
      name: '',
    };
    middleware.error(error, req as express.Request, res as express.Response);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({exceptionMsg: 'Error'});
  });

  it('should handle error: instance of HttpError', () => {
    const error = new HttpError(401, 'Error');
    middleware.error(error, req as express.Request, res as express.Response);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({errors: [{title: 'Error'}]});
  });
});
