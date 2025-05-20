import { mockMongo, mockResult, mockUserHelperService } from "@anthem/communityadminapi/common/baseTest";
import { mockMetricsHelper } from "@anthem/communityadminapi/utils/mocks/mockHelpers";
import { MetricsService } from "../metricsService";

describe('MetricsService', () => {
  let svc: MetricsService;

  beforeEach(() => {
    svc = new MetricsService(<any>mockMongo, <any>mockResult, <any>mockUserHelperService, <any>mockMetricsHelper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const adminUser = require('test/data-sample/adminUser.json');

  describe('getCommunityMetrics', () => {
    it('should return data', async () => {
      mockUserHelperService.getDemoUsers.mockReturnValue([]);
      mockMetricsHelper.getPNEnabledUserCount.mockReturnValue(0);
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readAllByValue.mockReturnValue([]);
      mockMongo.getRowCount.mockReturnValue(0);
      await svc.getCommunityMetrics('607e7c99d0a2b533bb2ae3d2', '62065e392715d2002aa45fba');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockMongo.readByID.mockReturnValue(adminUser);
      await svc.getCommunityMetrics('607e7c99d0a2a533bb2ae3d2', '62065e392715d2002aa45fba');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });
});
