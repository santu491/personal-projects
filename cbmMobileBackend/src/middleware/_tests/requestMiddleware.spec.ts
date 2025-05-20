import {RequestMiddleware} from '../requestMiddleware';
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {decrypt} from '../../utils/security/encryptionHandler';
import {APP} from '../../utils/app';
import logger from '../../utils/logger';
import {AuditParam} from '../../constants';
import {AuditFilter} from '../../utils/audit/auditFilter';
import {LogAudit} from '../../utils/audit/logAudit';

jest.mock('jsonwebtoken');
jest.mock('../../utils/security/encryptionHandler');
jest.mock('../../utils/logger');
jest.mock('../../utils/audit/auditFilter');
jest.mock('../../utils/audit/logAudit');

describe('RequestMiddleware', () => {
  let middleware: RequestMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new RequestMiddleware();
    req = {
      headers: {},
      method: 'GET',
      body: {},
    } as Partial<Request>;
    res = {};
    next = jest.fn();
    (logger as jest.Mock).mockReturnValue({
      info: jest.fn(),
    });
    (AuditFilter as jest.Mock).mockImplementation(() => ({
      getRequestUrl: jest.fn().mockReturnValue('/test-url'),
      getAuditedRequestBody: jest.fn().mockReturnValue({}),
      getAuditedRequestHeaders: jest.fn().mockReturnValue({}),
    }));
    (LogAudit as jest.Mock).mockImplementation(() => ({
      getAuditMessage: jest.fn().mockReturnValue('audit-log'),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should call next when no authorization header is present', () => {
    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should decode the token and add sessionId to headers if token is valid', () => {
    const mockToken = 'mockToken';
    const mockSessionId = 'mockSessionId';
    req.headers = req.headers || {};
    req.headers.authorization = `Bearer ${mockToken}`;
    (decrypt as jest.Mock).mockReturnValue('mockSecret');
    (jwt.verify as jest.Mock).mockReturnValue({sessionId: mockSessionId});

    middleware.use(req as Request, res as Response, next);

    expect(decrypt).toHaveBeenCalledWith(APP.config.JWT);
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'mockSecret', {
      ignoreExpiration: false,
    });
    expect(req.headers?.[AuditParam.TRACE_ID]).toBe(mockSessionId);
    expect(next).toHaveBeenCalled();
  });
  //   const mockToken = 'mockToken';
  //   req.headers = req.headers || {};
  //   req.headers.authorization = `Bearer ${mockToken}`;
  //   (decrypt as jest.Mock).mockReturnValue('mockSecret');
  //   (jwt.verify as jest.Mock).mockImplementation(() => {
  //     throw new Error('Invalid token');
  //   });

  //   middleware.use(req as Request, res as Response, next);

  //   expect(decrypt).toHaveBeenCalledWith(APP.config.JWT);
  //   expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'mockSecret', {
  //     ignoreExpiration: false,
  //   });
  //   expect(req.headers?.[AuditParam.TRACE_ID] ?? undefined).toBeUndefined();
  //   expect(next).toHaveBeenCalled();
  // });

  // it('should log the incoming request', () => {
  //   const mockLogger = logger();
  //   const mockAuditFilter = new AuditFilter();
  //   const mockLogAudit = new LogAudit([]);

  //   middleware.use(req as Request, res as Response, next);

  //   expect(mockAuditFilter.getAuditedRequestBody).toHaveBeenCalledWith(
  //     req.body,
  //   );
  //   expect(mockAuditFilter.getAuditedRequestHeaders).toHaveBeenCalledWith(
  //     req.headers,
  //   );
  //   expect(mockLogAudit.getAuditMessage).toHaveBeenCalled();
  //   expect(mockLogger.info).toHaveBeenCalledWith('Incoming Request: audit-log');
  //   expect(next).toHaveBeenCalled();
  // });

  // it('should handle missing JWT secret gracefully', () => {
  //   const mockToken = 'mockToken';
  //   req.headers = req.headers || {};
  //   req.headers.authorization = `Bearer ${mockToken}`;
  //   (decrypt as jest.Mock).mockReturnValue(null);

  //   middleware.use(req as Request, res as Response, next);

  //   expect(decrypt).toHaveBeenCalledWith(APP.config.JWT);
  //   expect(jwt.verify).not.toHaveBeenCalled();
  //   expect(req.headers?.[AuditParam.TRACE_ID] ?? undefined).toBeUndefined();
  //   expect(next).toHaveBeenCalled();
  // });
});
