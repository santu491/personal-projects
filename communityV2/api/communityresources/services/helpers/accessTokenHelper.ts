import {
  API_RESPONSE, cacheKey,
  KEYS,
  memberInfo
} from '@anthem/communityapi/common';
import { ISecureJwtClaims, SecureJwtToken } from '@anthem/communityapi/filters';
import { APP, CacheUtil } from '@anthem/communityapi/utils';
import { AuntberthaAuthResponse, RequestToken } from 'api/communityresources/models/searchTermModel';
import { Service } from 'typedi';
import { AuntBerthaGateway } from '../../gateways/auntBerthaGateway';
import { TokenGateway } from '../../gateways/onPremTokenGateway';
import { InternalAuthResponse } from '../../models/internalRequestModel';
import { User } from '../../models/userModel';
import { InternalService } from '../internalService';

@Service()
export class AccessTokenHelper {
  constructor(
    private internalService: InternalService,
    private onPremTokenGateway: TokenGateway,
    private cacheUtil: CacheUtil,
    private secureJwtToken: SecureJwtToken,
    private aunthBerthaGateway: AuntBerthaGateway
  ) {}

  async getOauthToken(key: string, isOnPrem: boolean) {
    let authDetails: InternalAuthResponse = this.cacheUtil.getCache(
      key
    ) as InternalAuthResponse;
    if (!authDetails) {
      if (isOnPrem) {
        authDetails = await this.onPremTokenGateway.onPremToken();
      } else {
        authDetails = await this.internalService.getAuth();
      }
      this.cacheUtil.setCache(
        key,
        authDetails,
        APP.config.restApi.internal.cacheValidity
      );
    }
    if (authDetails.status !== memberInfo.STATUS) {
      throw new Error(API_RESPONSE.messages.accessTokenFailure);
    }
    return authDetails;
  }

  async generateJwtToken(user: User) {
    const claims: ISecureJwtClaims = {
      name: { value: user.username, encrypt: true },
      id: { value: user.id.toString(), encrypt: true },
      firstName: { value: user.firstName, encrypt: true },
      lastName: { value: user.lastName, encrypt: true },
      active: { value: user.active, encrypt: false }
    };
    return this.secureJwtToken.generateToken(
      user.username,
      user.username,
      claims
    );
  }

  async getSyntheticToken() {
    let authDetails: InternalAuthResponse = this.cacheUtil.getCache(
      cacheKey.onPremSyntheticToken
    ) as InternalAuthResponse;
    if (!authDetails) {
      authDetails = await this.onPremTokenGateway.onPremSyntheticToken();
      this.cacheUtil.setCache(
        cacheKey.onPremSyntheticToken,
        authDetails,
        APP.config.restApi.internal.cacheValidity
      );
    }
    if (authDetails.status !== memberInfo.STATUS) {
      throw new Error(API_RESPONSE.messages.accessTokenFailure);
    }
    return authDetails.access_token;
  }

  async getEKSOauthToken(key: string) {
    let authDetails: InternalAuthResponse = this.cacheUtil.getCache(
      key
    ) as InternalAuthResponse;
    if (!authDetails) {
      authDetails = await this.onPremTokenGateway.onPremAwsToken();
      this.cacheUtil.setCache(
        key,
        authDetails,
        APP.config.restApi.internal.cacheValidity
      );
    }
    if (authDetails.status !== memberInfo.STATUS) {
      throw new Error(API_RESPONSE.messages.accessTokenFailure);
    }
    return authDetails;
  }

  async getSydneyMemberTenantOAuthToken(key: string) {
    let authDetails: InternalAuthResponse = this.cacheUtil.getCache(
      key
    ) as InternalAuthResponse;
    if (!authDetails) {
      authDetails = await this.onPremTokenGateway.sydneyMemberTenantToken();
      this.cacheUtil.setCache(
        key,
        authDetails,
        APP.config.restApi.internal.cacheValidity
      );
    }
    if (authDetails.status !== memberInfo.STATUS) {
      throw new Error(API_RESPONSE.messages.accessTokenFailure);
    }
    return authDetails;
  }

  async getFindhelpMemberOAuthToken(key: string, requestData: RequestToken) {
    let authDetails: AuntberthaAuthResponse = this.cacheUtil.getCache(
      key
    ) as AuntberthaAuthResponse;
    if (!authDetails) {
      authDetails = await this.aunthBerthaGateway.getToken(requestData);
      this.cacheUtil.setCache(
        key,
        authDetails,
        APP.config.restApi.auntBertha.auntBerthaCacheExpiry
      );
    }
    if (!authDetails.success) {
      throw new Error(API_RESPONSE.messages.accessTokenFailure);
    }
    return authDetails;
  }

  async getPSGBDTenantOAuthToken(key: string) {
    let authDetails: InternalAuthResponse = this.cacheUtil.getCache(
      key
    ) as InternalAuthResponse;
    if (!authDetails) {
      authDetails = await this.onPremTokenGateway.psgbdTenantToken();
      this.cacheUtil.setCache(
        key,
        authDetails,
        APP.config.restApi.internal.cacheValidity
      );
    }
    if (authDetails.status !== memberInfo.STATUS) {
      throw new Error(API_RESPONSE.messages.accessTokenFailure);
    }
    return authDetails;
  }

  getTokenReqFindHelp(brand: string | null) {
    let reqKey;

    if (brand) {
      reqKey = APP.config.restApi.auntBertha.apiKeys.find((userBrand) => userBrand.brand === brand);
    }

    return reqKey ? reqKey.apiKey : APP.config.restApi.auntBertha.apiKeys.find((userBrand) => userBrand.brand === KEYS.ABCBS).apiKey;
  }
}
