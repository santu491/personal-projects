import { mockAppMemberService, mockResult } from '@anthem/communityadminapi/common/baseTest';
import { UserCleanUp } from 'api/adminresources/models/userModel';
import { AppMemberController } from '../appMemberController';

describe('AppMemberController', () => {
  let controller: AppMemberController;

  beforeEach(() => {
    controller = new AppMemberController(<any>mockAppMemberService, <any>mockResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get deleted user list', () => {
    it('should get list of delete requested users', async () => {
      await controller.getDeleteRequestedUsers();
      expect(mockAppMemberService.getDeleteRequestedUsers.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      await controller.getDeleteRequestedUsers();
      mockAppMemberService.getDeleteRequestedUsers.mockImplementation(() => {
        throw new Error()
      });
      expect(mockResult.createException.mock.calls.length).toBe(0);
    });
  });

  describe('update deleted user list', () => {
    const input: UserCleanUp = {
      approved: true,
      userId: 'userId'
    };
    it('should update delete requested user', async () => {
      await controller.updateUserDeleteRequest(input);
      expect(mockAppMemberService.updateUserDeleteRequest.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockAppMemberService.updateUserDeleteRequest.mockImplementation(() => {
        throw new Error('some error')
      });
      await controller.updateUserDeleteRequest(input);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
