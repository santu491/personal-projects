import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ILogger } from './../interfaces/iLogger';

export const mockILogger: Mockify<ILogger> = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  audit: jest.fn(),
  DEFAULT_SCOPE: ('' as unknown) as jest.Mock<unknown>,
  uiLog: jest.fn(),
  uiAudit: jest.fn()
};
