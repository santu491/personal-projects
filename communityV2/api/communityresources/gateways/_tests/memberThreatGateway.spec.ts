import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberThreatGateway } from '../memberThreatGateway';

describe('MemberThreatGateway', () => {
  let gateway: MemberThreatGateway;

  beforeEach(() => {
    gateway = new MemberThreatGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should return member login treat API response', () => {
    const request = {
      usernm: '~sit3sub970634126',
      metaIpaddress: '11.22.33.47',
      model: 'Member',
      cookieValue:
        'ugkHOqh3jwiZd0uI/6ca6z3lgCfYC3PGe9ypNHIJ5vHlxbcIaaEKy730uUkHZczmUp95dNXctFxVULgN4DJJbjI7P1uPlQAr116eRw2m1lmTGROE2kHvUlvLzKem//0353lY7ExvjXkBDL1hZhnY2KKV1IMF3ygZOA7YYFl0CqM=',
      hcid: 'CLD400238',
      brand: 'AGP-WCSTX',
      brandCode: 'AGP-WCSTX',
      marketingBrand: 'SYDCOM',
      metaPersonType: 'Preferred'
    };
    const loginTreatRequestParameters = {
      url: APP.config.restApi.sydneyMemberTenant.commercialLoginTreat,
      requestName: requestName.COMMERCIAL_LOGIN_THREAT,
      header: [
        {
          name: headers.AUTHORIZATION,
          value: 'token'
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        }
      ]
    };
    const http = {
      allowExceptions: true,
      allowRawResponse: true,
      url: loginTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...loginTreatRequestParameters.header
      ],
      responseType: 1,
      requestName: loginTreatRequestParameters.requestName
    };
    gateway.memberLoginThreatApi(loginTreatRequestParameters,request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return member recovery treat API response', () => {
    const request = {
      usernm: '~sit3sub970634126',
      metaIpaddress: '11.22.33.47',
      model: 'Member',
      cookieValue:
        'ugkHOqh3jwiZd0uI/6ca6z3lgCfYC3PGe9ypNHIJ5vHlxbcIaaEKy730uUkHZczmUp95dNXctFxVULgN4DJJbjI7P1uPlQAr116eRw2m1lmTGROE2kHvUlvLzKem//0353lY7ExvjXkBDL1hZhnY2KKV1IMF3ygZOA7YYFl0CqM=',
      marketingBrand: 'SYDCOM',
      webguid: '12f7c61d-188d-4b3d-801b-0f3baa0c1ac6',
      metaPersonType: 'SNAP'
    };
    const recoveryTreatRequestParameters = {
      url: APP.config.restApi.sydneyMemberTenant.commercialRecoveryTreat,
      requestName: requestName.COMMERCIAL_RECOVERY_THREAT,
      header: [
        {
          name: headers.AUTHORIZATION,
          value: 'token'
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        }
      ]
    };
    const http = {
      allowExceptions: true,
      allowRawResponse: true,
      url: recoveryTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...recoveryTreatRequestParameters.header
      ],
      responseType: 1,
      requestName: recoveryTreatRequestParameters.requestName
    };
    gateway.memberRecoveryThreatApi(recoveryTreatRequestParameters, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
