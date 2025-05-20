import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { SecureJwtToken } from './../secureJwtToken';

export const mockSecureJwtToken: Mockify<SecureJwtToken> = {
  generateToken: jest.fn(),
  verify: jest.fn(),
  generategbdToken: jest.fn(),
  decode: jest.fn(),
  verifyRSA: jest.fn()
};
