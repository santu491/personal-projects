import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { JwtTokenUtil } from './../jwtTokenUtil';

export const mockJwtTokenUtil: Mockify<JwtTokenUtil> = {
  generateToken: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn()
};
