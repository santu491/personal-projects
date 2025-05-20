import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod, IHttpHeader } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { IMedicaidSecretQuestionsList, IMedicaidUsersSecretQAResponse, ISecurityQuestions, IUpdateMedicaidSecretQA, IUpdateMedicaidSecretQAResponse, IUserMedicaidSecretQA } from '../models/memberModel';

@Service()
export class ProfileSecurityQAGateway {
  constructor(private _http: RestClient) { }

  commercialSecurityQuestions(
    request: ISecurityQuestions,
    method: string,
    isGetMethod: boolean
  ): Promise<ISecurityQuestions> {
    return this._http.invoke<ISecurityQuestions>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialSecurityQuestions,
      method: HttpMethod[method],
      ...request,
      responseType: ResponseType.JSON,
      requestName: isGetMethod
        ? requestName.GET_SECURITY_QUESTIONS
        : requestName.UPDATE_SECURITY_QUESTIONS
    });
  }

  medicaidSecretQuestionsApi(
    token: string,
    requestHeader: IHttpHeader
  ): Promise<IMedicaidSecretQuestionsList> {
    return this._http.invoke<IMedicaidSecretQuestionsList>({
      allowExceptions: true,
      url: APP.config.awsEndpoints.medicaidSecretQuestions,
      method: HttpMethod.Get,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        requestHeader
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_SECRET_QUESTIONS
    });
  }

  medicaidUserSecretQAPopulateApi(
    token: string,
    requestObject: IUserMedicaidSecretQA
  ): Promise<IMedicaidUsersSecretQAResponse> {
    return this._http.invoke<IMedicaidUsersSecretQAResponse>({
      allowExceptions: true,
      url: APP.config.awsEndpoints.medicaidUserSecretQA,
      method: HttpMethod.Post,
      data: requestObject,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        requestObject.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_USER_SECRET_QUESTIONS
    });
  }

  medicaidSecretQAUpdateApi(
    token: string,
    requestObject: IUpdateMedicaidSecretQA
  ): Promise<IUpdateMedicaidSecretQAResponse> {
    return this._http.invoke<IUpdateMedicaidSecretQAResponse>({
      allowExceptions: true,
      url: APP.config.awsEndpoints.medicaidSecretQAUpdate,
      method: HttpMethod.Put,
      data: requestObject,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        requestObject.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.UPDATE_SECRET_QUESTIONS
    });
  }
}
