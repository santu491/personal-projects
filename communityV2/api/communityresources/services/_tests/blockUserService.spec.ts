import {
  mockBinder,
  mockMongo,
  mockResult,
  mockStory
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Binder } from 'api/communityresources/models/binderModel';
import { Reaction } from 'api/communityresources/models/reactionModel';
import { Story } from 'api/communityresources/models/storyModel';
import { BlockUserService } from '../blockUserService';

describe('BlockUserService', () => {
  let svc;

  beforeEach(() => {
    svc = new BlockUserService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockBinder,
      <any>mockStory,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // const binderData = require('./data/binder.json');
  const user = {
    _id: '5f99844130b711000703cd74',
    firstName: 'GA',
    lastName: 'JONES',
    username: '~sit3gajones',
    gender: 'Male',
    genderRoles: null,
    age: 42,
    profilePicture:
      'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/5f99844130b711000703cd74',
    myCommunities: [
      '5f07537bc12e0c22d00f5d21',
      '5f22db56a374bc4e80d80a9b',
      '5f0e744536b382377497ecef',
      '5f189ba00d5f552cf445b8c2',
      '5f0753f6c12e0c22d00f5d23',
      '5f0753b7c12e0c22d00f5d22'
    ],
    active: true,
    hasAgreedToTerms: false
  };

  const data = {
    data: {
      isSuccess: true,
      isException: false,
      value: [user]
    }
  };

  const binderValue: Binder = {
    id: '',
    userId: '',
    binderStories: [],
    binderResources: [],
    binderArticles: [],
    binderPosts: []
  };

  const story: Story = {
    id: '',
    communityId: '',
    authorId: '',
    authorAgeWhenStoryBegan: 0,
    relation: '',
    displayName: '',
    relationAgeWhenDiagnosed: 0,
    featuredQuote: '',
    answer: [],
    storyText: '',
    createdAt: undefined,
    updatedAt: undefined,
    publishedAt: undefined,
    published: false,
    flagged: false,
    removed: false,
    hasStoryBeenPublishedOnce: false,
    reaction: new Reaction(),
    allowComments: false,
    comments: []
  };

  describe('blockUser', () => {
    it('should return success', async () => {
      mockMongo.insertValue.mockReturnValue(user);
      mockBinder.getBinderByUser.mockReturnValueOnce(binderValue);
      mockStory.getStoryById.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.blockUser('blockingUser', 'blockedUser');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMongo.insertValue.mockImplementation(() => {
        throw new Error();
      });

      await svc.blockUser('blockingUser', 'blockedUser');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('myBlocks', () => {
    it('should return success', async () => {
      mockMongo.readAllByValue.mockReturnValue([user]);
      mockMongo.readByID.mockReturnValue(user);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.myBlocks('currentUserId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMongo.readAllByValue.mockImplementation(() => {
        throw new Error();
      });

      await svc.myBlocks('blockingUser', 'blockedUser');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('removeUserFromBlock', () => {
    it('should return success', async () => {
      mockMongo.deleteOneByValue.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.removeUserFromBlock('currentUserId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMongo.deleteOneByValue.mockImplementation(() => {
        throw new Error();
      });

      await svc.removeUserFromBlock('blockingUser', 'blockedUser');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getBlockUserIdList', () => {
    it('should return success', async () => {
      mockMongo.readAllByValue.mockReturnValue([user]);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.getBlockUserIdList('currentUserId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(0);
    });

    it('should return exception', async () => {
      mockMongo.readAllByValue.mockImplementation(() => {
        throw new Error();
      });

      await svc.getBlockUserIdList('blockingUser', 'blockedUser');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('blockStories', () => {
    it('should return success', async () => {
      mockBinder.getBinderByUser.mockReturnValue(data);
      mockStory.getStoryById.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.blockStories('blockingUser', 'blockedUser');
      expect(mockResult.createSuccess.mock.calls.length).toBe(0);
    });

    it('should return exception', async () => {
      mockBinder.getBinderByUser.mockImplementation(() => {
        throw new Error();
      });

      await svc.blockUser('blockingUser', 'blockedUser');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
