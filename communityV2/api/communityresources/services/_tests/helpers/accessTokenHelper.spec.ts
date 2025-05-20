import { cacheKey } from '@anthem/communityapi/common';
import {
  mockAuntBerthaGateway,
  mockCacheUtil,
  mockInternalService,
  mockOnPremTokenGateway,
  mockSecureJwtToken
} from '@anthem/communityapi/common/baseTest';
import { AccessTokenHelper } from '../../helpers/accessTokenHelper';

describe('AccessTokenHelper', () => {
  let svc: AccessTokenHelper;
  beforeEach(() => {
    svc = new AccessTokenHelper(
      mockInternalService as any,
      mockOnPremTokenGateway as any,
      mockCacheUtil as any,
      mockSecureJwtToken as any,
      mockAuntBerthaGateway as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return on-prem access token', async () => {
    const expRes = {
      token_type: 'BearerToken',
      issued_at: '1632222499045',
      access_token: 'token',
      application_name: 'sydcom',
      scope: '',
      expires_in: '896',
      status: 'approved'
    };
    mockOnPremTokenGateway.onPremToken.mockReturnValue(expRes);
    const data = await mockOnPremTokenGateway.onPremToken();
    expect(data).toEqual(expRes);
    mockCacheUtil.setCache(cacheKey.onPremToken, 'token');
    const resp = await svc.getOauthToken(expRes.access_token, true);
    expect(resp).toEqual(expRes);
  });

  it('Should return internal access token', async () => {
    const expRes = {
      token_type: 'BearerToken',
      issued_at: '1632222499045',
      access_token: 'token',
      application_name: 'sydcom',
      scope: '',
      expires_in: '896',
      status: 'approved'
    };
    mockInternalService.getAuth.mockReturnValue(expRes);
    const data = await mockInternalService.getAuth();
    expect(data).toEqual(expRes);
    mockCacheUtil.setCache(cacheKey.onPremToken, 'token');
    const resp = await svc.getOauthToken(expRes.access_token, false);
    expect(resp).toEqual(expRes);
  });

  it('Should return cloud access token', async () => {
    const expRes = {
      token_type: 'BearerToken',
      issued_at: '1632222499045',
      access_token: 'token',
      application_name: 'sydcom',
      scope: '',
      expires_in: '896',
      status: 'approved'
    };
    mockInternalService.getAuth.mockReturnValue(expRes);
    mockCacheUtil.setCache(cacheKey.memberToken, 'token');
    const resp = await svc.getOauthToken(expRes.access_token, true);
    expect(resp).toEqual(expRes);
  });

  it('Should return onPremSyntheticToken access token', async () => {
    const expRes = {
      token_type: 'BearerToken',
      issued_at: '1632222499045',
      access_token: 'token',
      application_name: 'sydcom',
      scope: '',
      expires_in: '896',
      status: 'approved'
    };
    mockOnPremTokenGateway.onPremSyntheticToken.mockReturnValue(expRes);
    const data = await mockOnPremTokenGateway.onPremSyntheticToken();
    expect(data).toEqual(expRes);
    mockCacheUtil.setCache(cacheKey.onPremSyntheticToken, 'token');
    const resp = await svc.getSyntheticToken();
    expect(resp).toEqual(expRes.access_token);
  });
});
