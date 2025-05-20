import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { PublicJwtToken } from '../publicJwtToken';

export const mockPublicwtToken: Mockify<PublicJwtToken> = {
  generateToken: jest.fn(),
  verify: jest.fn()
};
