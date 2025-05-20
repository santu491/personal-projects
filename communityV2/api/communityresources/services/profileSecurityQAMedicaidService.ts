import {
  API_RESPONSE,
  memberInfo,
  Result
} from '@anthem/communityapi/common';
import { IHttpHeader } from '@anthem/communityapi/http';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { MemberGateway } from '../gateways/memberGateway';
import { ProfileSecurityQAGateway } from '../gateways/profileSecurityQAGateway';
import {
  IModifiledQuestion,
  ISecurityQuestionAnswer,
  ISecurityQuestions,
  IUpdateMedicaidSecretQA,
  IUser,
  IUserMedicaidSecretQA
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { MemberServiceHelper } from './helpers/memberServiceHelper';

@Service()
export class ProfileSecurityQAMedicaidService {
  constructor(
    private result: Result,
    private memberServiceHelper: MemberServiceHelper,
    private profileSecurityQAGateway: ProfileSecurityQAGateway,
    private memberGateway: MemberGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getMedicaidSecretQuestionsList(dn: string): Promise<BaseResponse> {
    try {
      const requestHeader: IHttpHeader = APP.config.restApi.webUserGbdHeader;
      const securityQuestionsList = await this.profileSecurityQAGateway.medicaidSecretQuestionsApi(
        (await this.memberGateway.authToken()).access_token,
        requestHeader
      );
      if (!securityQuestionsList?.secretQuestions) {
        this.result.errorInfo.title = API_RESPONSE.messages.notFound;
        this.result.errorInfo.detail = API_RESPONSE.messages.noSecretQuestions;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }
      const requestObject = this.getMedicaidSecretQARequest(
        dn
      );
      requestObject.header = APP.config.restApi.webUserGbdHeader;
      const medicaidUserSecretQA = await this.profileSecurityQAGateway.medicaidUserSecretQAPopulateApi(
        (await this.memberGateway.authToken()).access_token,
        requestObject
      );
      if (!medicaidUserSecretQA?.user) {
        this.result.errorInfo.title = API_RESPONSE.messages.notFound;
        this.result.errorInfo.detail = API_RESPONSE.messages.noSecretQuestions;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }
      const medicaidSecretQA = this.formatMedicaidSecretQAResponse(securityQuestionsList.secretQuestions, medicaidUserSecretQA.user);
      return this.result.createSuccess(medicaidSecretQA);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateMedicaidSecretQuestions(
    securityQuestions: ISecurityQuestions
  ): Promise<BaseResponse> {
    try {
      const requestObject = this.updateMedicaidSecretQARequest(
        securityQuestions
      );

      requestObject.header = APP.config.restApi.webUserGbdHeader;
      const securityQAUpdateResponse = await this.profileSecurityQAGateway.medicaidSecretQAUpdateApi(
        (await this.memberGateway.authToken()).access_token,
        requestObject
      );

      if (!securityQAUpdateResponse?.user) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.updateSecretQAErroeTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.updateSecretQAErroeDetails;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(securityQAUpdateResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private formatMedicaidSecretQAResponse = (allQuestionsList: string[], userQA: IUser): ISecurityQuestions => {
    const allSecretQuestionsList: ISecurityQuestionAnswer[] = [];
    const userSecretQuesions: ISecurityQuestionAnswer[] = [];
    allQuestionsList.forEach((ques) => allSecretQuestionsList.push({ question: ques }));
    userQA.secretQuestionAnswers.forEach((ques, index) => userSecretQuesions.push({
      questionNo: `${index+1}`,
      question: ques.question,
      isAnswered: !ques.answer ? 'false' : 'true',
      answer: 'ENCRYPTED'
    }));
    const secretQuestions = [...userSecretQuesions, ...allSecretQuestionsList].reduce((ques, current) => {
      const q = ques.find((item: ISecurityQuestionAnswer) => item.question === current.question);
      if (!q) {
        return ques.concat([current]);
      } else {
        return ques;
      }
    }, []);
    return {
      usernm: userQA.username,
      secretQuestions: secretQuestions
    };
  };

  private getMedicaidSecretQARequest = (
    dn: string
  ): IUserMedicaidSecretQA => {
    return {
      requestContext: this.memberServiceHelper.generateRequestContext(),
      dn: dn,
      repositoryEnum: memberInfo.REPOSITORY_ENUM
    };
  };

  private updateMedicaidSecretQARequest = (
    securityQuestions: ISecurityQuestions
  ): IUpdateMedicaidSecretQA => {
    const secretQandA = [];
    securityQuestions.secretQuestions.forEach((questionAnswer, index) => {
      secretQandA.push(...this.formatQuestionAnswers(questionAnswer, index));
    });

    return {
      requestContext: this.memberServiceHelper.generateRequestContext(),
      identityInfo: {
        dn: securityQuestions.dn,
        iamGuid: securityQuestions.webguid,
        repositoryEnum: memberInfo.REPOSITORY_ENUM
      },
      modifyAttributes: secretQandA
    };
  };

  private formatQuestionAnswers = (
    questionAnswer: ISecurityQuestionAnswer,
    index: number
  ): IModifiledQuestion[] => {
    const indexAppend = index !== 0 ? (index + 1).toString() : '';
    return [
      {
        modifyAttributeEnum: memberInfo.SECRET_QUESTION + indexAppend,
        values: [questionAnswer.question.toLowerCase()],
        modifyTypeEnum: memberInfo.REPLACE
      },
      {
        modifyAttributeEnum: memberInfo.SECRET_ANSWER + indexAppend,
        values: [questionAnswer.answer.toLowerCase()],
        modifyTypeEnum: memberInfo.REPLACE
      }
    ];
  };
}
