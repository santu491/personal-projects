
import { APP } from '@anthem/communityadminapi/utils';
import { mockRestClient } from '@anthem/communityadminapi/utils/mocks/mockRestClient';
import { HealthwiseGateway } from '../healthwiseGateway';

describe('healthWiseGateway', () => {
  let gateway: HealthwiseGateway;

  beforeEach(() => {
    gateway = new HealthwiseGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('PostAuth Call', () => {
    let http = {
      url: APP.config.restApi.healthWise.authenticate,
      method: 'POST',
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
      responseType: 1,
      data: 'grant_type=client_credentials&scope=*',
      isFormData: true,
      requestName: 'healthwiseAuthRequest'
    };
    gateway.postAuth();
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should Get Topic By Id', () => {
    const http = {
      url: APP.config.restApi.healthWise.topicById,
      method: 'GET',
      urlParams: [
        {
          isQueryParam: false,
          name: 'topicId',
          value: '5152119452598272'
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer test`
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
      responseType: 1,
      requestName: 'healthwiseTopicId'
    };
    gateway.getTopicById('test', '5152119452598272','en');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should Get Topic By ConceptId and AspectId', () => {
    const http = {
      url: APP.config.restApi.healthWise.topicByConceptIdAspectId,
      method: 'GET',
      urlParams: [
        {
          isQueryParam: false,
          name: 'conceptId',
          value: 'HWCV_05501'
        },
        {
          isQueryParam: false,
          name: 'aspectId',
          value: 'selfCareTxOptions'
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer test`
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
      responseType: 1,
      requestName: 'healthwiseTopicId'
    };
    gateway.getArticleTopic('test', 'HWCV_05501', 'selfCareTxOptions','en');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
