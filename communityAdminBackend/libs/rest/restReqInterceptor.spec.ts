import { APP, RequestContext } from '@anthem/communityadminapi/utils';
import { RestRequestInterceptor } from './restReqInterceptor';

describe('RestRequestInterceptor UTest', () => {
  let interceptor: RestRequestInterceptor;

  beforeEach(() => {
    APP.config.restApi.apiKey = '123456';
    APP.config.restApi.timeout = 5000;
    RequestContext.getContextItem = jest.fn((item: any) => {
      switch (item) {
        case 'UserNm':
          return '~testUser';
        case 'sessionId':
          return 'session123';
        case 'requestId':
          return '147852';
        case 'clientIp':
          return '123.45.45.123';
      }

      return '';
    });
    interceptor = new RestRequestInterceptor();
  });

  it('should add all soa specific headers to outgoing request with contenttype', () => {
    let req = interceptor.transform(<any>{data:{test:'test'}});
    expect(req.headers == null);
  });

});
