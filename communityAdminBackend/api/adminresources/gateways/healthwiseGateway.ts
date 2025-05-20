
import { contentKeys } from '@anthem/communityadminapi/common';
import { HttpMethod } from '@anthem/communityadminapi/http';
import { ResponseType, RestClient } from '@anthem/communityadminapi/rest';
import { APP } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { HealthWiseAuthResponse, HealthWiseTopicResponse } from '../models/healthWiseModel';

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
    if (language !== contentKeys.english) {
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
    if (language !== contentKeys.english) {
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
}
