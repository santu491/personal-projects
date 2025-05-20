import { mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { mockBingGateway } from "@anthem/communityapi/utils/mocks/mockGateway";
import { LocationService } from "../locationService";

describe('LocationService', () => {
  let service: LocationService;
  const bingData = require('./data/bingData.json');

  beforeEach(() => {
    service = new LocationService(
      <any>mockBingGateway,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchLocationDetails', () => {
    it('should return location data', async () => {
      mockBingGateway.getLocationDetails.mockReturnValue(bingData.success);
      await service.fetchLocationDetails('90001');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
      expect(mockBingGateway.getLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return no data found', async () => {
      mockBingGateway.getLocationDetails.mockReturnValue(bingData.noResult);
      await service.fetchLocationDetails('abcde');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockBingGateway.getLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return no US region', async () => {
      mockBingGateway.getLocationDetails.mockReturnValue(bingData.noUSRegion);
      await service.fetchLocationDetails('abcde');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockBingGateway.getLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return no data found for exception', async () => {
      mockBingGateway.getLocationDetails.mockRejectedValue(bingData.noResult);
      await service.fetchLocationDetails('abcde');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockBingGateway.getLocationDetails.mock.calls.length).toBe(1);
    });
  });

  describe('fetchPointLocationDetails', () => {
    it('should return location data', async () => {
      mockBingGateway.getPointLocationDetails.mockReturnValue(bingData.success);
      await service.fetchPointLocationDetails("12.1", "13.3");
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
      expect(mockBingGateway.getPointLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return no data found', async () => {
      mockBingGateway.getPointLocationDetails.mockReturnValue(bingData.noResult);
      await service.fetchPointLocationDetails("12.1", "13.3");
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockBingGateway.getPointLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return no US region', async () => {
      mockBingGateway.getPointLocationDetails.mockReturnValue(bingData.noUSRegion);
      await service.fetchPointLocationDetails("12.1", "13.3");
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockBingGateway.getPointLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return no data found for exception', async () => {
      mockBingGateway.getPointLocationDetails.mockRejectedValue(bingData.noResult);
      await service.fetchPointLocationDetails("12.1", "13.3");
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockBingGateway.getPointLocationDetails.mock.calls.length).toBe(1);
    });
  });
});
