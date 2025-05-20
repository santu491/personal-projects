import { RestClient } from '@anthem/communityapi/rest';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';

// TODO: merge this one and the one under irx into a common one
export const mockRestClient: Mockify<RestClient> = {
  invoke: jest.fn()
};
