import { API_RESPONSE, Result, UNITED_STATES } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { BingGateway } from '../gateways/bingGateway';
import { BingResponse } from '../models/locationModel';

@Service()
export class LocationService {
  constructor(
    private locationGateway: BingGateway,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  async fetchLocationDetails(zipcode: string) {
    try {
      const locationData = await this.locationGateway.getLocationDetails(zipcode);
      return this.processLocationResponse(locationData);
    } catch (error) {
      this._log.error(error as Error);
      this.setNotFoundError();
      return this.result.createError([this.result.errorInfo]);
    }
  }

  async fetchPointLocationDetails(lat: string, long: string) {
    try {
      const locationData = await this.locationGateway.getPointLocationDetails(`${lat},${long}`);
      return this.processLocationResponse(locationData);
    } catch (error) {
      this._log.error(error as Error);
      this.setNotFoundError();
      return this.result.createError([this.result.errorInfo]);
    }
  }

  private setNotFoundError() {
    this.result.errorInfo.title = API_RESPONSE.messages.notFound;
    this.result.errorInfo.detail = API_RESPONSE.messages.noDataResponseDetail;
    this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
  }

  private processLocationResponse(location: BingResponse) {
    if (location.resourceSets[0].resources.length === 0) {
      this.setNotFoundError();
      return this.result.createError([this.result.errorInfo]);
    }

    const resources = location.resourceSets[0].resources.filter((resource) =>
      resource.address.countryRegion === UNITED_STATES
    );

    if (resources.length === 0) {
      this.setNotFoundError();
      return this.result.createError([this.result.errorInfo]);
    }

    const locationResult = resources.map((resource) => ({
      state: resource.address.adminDistrict,
      city: resource.address?.locality,
      zip: resource.address?.postalCode,
      countryRegion: resource.address?.countryRegion
    }));

    return this.result.createSuccess(locationResult);
  }
}
