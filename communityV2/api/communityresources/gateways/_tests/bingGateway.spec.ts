import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from "@anthem/communityapi/utils/mocks/mockRestClient";
import { BingGateway } from '../bingGateway';


describe('BingGateway', () => {
  let gateway: BingGateway;

  beforeEach(() => {
    gateway = new BingGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('getLocationDetails', () => {
    let http = {
      url: APP.config.bing.locationUrl,
      method: 'GET',
      urlParams: [
        {
          isQueryParam: true,
          name: 'key',
          value: APP.config.bing.apiKey
        },
        {
          isQueryParam: true,
          name: 'query',
          value: '12345'
        },
        {
          isQueryParam: true,
          name: 'maxResults',
          value: '10'
        }
      ],
      responseType: 1,
      requestName: 'bingLocationRequest'
    }
    gateway.getLocationDetails('12345');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('getPointLocationDetails', () => {
    let http = {
      url: APP.config.bing.locationUrl + '/12345',
      method: 'GET',
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
      responseType: 1,
      requestName: 'bingPointLocationRequest'
    }
    gateway.getPointLocationDetails('12345');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
