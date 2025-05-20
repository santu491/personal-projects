import { API_RESPONSE } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';

@Service()
export class ContentModGateway {
  constructor(private _http: RestClient) {}

  postContentMod(): Promise<{}> {
    if (!APP.config.restApi.contentMod.url || APP.config.restApi.contentMod.url === '') {
      throw API_RESPONSE.messages.contentModUrlMissing;
    }

    return this._http.invoke<{}>({
      url: APP.config.restApi.contentMod.url,
      method: HttpMethod.Post,
      urlParams: [
        {
          isQueryParam: true,
          name: 'url',
          value: 'https://ascendumwebsitestorage.blob.core.windows.net/assets/prod/about-us/image_collage.png'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'contentModRequest',
      isFormData: true
    });
  }
}
