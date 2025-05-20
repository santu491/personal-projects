import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { UserAttributeService } from 'api/communityresources/services/userAttributeService';

// TODO: merge this one and the one under irx into a common one
export const mockUserAttrSvc: Mockify<UserAttributeService> = {
  updateStoryPromotion: jest.fn(),
  updateCommunityVisit: jest.fn(),
  updateCommunityInfo: jest.fn()
};
