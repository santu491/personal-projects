import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberDetailsGateway } from '../memberDetailsGateway';

describe('MemberDetailsGateway', () => {
  let gateway: MemberDetailsGateway;
  beforeEach(() => {
    gateway = new MemberDetailsGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should return GBD member summary', () => {
    const request = {
      username: '~user',
      migrationEligible: true
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.psgbdTenant.gbdSummary,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        }
      ],
      responseType: 1,
      requestName: requestName.GBD_SUMMARY
    };

    gateway.gbdMemberSummary('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return member details when forgot username', () => {
    const request = {
      firstNm: 'GUERRERO',
      lastNm: 'HOWELL',
      dob: '1980-01-01',
      hcId: 'GQH812584146'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberEligibilityInfo,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_INFO_VALIDATE
    };

    gateway.memberInformationApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
