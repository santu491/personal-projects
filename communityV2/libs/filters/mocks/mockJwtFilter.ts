import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { JwtFilter } from './../jwtFilter';

export const mockJwtFilter: Mockify<JwtFilter> = {
  validateToken: jest.fn(),
  validateSecureToken: jest.fn(),
  isAuthorizationOptional: jest.fn(),
  setUserIdentity: jest.fn()
};
