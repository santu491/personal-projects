import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from "@anthem/communityapi/utils/mocks/mockRestClient";
import { AuntBerthaGateway } from "../auntBerthaGateway";


describe('AuntBerthaGateway', () => {
  let gateway: AuntBerthaGateway;

  beforeEach(() => {
    gateway = new AuntBerthaGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Get Badges', () => {
    let http = {
      url: APP.config.restApi.auntBertha.serviceTags,
      method: 'GET',
      headers: [
        {
          name: 'Authorization',
          value: `Bearer test`
        }
      ],
      responseType: 1,
      requestName: 'auntBerthaServiceTags'
    }
    gateway.getServiceTags('test');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should Get Program By Id', () => {
    const http = {
      url: APP.config.restApi.auntBertha.getProgramById,
      method: 'GET',
      urlParams: [
        {
          isQueryParam: false,
          name: 'programId',
          value: '5152119452598272'
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer test`
        }
      ],
      responseType: 1,
      requestName: 'auntBerthaProgramID'
    }
    gateway.getProgramById('test', '5152119452598272');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should Get programs by zipCode and limit to specific terms, attribute tags or service tags', () => {
    const params = [
      { isQueryParam: false, name: 'zipCode', value: '12345' },
      { isQueryParam: true, name: 'terms', value: 'all' },
      { isQueryParam: true, name: 'cursor', value: '0' },
      { isQueryParam: true, name: 'limit', value: '5' },
      { isQueryParam: true, name: 'attributeTag', value: '' },
      { isQueryParam: true, name: 'at_operand', value: 'and' },
      { isQueryParam: true, name: 'serviceTag', value: '' },
      { isQueryParam: true, name: 'st_operand', value: 'or' },
      { isQueryParam: true, name: 'includeAttributeTags', value: 'true' }
    ];
    const http = {
      url: APP.config.restApi.auntBertha.getProgramListByZipCode,
      method: 'GET',
      urlParams: params,
      headers: [
        {
          name: 'Authorization',
          value: `Bearer test`
        }
      ],
      responseType: 1,
      requestName: 'auntBerthaProgramListByZipcodeRequest',
      allowExceptions: true
    }
    gateway.getProgramsListByZipCode('test', params);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
