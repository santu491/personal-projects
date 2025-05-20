import { headers, memberInfo, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberContactsGateway } from '../memberContactsGateway';

describe('MemberContactsGateway', () => {
  let gateway: MemberContactsGateway;

  beforeEach(() => {
    gateway = new MemberContactsGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should be able to recover the contact details', () => {
    const username = '~SIT3GQH812584146';
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.onPrem.recoveryContact,
      method: HttpMethod.Get,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.USER_NAME,
          value: username
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_RECOVERY_CONTACT
    };
    gateway.memberRecoveryContactApi('token', username);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });


  it('Should return member contact details', () => {
    const request = {
      firstNm: 'GA',
      lastNm: 'JONES',
      dob: '1978-11-02',
      hcid: '750T60596',
      metaPersonType: 'preferred',
      usernm: '~SIT3SB457T97639'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberContactsDetails,
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
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_GET_CONTACT_DETAILS
    };

    gateway.memberGetContactsApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return GBD member contact details', () => {
    const request = {
      activeInd: true,
      hcId: 'YRK788779854'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.psgbdTenant.gbdContactsDetails,
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
        },
        {
          name: headers.META_TRANS_ID,
          value: '432bd2b8-076c-be28-294b-04030368f0be'
        },
        {
          name: headers.META_SENDER_APP,
          value: memberInfo.APPLICATION
        },
        APP.config.restApi.gbdHeader
      ],
      responseType: 1,
      requestName: requestName.GBD_CONTACT_DETAILS
    };

    gateway.getGbdMemberContacts(
      'token',
      '432bd2b8-076c-be28-294b-04030368f0be',
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return GBD member contact details synthetic APIs', () => {
    const request = {
      activeInd: true,
      hcId: 'YRK788779854'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.member.gbdContactsDetailsSynthetic,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.syntheticAPIKey
        },
        {
          name: headers.META_TRANS_ID,
          value: '432bd2b8-076c-be28-294b-04030368f0be'
        },
        {
          name: headers.META_SENDER_APP,
          value: memberInfo.APPLICATION
        },
        APP.config.restApi.syntheticHeader
      ],
      responseType: 1,
      requestName: requestName.GBD_CONTACT_DETAILS_SYNTHETIC
    };
    gateway.getGbdMemberContactsSynthetic(
      'token',
      '432bd2b8-076c-be28-294b-04030368f0be',
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
