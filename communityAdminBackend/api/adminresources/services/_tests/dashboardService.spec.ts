import { mockMongo, mockPostHelper, mockResult, mockUserHelperService } from "@anthem/communityadminapi/common/baseTest";
import { mockILogger } from "@anthem/communityadminapi/logger/mocks/mockILogger";
import { mockMetricsHelper } from "@anthem/communityadminapi/utils/mocks/mockHelpers";
import { ObjectID } from "bson";
import { DashboardService } from "../dashboardService";

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService(<any>mockMongo, <any>mockResult, <any>mockUserHelperService, <any>mockPostHelper, <any>mockMetricsHelper, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActiveUsersCount', () => {
    it('should return success', async () => {
      mockUserHelperService.getDemoUsers.mockReturnValue([]);
      mockMongo.getDocumentCount.mockReturnValue(1);
      await service.getActiveUsersCount();
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockUserHelperService.getDemoUsers.mockReturnValue([]);
      mockMongo.getDocumentCount.mockRejectedValue({message: 'error'});
      await service.getActiveUsersCount();
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getNewUsersCount', () => {
    it('should return success', async () => {
      mockMongo.getDocumentCount.mockReturnValue(2);
      mockUserHelperService.getDemoUsers.mockReturnValue([]);
      await service.getNewUsersCount();
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });
  });

  describe('getLatestPost', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue({ communities: ['communityId1'] });
      mockPostHelper.getCommentCount.mockReturnValue(1);
      mockMongo.readAllByValue.mockReturnValue([{}])
      await service.getLatestPost('adminId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.getLatestPost('adminId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue({ message: 'error' });
      await service.getLatestPost('adminId');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getUserData', () => {
    it('should return success', async () => {
      mockUserHelperService.getDemoUsers.mockReturnValue([]);
      mockMetricsHelper.getUsersCount.mockReturnValue({});
      await service.getUserData();
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });
  });

  describe('getPostActivities', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValueOnce({ communitites: ['communityId'] })
        .mockReturnValue({ title: 'Community Title' });
      mockMongo.readByAggregate.mockReturnValue([
        {
          _id: 'communityId',
          postId: [new ObjectID(), new ObjectID(), new ObjectID()]
        }
      ]);
      mockMongo.readAllByValue.mockReturnValue([
        {
          list: [{
            postId: new ObjectID().toString()
          },
          {
            postId: new ObjectID().toString()
          }]
        }
      ]);
      await service.getPostActivities('adminId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockMongo.readByID.mockReturnValue(null)
      await service.getPostActivities('adminId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should throw exception', async () => {
      mockMongo.readByID.mockRejectedValue(null)
      await service.getPostActivities('adminId');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
