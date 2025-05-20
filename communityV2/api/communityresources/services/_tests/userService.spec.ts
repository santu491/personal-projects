import { API_RESPONSE, TranslationLanguage } from '@anthem/communityapi/common';
import {
  mockCommunitiesHelper,
  mockInternalService,
  mockMongo,
  mockNotificationHelper,
  mockResult,
  mockSearchTermSvc,
  mockSqsSvc,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import {
  Badge,
  ProfilePicture,
  UserModel
} from 'api/communityresources/models/userModel';
import { UserService } from 'api/communityresources/services/userService';
import { UserHelper } from '../helpers/userHelper';
import { StoryService } from '../storyService';

describe('UserService', () => {
  let service;
  let buildProfilePicturePath;
  let getUserWithoutAttributes;
  let updateActivitiesDisplayName;
  let updateDisplayNameInStory;
  const userData = require('./data/user.json');
  const storiesData = require('./data/stories.json');
  const communityData = require('./data/communitiesRawData.json');
  const searchTerms = require('./data/searchTerm.json');

  beforeEach(() => {
    service = new UserService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockInternalService,
      <any>mockSearchTermSvc,
      <any>mockILogger,
      <any>mockValidation,
      <any>mockSqsSvc,
      <any>mockCommunitiesHelper,
      <any>mockNotificationHelper
    );
    initMockUserHelper();
    initMockStoryService();
  });

  const initMockUserHelper = () => {
    buildProfilePicturePath = jest.spyOn(
      UserHelper.prototype as any,
      'buildProfilePicturePath'
    );
    buildProfilePicturePath.mockImplementation(() => {
      return Promise.resolve(userData);
    });
    updateActivitiesDisplayName = jest.spyOn(
      UserHelper.prototype as any,
      'updateActivitiesDisplayName'
    );
    updateActivitiesDisplayName.mockImplementation(() => {
      return Promise.resolve(userData);
    });
    getUserWithoutAttributes = jest.spyOn(
      UserHelper.prototype as any,
      'getUserWithoutAttributes'
    );
    getUserWithoutAttributes.mockImplementation(() => {
      return Promise.resolve(userData);
    });
  };

  const initMockStoryService = () => {
    updateDisplayNameInStory = jest.spyOn(
      StoryService.prototype as any,
      'updateDisplayNameInStory'
    );
    updateDisplayNameInStory.mockImplementation(() => {
      return Promise.resolve(userData);
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUserById - success', async () => {
    mockMongo.readByID.mockReturnValue(userData);
    // mockUserHelper.buildProfilePicturePath.mockReturnValue('');
    const expectedResult = {
      isSuccess: true,
      isException: false,
      value: userData
    };
    mockResult.createSuccess.mockReturnValue(expectedResult);
    await service.getUserById('62021eb615794e00237056b0');
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getUserById - user does not exist', async () => {
    mockMongo.readByID.mockReturnValue(null);
    const expectedResult = {
      isSuccess: true,
      isException: false,
      errors: [
        {
          id: '3c1d818b-cd3b-f6bd-6548-c139796ea185',
          errorCode: 400,
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        }
      ]
    };
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await service.getUserById('62021eb615794e00237056b0');
    expect(result).toBe(expectedResult);
  });

  it('joinCommunity - success', async () => {
    const inputCommunityId = '60a358bc9c336e882b19abf0';
    const expectedResult = {
      data: {
        isSuccess: true,
        isException: false,
        value: userData
      }
    };
    mockMongo.readByID.mockReturnValue(communityData[1]);
    mockMongo.findAndUpdateOne.mockReturnValue(userData);
    mockResult.createSuccess
      .mockReturnValueOnce(expectedResult)
      .mockReturnValue(expectedResult);
    buildProfilePicturePath.mockImplementation(() => {
      return Promise.resolve('');
    });
    const result = await service.joinCommunity(
      '62021eb615794e00237056b0',
      inputCommunityId
    );
    expect(result).toBe(expectedResult);
  });

  it('joinCommunity - myCommunities exist', async () => {
    const inputCommunityId = '60a358bc9c336e882b19bbf0';
    const validateResult = {
      data: {
        isSuccess: true,
        isException: false,
        value: userData
      }
    };
    const expectedResult = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '3c1d818b-cd3b-f6bd-6548-c139796ea185',
            errorCode: 400,
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.userIsInCommunity
          }
        ]
      }
    };
    mockMongo.readByID.mockReturnValue(communityData[1]);
    mockMongo.findAndUpdateOne.mockReturnValue(userData);
    mockResult.createSuccess.mockReturnValue(validateResult);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await service.joinCommunity(
      '62021eb615794e00237056b0',
      inputCommunityId
    );
    expect(result).toBe(expectedResult);
  });

  it('joinCommunity - myCommunities null', async () => {
    userData.myCommunities = null;
    const inputCommunityId = '60a358bc9c336e882b19abf0';
    const expectedResult = {
      data: {
        isSuccess: true,
        isException: false,
        value: userData
      }
    };
    mockMongo.readByID.mockReturnValue(communityData[1]);
    mockMongo.findAndUpdateOne.mockReturnValue(userData);
    mockResult.createSuccess
      .mockReturnValueOnce(expectedResult)
      .mockReturnValue(expectedResult);
    // mockUserHelper.buildProfilePicturePath.mockReturnValue('');
    buildProfilePicturePath.mockImplementation(() => {
      return Promise.resolve('');
    });
    const result = await service.joinCommunity(
      '62021eb615794e00237056b0',
      inputCommunityId
    );
    expect(result).toBe(expectedResult);
  });

  it('validateJoinOrLeave - communities are null', async () => {
    const inputCommunityId = '60a358bc9c336e882b19bbf0';
    const validateResult = {
      data: {
        isSuccess: true,
        isException: false,
        value: userData
      }
    };
    const expectedResult = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '3c1d818b-cd3b-f6bd-6548-c139796ea185',
            errorCode: 400,
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.communityDoesNotExist
          }
        ]
      }
    };
    mockMongo.readByID.mockReturnValueOnce(null).mockReturnValue(userData);
    mockResult.createSuccess.mockReturnValue(validateResult);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await service.validateJoinOrLeave(
      '62021eb615794e00237056b0',
      inputCommunityId
    );
    expect(result).toBe(expectedResult);
  });

  it('validateJoinOrLeave - users are null', async () => {
    const inputCommunityId = '60a358bc9c336e882b19bbf0';
    const validateResult = {
      data: {
        isSuccess: true,
        isException: false,
        value: userData
      }
    };
    const expectedResult = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '3c1d818b-cd3b-f6bd-6548-c139796ea185',
            errorCode: 400,
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.userDoesNotExist
          }
        ]
      }
    };
    mockMongo.readByID
      .mockReturnValueOnce(communityData[1])
      .mockReturnValue(null);
    mockResult.createSuccess.mockReturnValue(validateResult);
    mockResult.createError.mockReturnValue(expectedResult);
    await service.joinCommunity('62021eb615794e00237056b0', inputCommunityId);
  });

  describe('logOutUser', () => {
    it('should return success', async () => {
      mockInternalService.revokeAccessToken.mockReturnValue(true);
      await service.logOutUser('token');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should throw exception', async () => {
      mockInternalService.revokeAccessToken.mockRejectedValue({
        message: 'error'
      });
      await service.logOutUser('token');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('resetBadgeCount', () => {
    const input: Badge = {
      count: 0,
      userName: 'TEST',
      deviceToken: 'DEVICE'
    };
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.resetBadgeCount(input, 'userId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should throw error', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'Error'
      });
      await service.resetBadgeCount(input, 'userId');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('updateDisplayName', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readAllByValue.mockReturnValue([]);
      await service.updateDisplayName('62021eb615794e00237056b0', 'testName');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should throw error success', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await service.updateDisplayName('62021eb615794e00237056b0', 'testName');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });

    it('should return null user error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.updateDisplayName('62021eb615794e00237056b0', 'testName');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should update display name in stories', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readAllByValue.mockReturnValue(storiesData);

      await service.updateDisplayName('62021eb615794e00237056b0', 'testName');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });
  });

  describe('updateTermsOfUse', () => {
    it('should call createSuccess', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.readByValue.mockReturnValue({
        tou: '1.2.1'
      });
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.updateTermsOfUse('62021eb615794e00237056b0');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should call createSuccess with tou version accepted', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.readByValue.mockReturnValue({
        tou: '1.2.1'
      });
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.updateTermsOfUse('62021eb615794e00237056b0');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user not found', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.updateTermsOfUse('62021eb615794e00237056b0');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return an exception', async () => {
      mockMongo.readByID.mockRejectedValue({ message: 'error' });
      await service.updateTermsOfUse('62021eb615794e00237056b0');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('userFromModel', () => {
    it('should return user data', () => {
      const input: UserModel = {
        id: 'userId',
        username: 'testUer',
        displayName: 'displa'
      };
      const res = service.userFromModel(input);
      expect(res.active).toBeTruthy();
    });
  });

  describe('getUserProfileById', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockCommunitiesHelper.getMultipleCommunities.mockReturnValue(
        userData.myCommunities
      );
      mockMongo.readAllByValue.mockReturnValue([]);
      await service.getUserProfileById(
        '62021eb615794e00237056b0',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return success with block user list', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockCommunitiesHelper.getMultipleCommunities.mockReturnValue(
        userData.myCommunities
      );
      mockMongo.readAllByValue.mockReturnValue([
        {
          blockedUser: 'blockedUserId'
        }
      ]);
      await service.getUserProfileById(
        '62021eb615794e00237056b0',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.getUserProfileById(
        '62021eb615794e00237056b0',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should throw an exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await service.getUserProfileById(
        '62021eb615794e00237056b0',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getUserProfileImage', () => {
    it('should return success', async () => {
      mockMongo.readByValue.mockReturnValue({
        data: 'profileImage'
      });
      await service.getUserProfileImage('62021eb615794e00237056b0');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return no data error', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      await service.getUserProfileImage('62021eb615794e00237056b0');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.noDataResponseDetail
      );
    });

    it('should return exception', async () => {
      mockMongo.readByValue.mockRejectedValue({
        message: 'error'
      });
      await service.getUserProfileImage('62021eb615794e00237056b0');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('addProfilePicture', () => {
    const input: ProfilePicture = {
      userId: '62021eb615794e00237056b0',
      profilePicture: 'profilePicture'
    };
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.readByValue.mockReturnValue({});
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.addProfilePicture(input);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return success after adding a profile picture', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.readByValue.mockReturnValue(null);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.insertValue.mockReturnValue(1);
      await service.addProfilePicture(input);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.addProfilePicture(input);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue(null);
      await service.addProfilePicture(input);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('joinUserCommunities', () => {
    it('should return success', async () => {
      mockMongo.readByID
        .mockReturnValueOnce(userData)
        .mockReturnValue(communityData[3]);
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.joinUserCommunities(
        '622232033eb6ab7e525b54cb',
        ['622232033eb6ab7e525b54cb', '60e2e7277c37b43a668a32f2'],
        []
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.joinUserCommunities(
        '622232033eb6ab7e525b54cb',
        ['622232033eb6ab7e525b54cb', '60e2e7277c37b43a668a32f2'],
        []
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return error on adding communities', async () => {
      mockMongo.readByID.mockReturnValueOnce(userData).mockReturnValue(null);
      await service.joinUserCommunities(
        '622232033eb6ab7e525b54cb',
        ['622232033eb6ab7e525b54cb', '60e2e7277c37b43a668a32f2'],
        []
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.invalidCommunityId
      );
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue({ message: 'error' });
      await service.joinUserCommunities(
        '622232033eb6ab7e525b54cb',
        ['622232033eb6ab7e525b54cb', '60e2e7277c37b43a668a32f2'],
        []
      );
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('updateOnBoardingState', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.updateOnBoardingState(
        '622232033eb6ab7e525b54cb',
        'complete'
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.updateOnBoardingState(
        '622232033eb6ab7e525b54cb',
        'complete'
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await service.updateOnBoardingState(
        '622232033eb6ab7e525b54cb',
        'complete'
      );
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('updateHelpBannerViewedData', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.updateHelpBannerViewedData('622232033eb6ab7e525b54cb', {
        meTabHelpCardBanner: true
      });
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.updateHelpBannerViewedData('622232033eb6ab7e525b54cb', {
        meTabHelpCardBanner: true
      });
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return no data response error', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      await service.updateHelpBannerViewedData('622232033eb6ab7e525b54cb', {
        testBanner: true
      });
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.noDataResponseDetail
      );
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await service.updateHelpBannerViewedData('622232033eb6ab7e525b54cb', {
        testBanner: true
      });
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('updateUserCategories', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockSearchTermSvc.getAllSearchTerms.mockReturnValue({
        data: {
          value: searchTerms.dbData
        }
      });
      mockValidation.isHex.mockReturnValue(true);
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.updateUserCategories('622232033eb6ab7e525b54cb', [
        '61013eb670dbd030d83c8c68',
        '61013eb670dbd030d83c8c66'
      ]);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return invalid', async () => {
      mockMongo.readByID.mockReturnValue(userData);
      mockSearchTermSvc.getAllSearchTerms.mockReturnValue({
        data: {
          value: searchTerms.dbData
        }
      });
      mockMongo.updateByQuery.mockReturnValue(1);
      mockValidation.isHex.mockReturnValueOnce(false).mockReturnValue(true);
      await service.updateUserCategories('622232033eb6ab7e525b54cb', [
        'hexInvalid', //not valid hex
        '622232033eb6ab7e525b54cb' //not valid search term
      ]);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toContain(
        API_RESPONSE.messages.invalidIds
      );
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.updateUserCategories('622232033eb6ab7e525b54cb', [
        '61013eb670dbd030d83c8c68',
        '61013eb670dbd030d83c8c66'
      ]);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await service.updateUserCategories('622232033eb6ab7e525b54cb', [
        '61013eb670dbd030d83c8c68',
        '61013eb670dbd030d83c8c66'
      ]);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
