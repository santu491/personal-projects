import { mockLocationSvc, mockResult, mockValidation } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { LocationController } from "../locationController";

describe('LocationController', () => {
  let ctrl: LocationController;
  beforeEach(() => {
    ctrl = new LocationController(<any>mockLocationSvc, <any>mockResult, <any>mockValidation, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocationData', () => {
    it('should get address from location service', async () => {
      mockValidation.userLocationValidation.mockReturnValue({
        validationResult: true
      });
      await ctrl.getLocationData('12345');
      expect(mockValidation.userLocationValidation.mock.calls.length).toBe(1);
      expect(mockLocationSvc.fetchLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return a validation error', async () => {
      mockValidation.userLocationValidation.mockReturnValue({
        validationResult: false
      });
      await ctrl.getLocationData('abcde');
      expect(mockValidation.userLocationValidation.mock.calls.length).toBe(1);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should throw an error', async () => {
      mockValidation.userLocationValidation.mockReturnValue({
        validationResult: true
      });
      mockLocationSvc.fetchLocationDetails.mockRejectedValue({
        message: 'Error'
      });
      await ctrl.getLocationData('12345');
      expect(mockValidation.userLocationValidation.mock.calls.length).toBe(1);
      expect(mockLocationSvc.fetchLocationDetails.mock.calls.length).toBe(1);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getLocationPointData', () => {
    it('should get address from location service', async () => {
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      await ctrl.getLocationPointData("22", "12");
      expect(mockLocationSvc.fetchPointLocationDetails.mock.calls.length).toBe(1);
    });

    it('should return a validation error', async () => {
      mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
      await ctrl.getLocationPointData("lat", "long");
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should throw an error', async () => {
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockLocationSvc.fetchPointLocationDetails.mockRejectedValue({
        message: 'Error'
      });
      await ctrl.getLocationPointData("12", "22");
      expect(mockLocationSvc.fetchPointLocationDetails.mock.calls.length).toBe(1);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
})
