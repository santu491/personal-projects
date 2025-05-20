import { cacheKey, memberInfo, Result } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { BaseResponse } from 'api/communityresources/models/resultModel';
import { Service } from 'typedi';
import {
  ForgotUserModel,
  MemberType
} from '../../models/memberModel';

import { AccessTokenHelper } from '../helpers/accessTokenHelper';
import { ForgotUserCommercialService } from './commercialService';
import { ForgotUserMedicaidService } from './medicaidService';

@Service()
export class ForgotUserService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private medicaidService: ForgotUserMedicaidService,
    private commercialService: ForgotUserCommercialService,
    @LoggerParam(__filename) private log: ILogger
  ) {}

  public async forgotUser(
    forgotUserModel: ForgotUserModel
  ): Promise<BaseResponse> {
    try {
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      const memberType = new MemberType();
      memberType.isGbdMember =
        forgotUserModel?.memberType === memberInfo.GBD_MEMBER ? true : false;

      if (memberType.isGbdMember) {
        return this.medicaidService.medicaidForgotUser(
          forgotUserModel,
          onPremToken.access_token
        );
      } else {
        return this.commercialService.commercialForgotUser(
          forgotUserModel,
          onPremToken.access_token
        );
      }
    } catch (error) {
      this.log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
