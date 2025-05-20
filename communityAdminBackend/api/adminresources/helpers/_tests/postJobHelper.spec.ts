import {
  mockMongo,
  mockSqsService
} from '@anthem/communityadminapi/common/baseTest';
import { PostJobHelper } from '../postJobHelper';

describe('PostJobHelper', () => {
  let postHelper: PostJobHelper;

  beforeEach(() => {
    postHelper = new PostJobHelper(<any>mockMongo, <any>mockSqsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
