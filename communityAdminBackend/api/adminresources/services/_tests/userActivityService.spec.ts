import { API_RESPONSE } from '@anthem/communityadminapi/common';
import {
  mockMongo,
  mockResult,
  mockUserHelperService
} from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { UserActivityService } from '../userActivityService';

describe('UserActivityService', () => {
  let service: UserActivityService;
  const adminUser = {
    username: 'az00001',
    role: 'scadmin',
    firstName: 'Admin',
    lastName: 'SydCom',
    displayName: 'Sydney Community',
    displayTitle: '',
    profileImage: '',
    createdAt: '2021-12-09T15:19:56.426Z',
    updatedAt: '2022-01-24T09:09:09.741Z',
    aboutMe: 'Very boaring person.',
    interests: 'Publish posts.',
    location: 'Africa',
    password: 'password',
    id: '61b21e9c26dbb012b69cf67e',
  };
  const activities = {
    userId: '61b21e9c26dbb012b69cf67e',
    list: [
      {
        authorId: '6165533770868b5286ddf7fc',
        entityId: '61b75236cf7b364deb198355',
        entityType: 'post',
        isRead: false,
        isRemoved: false,
        title: 'Member has reacted to your post: Eat less 100',
      },
      {
        authorId: '6165533770868b5286ddf7fc',
        entityId: '61b75236cf7b364deb198355',
        entityType: 'post',
        isRead: false,
        isRemoved: true,
        title: 'Member has reacted to your post: Eat less 100',
      },
      {
        authorId: '6165533770868b5286ddf7fc',
        entityId: '61b75236cf7b364deb198355',
        entityType: 'post',
        isRead: true,
        isRemoved: false,
        title: 'Member has reacted to your post: Eat less 100',
      },
      {
        authorId: '6165533770868b5286ddf7fc',
        entityId: '61b75236cf7b364deb198355',
        entityType: 'post',
        isRead: false,
        isRemoved: false,
        title: 'Member has reacted to your post: Eat less 100',
      }
    ],
    id: '61bb37bd045ef1494fa43fe1',
  }

  beforeEach(() => {
    service = new UserActivityService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockUserHelperService,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminActivity', () => {
    it('Should get user Activity', async () => {
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue({
        userId: '61b21e9c26dbb012b69cf67e',
        list: [
          {
            authorId: '6165533770868b5286ddf7fc',
            entityId: '61b75236cf7b364deb198355',
            entityType: 'post',
            isRead: false,
            title: 'Member has reacted to your post: Eat less 100',
          },
        ],
        id: '61bb37bd045ef1494fa43fe1',
      });
      mockUserHelperService.activityHandler.mockImplementation(() => { return Promise.resolve(); });
      await service.getAdminActivity(adminUser.id);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should get an user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.getAdminActivity(adminUser.id);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should throw exception', async () => {
      mockMongo.readByID.mockRejectedValue({message: 'error'});
      await service.getAdminActivity(adminUser.id);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getSCAdminActivity', () => {
    it('Should get user Activity - Success', async () => {
      const activity = {
        userId: "628f6210b94fde00241c0ec0",
        list: [
          {
            _id: "63087ab8c8071a0023346d75",
            author: {
              id: "611b89667f07f467cae13a44",
              firstName: "GA",
              lastName: "JONES",
              displayName: "anny",
              profilePicture: "e4ecb885-17cf-85a4-505d-c7b23e185729.jpg"
            },
            postId: "63087a26eef12d001c8aaeb1",
            storyId: null,
            commentId: "63087ab7c8071a0023346d74",
            replyId: null,
            reactionType: null,
            entityType: "comment",
            isRead: false,
            isRemoved: false,
            isFlagged: false,
            title: "Has commented on your Post: Post persona check1",
            createdAt: "2022-08-26T07:48:08.055Z",
            updatedAt: "2022-08-26T07:48:08.055Z"
          }
        ]
      };
      mockMongo.readAllByValue.mockReturnValue([adminUser, { id: "6165533770868b5286ddf7fc"}]);
      mockMongo.readAllByValue.mockReturnValue([activity, activity]);
      mockUserHelperService.activityHandler.mockImplementation(() => { return Promise.resolve(); });
      await service.getSCAdminActivity(adminUser.id, null);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('Should return user not found error', async () => {
      mockMongo.readAllByValue.mockReturnValue(null);
      await service.getSCAdminActivity(adminUser.id, null);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });
  });

  describe('updateActivityAsRead', () => {
    it('should update activity', async () => {
      mockMongo.readByValue.mockReturnValue({});
      mockMongo.updateByQuery.mockReturnValue({ modifiedCount: 1 });
      await service.updateActivityAsRead('61b21e9c26dbb012b69cf67e', adminUser.id);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return activity not found error', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      mockMongo.updateByQuery.mockReturnValue({ modifiedCount: 1 });
      await service.updateActivityAsRead('61b21e9c26dbb012b69cf67e', adminUser.id);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.activityDoesNotExist);
    });
  });

  describe('getAdminActivityCount', () => {
    it('Should get user Activity with readState undefined', async () => {
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue(activities);
      await service.getAdminActivityCount(adminUser.id);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('Should get user Activity with readState false', async () => {
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue(activities);
      await service.getAdminActivityCount(adminUser.id, false);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should get an user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.getAdminActivityCount(adminUser.id);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should throw exception', async () => {
      mockMongo.readByID.mockRejectedValue({message: 'error'});
      await service.getAdminActivityCount(adminUser.id);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
