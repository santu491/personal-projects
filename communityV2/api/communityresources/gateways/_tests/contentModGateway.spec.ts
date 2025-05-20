import { ResponseType } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { ContentModGateway } from '../contentModGateway';

describe('contentModGateway', () => {
  let gateway: ContentModGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    gateway = new ContentModGateway(<any>mockRestClient);
  });

  //TODO: Update this with actual http call, once Content Mod POST works
  it('Post content mod Call', () => {
    let http = {
      url: APP.config.restApi.contentMod.url,
      method: 'POST',
      urlParams: [
        {
          isQueryParam: true,
          name: 'url',
          value: 'https://ascendumwebsitestorage.blob.core.windows.net/assets/prod/about-us/image_collage.png'
        }
      ],
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: 'contentModRequest',
    };
    gateway.postContentMod();
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
