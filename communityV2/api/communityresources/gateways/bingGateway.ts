import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { BingResponse } from '../models/locationModel';

@Service()
export class BingGateway {
  constructor(private _http: RestClient) {}

  getLocationDetails(zipcode: string): Promise<BingResponse> {
    return this._http.invoke({
      url: APP.config.bing.locationUrl,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: 'key',
          value: APP.config.bing.apiKey
        },
        {
          isQueryParam: true,
          name: 'query',
          value: zipcode
        },
        {
          isQueryParam: true,
          name: 'maxResults',
          value: '10'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'bingLocationRequest'
    });
  }

  getPointLocationDetails(point: string): Promise<BingResponse> {
    return this._http.invoke({
      url: `${APP.config.bing.locationUrl}/${point}`,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: 'key',
          value: APP.config.bing.apiKey
        },
        {
          isQueryParam: true,
          name: 'includeEntityTypes',
          value: 'address'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'bingPointLocationRequest'
    });
  }
}
