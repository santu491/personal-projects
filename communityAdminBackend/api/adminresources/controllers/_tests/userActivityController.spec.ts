import { API_RESPONSE } from '@anthem/communityadminapi/common';
import {
  mockResult,
  mockUserActivity,
  mockValidation,
  mockifiedAdvocateContext,
  mockifiedUserContext
} from '@anthem/communityadminapi/common/baseTest';
import { UserActivityController } from '../userActivityController';

describe('UserController', () => {
  let controller: UserActivityController;

  beforeEach(() => {
    controller = new UserActivityController(
      <any>mockResult,
      <any>mockValidation,
      <any>mockUserActivity
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminActivity', () => {
    it('Should return reponse of admin activity: Success', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            userId: '61b21e9c26dbb012b69cf67e',
            list: [
              {
                authorId: '6165533770868b5286ddf7fc',
                entityId: '61b75236cf7b364deb198355',
                entityType: 'post',
                isRead: false,
                title: 'Member has reacted to your post: Eat less 100'
              }
            ],
            id: '61bb37bd045ef1494fa43fe1'
          }
        }
      };

      mockValidation.checkUserIdentity.mockReturnValue(
        mockifiedAdvocateContext
      );
      mockUserActivity.getAdminActivity.mockReturnValue(expRes);

      const data = await controller.getAdminActivity('adminId');
      expect(data).toEqual(expRes);
    });

    it('Should return reponse of admin activity: User validation Failed', async () => {
      const expRes = {
        data: {
          isSuccess: false,
          isException: true,
          errors: {
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.userDoesNotExist
          }
        }
      };

      mockValidation.checkUserIdentity.mockReturnValue(false);
      mockResult.createError.mockReturnValue(expRes);
      const data = await controller.getAdminActivity('adminId');
      expect(data).toEqual(expRes);
    });

    it('Should return reponse of admin activity: Exception', async () => {
      mockValidation.checkUserIdentity.mockImplementation(() => {
        throw new Error();
      });
      await controller.getAdminActivity('adminId');
    });

    it('Should return reponse of admin activity: SCAdmin Success', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            userId: '61b21e9c26dbb012b69cf67e',
            list: [
              {
                authorId: '6165533770868b5286ddf7fc',
                entityId: '61b75236cf7b364deb198355',
                entityType: 'post',
                isRead: false,
                title: 'Member has reacted to your post: Eat less 100'
              }
            ],
            id: '61bb37bd045ef1494fa43fe1'
          }
        }
      };

      mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
      mockUserActivity.getSCAdminActivity.mockReturnValue(expRes);

      const data = await controller.getAdminActivity('adminId');
      expect(data).toEqual(expRes);
    });
  });

  describe('updateActivityAsRead', () => {
    it('Should mark activity as read: Success', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            operation: true
          }
        }
      };

      mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
      mockUserActivity.updateActivityAsRead.mockReturnValue(expRes);
      const data = await controller.updateActivityAsRead(
        '61c10c9f46caaa5c413fbf61'
      );
      expect(data).toEqual(expRes);
    });

    it('Should mark activity as read: Failed', async () => {
      const expRes = {
        data: {
          isSuccess: false,
          isException: true,
          errors: {
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.userDoesNotExist
          }
        }
      };

      mockValidation.checkUserIdentity.mockReturnValue(false);
      mockResult.createError.mockReturnValue(expRes);
      const data = await controller.updateActivityAsRead(
        '61c10c9f46caaa5c413fbf61'
      );
      expect(data).toEqual(expRes);
    });

    it('Should mark activity as read: Exception', async () => {
      mockValidation.checkUserIdentity.mockImplementation(() => {
        throw new Error();
      });
      await controller.updateActivityAsRead('userId');
    });
  });
});
