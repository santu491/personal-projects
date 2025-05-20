import { RestClient } from '@anthem/communityadminapi/rest';
import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';

// TODO: merge this one and the one under irx into a common one
export const mockRestClient: Mockify<RestClient> = {
  invoke: jest.fn()
};
