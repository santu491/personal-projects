import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES, Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Body2, OpenAPI2 } from '@anthem/communityapi/utils';
import { JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  LoginModel, SaveCookieModel
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { MemberService } from '../services/memberService';

@JsonController(API_INFO.contextPath + BASE_URL_EXTENSION.MEMBER)
export class LoginController extends BaseController {
  constructor(
    private memberService: MemberService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Post('/login')
  @OpenAPI2({
    description: 'GBD or commercial member login',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async memberLogin(
    @Body2() loginModel: LoginModel
  ): Promise<BaseResponse> {
    try {
      if (!loginModel?.username) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }
      if (!loginModel?.password) {
        this.result.errorInfo.title = API_RESPONSE.messages.noPasswordTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noPasswordDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[401];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.memberService.memberLogin(loginModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/saveCookie')
  @OpenAPI2({
    description: 'GBD or commercial member 2FA login save device cookie',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async loginSaveCookie(
    @Body2() saveCookieModel: SaveCookieModel
  ): Promise<BaseResponse> {
    try {
      if (!saveCookieModel?.usernm) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!saveCookieModel?.saveDeviceOrCookieFlag) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noSaveDeviceFlag;
        return this.result.createError([this.result.errorInfo]);
      }
      // if (!saveCookieModel?.cookieValue) {
      //   this.result.errorInfo.title =
      //     API_RESPONSE.messages.noSufficientDataTwoFATitle;
      //   this.result.errorInfo.detail = API_RESPONSE.messages.noCookieInRequest;
      //   return this.result.createError([this.result.errorInfo]);
      // }
      return this.memberService.loginSaveCookie(saveCookieModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
