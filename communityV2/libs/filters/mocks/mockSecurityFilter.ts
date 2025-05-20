import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { SecurityFilter } from './../securityFilter';

export const mockSecurityFilter: Mockify<SecurityFilter> = {
  scanRequest: jest.fn(),
  scanHeaders: jest.fn(),
  scanCookies: jest.fn(),
  scanUrlParams: jest.fn(),
  scanUrlQueryString: jest.fn(),
  scanBody: jest.fn()
};
