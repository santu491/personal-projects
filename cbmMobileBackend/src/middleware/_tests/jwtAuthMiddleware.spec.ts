import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {Request as CustomRequest} from '../../types/customRequest';
import {decrypt} from '../../utils/security/encryptionHandler';
import {JwtMiddleware} from '../jwtAuthMiddleware';
import {getCache} from '../../utils/cacheUtil';

jest.mock('../../utils/security/encryptionHandler', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

jest.mock('../../utils/cacheUtil', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  clearCache: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest
    .fn()
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userName: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userName: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce(null),
}));

describe('jwtAuthMiddleWare', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const jwtVerifyOptions = {ignoreExpiration: false};

  it('If request is public', async () => {
    const jwtMiddleware = new JwtMiddleware();
    const res = {} as unknown as Response;
    res.send = jest.fn();
    res.get = jest.fn();
    res.set = jest.fn();
    res.status = jest.fn(() => res);

    const next = jest.fn();

    const req = {
      url: 'http://localhost:3000/v1/public/login',
    } as unknown as CustomRequest;

    const response = jwtMiddleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(response).toMatchObject({});
  });

  it('If request is for refreshMemberAuth', async () => {
    const jwtMiddleware = new JwtMiddleware();
    const res = {} as unknown as Response;
    res.send = jest.fn();
    res.get = jest.fn();
    res.set = jest.fn();
    res.status = jest.fn(() => res);

    const next = jest.fn();

    const req = {
      url: 'http://localhost:3000/v1/auth/refresh',
    } as unknown as CustomRequest;

    const response = jwtMiddleware.use(req, res, next);
    expect(response).toMatchObject({});
  });

  it('If request is for secure end point', async () => {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N';
    const jwtMiddleware = new JwtMiddleware();
    const res = {} as unknown as Response;
    res.send = jest.fn();
    res.get = jest.fn();
    res.set = jest.fn();
    res.status = jest.fn(() => res);

    const next = jest.fn();
    (decrypt as jest.Mock).mockReturnValue('accessToken');

    const req = {
      headers: {
        authorization: 'Bearer ' + authToken,
      },
    } as unknown as CustomRequest;
    (getCache as jest.Mock).mockReturnValue(authToken);

    const response = jwtMiddleware.use(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      'accessToken',
      jwtVerifyOptions,
    );
    expect(next).toHaveBeenCalled();
    expect(response).toMatchObject({});
  });

  it('If invalid token is sent', async () => {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N';
    const jwtMiddleware = new JwtMiddleware();
    const res = {} as unknown as Response;
    res.send = jest.fn();
    res.get = jest.fn();
    res.set = jest.fn();
    res.status = jest.fn(() => res);

    const next = jest.fn();

    const req = {
      headers: {
        authorization: 'Bearer ' + authToken,
      },
    } as unknown as CustomRequest;
    (decrypt as jest.Mock).mockReturnValue('accessToken');

    await jwtMiddleware.use(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      'accessToken',
      jwtVerifyOptions,
    );
  });

  it('If request is for secure end point - No Token sent', async () => {
    const jwtMiddleware = new JwtMiddleware();
    const res = {} as unknown as Response;
    res.send = jest.fn();
    res.get = jest.fn();
    res.set = jest.fn();
    res.status = jest.fn(() => res);

    const next = jest.fn();
    (decrypt as jest.Mock).mockResolvedValue('accessToken');

    const req = {
      headers: {},
    } as unknown as CustomRequest;
    const response = jwtMiddleware.use(req, res, next);
    expect(response).toMatchObject({});
  });
});
