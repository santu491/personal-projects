import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { PublicJwtToken } from '../publicJwtToken';

export const mockPublicwtToken: Mockify<PublicJwtToken> = {
  generateToken: jest.fn(),
  verify: jest.fn()
};
