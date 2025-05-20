import { mockLogger, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { mockMetricsSvc } from "@anthem/communityadminapi/utils/mocks/mockServices";
import { MetricsController } from "../metricsController";

describe('MetricsController', () => {
  let controller: MetricsController;

  beforeEach(() => {
    controller = new MetricsController(<any>mockResult, <any>mockValidation, <any>mockMetricsSvc ,<any>mockLogger)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommunityMetrics', () => {
    it('should return success', async () => {
      mockValidation.isHex.mockReturnValue(true);
      mockValidation.checkUserIdentity.mockReturnValue({ id: 'userId' });
      mockMetricsSvc.getCommunityMetrics.mockReturnValue({});
      await controller.getCommunityMetrics('communityId');
      expect(mockMetricsSvc.getCommunityMetrics.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockValidation.isHex.mockReturnValue(false);
      await controller.getCommunityMetrics('communityId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });
});
