import { memberInfo } from '@anthem/communityapi/common';
import {
  mockAccessTokenHelperSvc,
  mockMemberContactsGateway,
  mockMemberDetailsGateway,
  mockMongo,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { APP } from '@anthem/communityapi/utils';
import { MemberServiceHelper } from '../../helpers/memberServiceHelper';

describe('MemberServiceHelper', () => {
  let svc: MemberServiceHelper;
  beforeEach(() => {
    svc = new MemberServiceHelper(
      <any>mockResult,
      mockAccessTokenHelperSvc as any,
      mockMemberContactsGateway as any,
      mockMemberDetailsGateway as any,
      mockMongo as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return comulate web user data object for medicaid', async () => {
    const memberType = 'CN=gbdMSS';
    const onPremToken = 'onprem access token';
    const cloudToken = 'internal access token';
    const expRes = {
      token: 'onprem access token',
      apiKey: APP.config.restApi.onPrem.apiKey,
      header: {
        name: 'meta-src-envrmt',
        value: 'WEBSTAGEAD'
      }
    };
    const resp = await svc.cumulateWebUserData(
      memberType,
      onPremToken,
      cloudToken
    );
    expect(resp).toEqual(expRes);
  });

  it('Should return comulate web user data object for anthem', async () => {
    const memberType = 'CN=eMember';
    const onPremToken = 'onprem access token';
    const cloudToken = 'internal access token';
    const expRes = {
      token: 'internal access token',
      apiKey: 'E0OAnvjKZ6J3ihrUieBVv3RS5JVKY6Ax',
      header: {
        name: 'meta-src-envrmt',
        value: ''
      }
    };
    const resp = await svc.cumulateWebUserData(
      memberType,
      onPremToken,
      cloudToken
    );
    expect(resp).toEqual(expRes);
  });

  it('formatMemberRequest', async () => {
    const expRes = {
      firstNm: 'firstName',
      lastNm: 'lastName',
      dob: 'dateOfBirth',
      hcId: 'hcid'
    };
    const resp = svc.formatMemberRequest(
      'username',
      'firstName',
      'lastName',
      'hcid',
      'dateOfBirth',
      'snappreferred',
      true
    );
    expect(resp).toEqual(expRes);
  });

  it('generateSearchRequest', async () => {
    const expRes = {
      searchUserFilter: {
        repositoryEnum: [memberInfo.REPOSITORY_ENUM],
        userRoleEnum: [memberInfo.USER_ROLE_ENUM],
        username: '~TAJUANA46204'
      },
      requestContext: {
        application: memberInfo.APPLICATION,
        requestId: undefined,
        username: memberInfo.APPLICATION
      }
    };
    const resp = svc.generateSearchRequest('~TAJUANA46204', false);
    expect(resp).toEqual(expRes);
  });

  it('generateUserRequestObject -> webUserSearch', async () => {
    const loginModel = {
      username: '~TAJUANA46204',
      password: 'Test1234!',
      memberType: 'CN=gbdMSS',
      metaIpaddress: '1.2',
      acceptedTouVersion: '1.0',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      cookie: ''
    };
    const expRes = {
      searchUserFilter: {
        repositoryEnum: [memberInfo.REPOSITORY_ENUM],
        userRoleEnum: [memberInfo.USER_ROLE_ENUM],
        username: '~TAJUANA46204'
      },
      requestContext: {
        application: memberInfo.APPLICATION,
        requestId: undefined,
        username: memberInfo.APPLICATION
      }
    };
    const resp = svc.generateUserRequestObject(
      loginModel,
      true,
      'webUserSearch'
    );
    expect(resp).toEqual(expRes);
  });

  it('generateUserRequestObject -> memberAuthenticate', async () => {
    const loginModel = {
      username: 'username',
      password: 'Test1234!',
      memberType: 'CN=eMember',
      metaIpaddress: '1.2',
      acceptedTouVersion: '1.0',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      cookie: ''
    };
    const expRes = {
      password: 'Test1234!',
      userNm: 'username'
    };
    const resp = svc.generateUserRequestObject(
      loginModel,
      false,
      'memberAuthenticate'
    );
    expect(resp).toEqual(expRes);
  });
});
