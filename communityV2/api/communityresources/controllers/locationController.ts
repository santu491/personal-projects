import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { OpenAPI2, Param2, QueryParam2 } from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { LocationService } from '../services/locationService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.LOCATION)
export class LocationController extends BaseController {
  constructor(
    private locationService: LocationService,
    private result: Result,
    private validate: Validation,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/point')
  @OpenAPI2({
    description: 'Get Location data based on latitude and longitude',
    responses: { ...DEFAULT_RESPONSES }
  })
  async getLocationPointData(
  @QueryParam2('lat', { required: true }) lat: string,
    @QueryParam2('long', { required: true }) long: string) {
    try {
      if (this.validate.isNullOrWhiteSpace(lat) || this.validate.isNullOrWhiteSpace(long)) {
        this.result.errorInfo.title = API_RESPONSE.messages.noLatLongTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noLatLongeDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.locationService.fetchPointLocationDetails(lat, long);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/:zipcode')
  @OpenAPI2({
    description: 'Get Location data based on zipcode',
    responses: { ...DEFAULT_RESPONSES }
  })
  async getLocationData(@Param2('zipcode') zipcode: string) {
    try {
      const validZipcode = this.validate.userLocationValidation(zipcode, false);
      if (!validZipcode.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidZipCode;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.locationService.fetchLocationDetails(zipcode);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
