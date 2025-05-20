import { mockLogger, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { mockDashboardSvc } from "@anthem/communityadminapi/utils/mocks/mockServices";
import { DashboardController } from "../dashboardController";

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(() => {
    controller = new DashboardController(
      <any>mockResult,
      <any>mockValidation,
      <any>mockDashboardSvc,
      <any>mockLogger,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUserCount', () => {
    it('should return success', async () => {
      await controller.getCurrentUserCount();
      expect(mockDashboardSvc.getActiveUsersCount.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockDashboardSvc.getActiveUsersCount.mockRejectedValue({ message: 'err0r' });
      await controller.getCurrentUserCount();
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getCurrentUserCount', () => {
    it('should return success', async () => {
      await controller.getNewUserCount();
      expect(mockDashboardSvc.getNewUsersCount.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockDashboardSvc.getNewUsersCount.mockRejectedValue({ message: 'err0r' });
      await controller.getNewUserCount();
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getLatestPosts', () => {
    it('should return success', async () => {
      mockValidation.checkUserIdentity.mockReturnValue({ id: 'adminId' });
      await controller.getLatestPosts();
      expect(mockDashboardSvc.getLatestPost.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockValidation.checkUserIdentity.mockReturnValue({ id: 'adminId' });
      mockDashboardSvc.getLatestPost.mockRejectedValue({ message: 'err0r' });
      await controller.getLatestPosts();
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getPostActivity', () => {
    it('should return success', async () => {
      mockValidation.checkUserIdentity.mockReturnValue({ id: 'adminId' });
      await controller.getPostActivity();
      expect(mockDashboardSvc.getPostActivities.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockValidation.checkUserIdentity.mockReturnValue({ id: 'adminId' });
      mockDashboardSvc.getPostActivities.mockRejectedValue({ message: 'err0r' });
      await controller.getPostActivity();
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getUserCount', () => {
    it('should return success', async () => {
      await controller.getUserCount();
      expect(mockDashboardSvc.getUserData.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockDashboardSvc.getUserData.mockRejectedValue({ message: 'err0r' });
      await controller.getUserCount();
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
