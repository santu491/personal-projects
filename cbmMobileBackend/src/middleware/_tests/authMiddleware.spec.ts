import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {Action} from 'routing-controllers';
import {decrypt} from '../../utils/security/encryptionHandler';
import {authenticationHandler, currentUserhandler} from '../authMiddleware';

jest.mock('../../utils/security/encryptionHandler', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest
    .fn()
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userEmail: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userEmail: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce({
      clientId: 'carelonMobileApi',
      userId: '98z7z17z1897298c39p827c',
      userEmail: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userEmail: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userEmail: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    })
    .mockReturnValueOnce({
      userId: '98z7z17z1897298c39p827c',
      userEmail: 'test@example.com',
      roles: ['ADMIN', 'USER', 'BH_USER'],
      iat: 1712307237,
      exp: 1712310837,
    }),
}));

describe('authMiddleWare', () => {
  const jwtVerifyOptions = {ignoreExpiration: false};
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N';
  const payload: Action = {
    request: {
      headers: {
        authorization: 'Bearer ' + authToken,
      },
    },
    response: {
      status: {},
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('currentUserHandler - should ignore expiration for refresh', async () => {
    (decrypt as jest.Mock).mockReturnValue('accessToken');
    const action: Action = {
      request: {
        url: 'http://localhost:3000/v1/auth/refresh',
        headers: {
          authorization: 'Bearer ' + authToken,
        },
      },
      response: undefined,
    };
    await currentUserhandler(action);

    expect(jwt.verify).toHaveBeenCalledWith(authToken, 'accessToken', {
      ignoreExpiration: true,
    });
  });

  it('currentUserHandler - should return decoded value from auth', async () => {
    (decrypt as jest.Mock).mockReturnValue('accessToken');

    await currentUserhandler(payload);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      'accessToken',
      jwtVerifyOptions,
    );
  });

  it('currentUserHandler - should return decoded value from auth for the public client', async () => {
    (decrypt as jest.Mock).mockReturnValue('accessToken');

    const response = await currentUserhandler(payload);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      'accessToken',
      jwtVerifyOptions,
    );
    expect(response).toEqual({
      clientId: 'carelonMobileApi',
    });
  });

  it('authenticationHandler - should return true', async () => {
    (decrypt as jest.Mock).mockReturnValue('accessToken');
    const response = await authenticationHandler(payload, ['ADMIN']);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      'accessToken',
      jwtVerifyOptions,
    );
    expect(response).toEqual(true);
  });

  it('authenticationHandler - should return false', async () => {
    (decrypt as jest.Mock).mockReturnValue('accessToken');
    const response = await authenticationHandler(payload, ['ADMIN1']);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      'accessToken',
      jwtVerifyOptions,
    );
    expect(response).toBe(false);
  });

  it('authenticationHandler - should ignore expiration for refresh', async () => {
    (decrypt as jest.Mock).mockReturnValue('accessToken');
    const action: Action = {
      request: {
        url: 'http://localhost:3000/v1/auth/refresh',
        headers: {
          authorization: 'Bearer ' + authToken,
        },
      },
      response: undefined,
    };
    const response = await authenticationHandler(action, ['ADMIN1']);

    expect(jwt.verify).toHaveBeenCalledWith(authToken, 'accessToken', {
      ignoreExpiration: true,
    });
  });
});

describe('authMiddleWare - When Auth token is Invalid', () => {
  const jwtVerifyOptions = {ignoreExpiration: false};
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N';

  const payload: Action = {
    request: {
      headers: {
        authorization: 'Bearer ' + authToken,
      },
    },
    response: {},
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('currentUserhandler - Auth token invalid', async () => {
    (decrypt as jest.Mock).mockReturnValue(authToken);
    (jwt.verify as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
    });

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res);

    payload.response = res;

    await currentUserhandler(payload);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      authToken,
      jwtVerifyOptions,
    );
  });

  it('authenticationHandler - Auth token invalid', async () => {
    (decrypt as jest.Mock).mockReturnValue(authToken);
    (jwt.verify as jest.Mock).mockResolvedValue({email: 'test@example.com'});
    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res);

    payload.response = res;

    await authenticationHandler(payload, ['ADMIN1']);

    expect(jwt.verify).toHaveBeenCalledWith(
      authToken,
      authToken,
      jwtVerifyOptions,
    );
  });
});
