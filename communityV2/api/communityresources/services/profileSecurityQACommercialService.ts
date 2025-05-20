import { API_RESPONSE, headers, Result } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { ProfileSecurityQAGateway } from '../gateways/profileSecurityQAGateway';
import { ISecurityQuestions } from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class ProfileSecurityQACommercialService {
  constructor(
    private result: Result,
    private profileSecurityQAGateway: ProfileSecurityQAGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getSecurityQuestions(
    memberId: string,
    webguid: string
  ): Promise<BaseResponse> {
    try {
      const getSecurityQuestions: ISecurityQuestions = new Object();
      getSecurityQuestions.headers = [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.WEBGUID,
          value: webguid ?? ''
        }
      ];
      getSecurityQuestions.urlParams = [
        {
          isQueryParam: false,
          name: headers.MEMBERID,
          value: memberId
        }
      ];
      const securityQuestionsList = await this.profileSecurityQAGateway.commercialSecurityQuestions(
        getSecurityQuestions,
        'Get',
        true
      );
      if (!securityQuestionsList?.usernm) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.internalServerError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(securityQuestionsList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateSecurityQuestions(
    securityQuestions: ISecurityQuestions
  ): Promise<BaseResponse> {
    try {
      const updateSecurityQuestions: ISecurityQuestions = new Object();
      updateSecurityQuestions.headers = [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.WEBGUID,
          value: securityQuestions?.webguid ?? ''
        },
        {
          name: headers.USER_NAME,
          value: securityQuestions?.usernm ?? ''
        }
      ];
      updateSecurityQuestions.urlParams = [
        {
          isQueryParam: false,
          name: headers.MEMBERID,
          value: securityQuestions.memberId
        },
        {
          isQueryParam: true,
          name: headers.USER_NAME,
          value: securityQuestions.usernm
        }
      ];
      updateSecurityQuestions.data = securityQuestions;
      const updatedResponse = await this.profileSecurityQAGateway.commercialSecurityQuestions(
        updateSecurityQuestions,
        'Put',
        false
      );
      if (!updatedResponse?.usernm) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.updateSecretQAErroeTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.updateSecretQAErroeDetails;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(updatedResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
