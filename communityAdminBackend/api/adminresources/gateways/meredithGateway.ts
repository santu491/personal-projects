import { HttpMethod } from '@anthem/communityadminapi/http';
import { ResponseType, RestClient } from '@anthem/communityadminapi/rest';
import { APP } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { MeredithResponse } from '../models/meredithModel';

@Service()
export class MeredithGateway {
  constructor(private _http: RestClient) { }

  getArticle(articleId: string): Promise<MeredithResponse> {
    return this._http.invoke<MeredithResponse>({
      url: APP.config.restApi.meredithApi.getArticle,
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
          name: 'x-api-key',
          value: APP.config.restApi.meredithApi.accessKey
        },
        {
          name: 'Accept',
          value: 'application/jaon'
        }
      ],
      isFormData: false,
      responseType: ResponseType.JSON,
      requestName: 'MeredithGetRequest'
    });
  }
}
