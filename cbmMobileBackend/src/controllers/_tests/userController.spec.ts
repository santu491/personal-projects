import {MemberOAuthPayload} from '../../types/customRequest';
import {InstallationTokenModel} from '../../types/userRequest';
import {mockResult, mockUserService} from '../../utils/baseTest';
import {UserController} from '../userController';

jest.mock('../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../services/eap/userService', () => ({
  UserService: jest.fn(() => mockUserService),
}));

describe('userController', () => {
  let controller: UserController;
  let user: MemberOAuthPayload;

  beforeEach(() => {
    controller = new UserController();
    user = {
      clientId: 'yourClientId',
      clientName: 'TestName',
      iamguid: 'IAMGUID',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Reset Badge Count', () => {
    const payload: InstallationTokenModel = {
      count: 0,
      deviceToken: 'Token123',
    };

    it('should reset the Badge: update badge Count', async () => {
      mockUserService.badgeReset.mockReturnValue(true);
      const response = await controller.resetBadgeCount(user, payload);
      expect(response).toBe(true);
    });

    it('should reset the Badge: error', async () => {
      mockUserService.badgeReset.mockImplementation(() => {
        throw new Error();
      });
      mockResult.createException.mockReturnValue(true);
      await controller.resetBadgeCount(user, payload);
    });
  });
});
