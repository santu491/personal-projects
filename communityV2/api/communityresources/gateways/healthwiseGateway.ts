import { TranslationLanguage } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  HealthWiseArticleResponse,
  HealthWiseAuthResponse,
  HealthWiseTopicResponse
} from '../models/healthWiseModel';

@Service()
export class HealthwiseGateway {
  constructor(private _http: RestClient) {}

  postAuth(): Promise<HealthWiseAuthResponse> {
    return this._http.invoke<HealthWiseAuthResponse>({
      url: APP.config.restApi.healthWise.authenticate,
      method: HttpMethod.Post,
      headers: [
        {
          name: 'Authorization',
          value: `Basic ${APP.config.restApi.healthWise.token}`
        },
        {
          name: 'X-HW-Version',
          value: '2'
        },
        {
          name: 'Content-Type',
          value: 'application/x-www-form-urlencoded'
        }
      ],
      data: 'grant_type=client_credentials&scope=*',
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: 'healthwiseAuthRequest'
    });
  }

  getTopicById(
    token: string,
    topicId: string,
    language: string
  ): Promise<HealthWiseTopicResponse> {
    let url = APP.config.restApi.healthWise.topicById;
    if (language !== TranslationLanguage.ENGLISH) {
      url = url.replace('en-us', 'es-us');
    }
    const data: Promise<HealthWiseTopicResponse> = this._http.invoke({
      url: url,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: false,
          name: 'topicId',
          value: topicId
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        },
        {
          name: 'X-HW-Version',
          value: '2'
        },
        {
          name: 'Accept',
          value: 'application/json'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'healthwiseTopicId'
    });
    return data;
  }

  getArticleTopic(
    token: string,
    conceptId: string,
    aspectId: string,
    language: string
  ): Promise<HealthWiseTopicResponse> {
    let url = APP.config.restApi.healthWise.topicByConceptIdAspectId;
    if (language !== TranslationLanguage.ENGLISH) {
      url = url.replace('en-us', 'es-us');
    }
    return this._http.invoke({
      url: url,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: false,
          name: 'conceptId',
          value: conceptId
        },
        {
          isQueryParam: false,
          name: 'aspectId',
          value: aspectId
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        },
        {
          name: 'X-HW-Version',
          value: '2'
        },
        {
          name: 'Accept',
          value: 'application/json'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'healthwiseTopicId'
    });
  }

  getArticleById(
    token: string,
    articleId: string,
    language: string
  ): Promise<HealthWiseArticleResponse> {
    const languageParam = (language !== TranslationLanguage.ENGLISH) ? 'en-us' : 'es-us';
    const url = APP.config.restApi.healthWise.articleById + articleId + '/' + languageParam;

    const data: Promise<HealthWiseArticleResponse> = this._http.invoke({
      url: url,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: false,
          name: 'articleId',
          value: articleId
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        },
        {
          name: 'X-HW-Version',
          value: '2'
        },
        {
          name: 'Accept',
          value: 'application/json'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'healthwiseTopicId'
    });
    return data;
  }
}
