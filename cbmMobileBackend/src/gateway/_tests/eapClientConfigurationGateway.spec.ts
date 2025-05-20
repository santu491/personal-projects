import {APP} from '../../utils/app';
import {axiosGet} from '../../utils/httpUtil';
import {appConfig} from '../../utils/mockData';
import {EAPClientConfigurationGateway} from '../eapClientConfigurationGateway';

jest.mock('../../utils/httpUtil');

describe('clientConfigurationGateway', () => {
  let gateway: EAPClientConfigurationGateway;
  const clientUri = 'company-demo';
  const mock = true;

  beforeEach(() => {
    gateway = new EAPClientConfigurationGateway();
    APP.config.clientConfiguration = appConfig.clientConfiguration;
  });

  describe('getResources', () => {
    it('should fetch client resources', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        data: {
          data: {
            clientList: {
              items: [
                {
                  coursesAndResourcesTitle: 'Courses and resources',
                  coursesAndResourcesCards: [
                    {
                      type: 'CardModel',
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      const response = await gateway.getResources(clientUri, !mock);

      expect(response).not.toBeNull();
    });

    it('should throw an error', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({});

      await gateway.getResources(clientUri, !mock).catch(error => {
        expect(error).toEqual({});
      });
    });
  });

  describe('getArticles', () => {
    it('should fetch client articles', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        data: {
          data: {
            articleList: {
              items: [
                {
                  type: 'ArticleModel',
                  path: '/content/dam/careloneap/content-fragments/articles/ariesmarine/category/mental-health/article-banner',
                  title: 'anand',
                  description: {
                    text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
                  },
                  image: {
                    url: 'https://qa.aem.anthem.com/content/dam/anthemeap/images/desktop/1092112802_friendly_nurse_supporting_an_eldery_lady.jpg',
                  },
                  mobileImage: {
                    url: 'https://qa.aem.anthem.com/content/dam/anthemeap/images/desktop/1092112802_friendly_nurse_supporting_an_eldery_lady.jpg',
                  },
                  articlePath: null,
                  articlePathURLOpenInNewTab: false,
                  articleTags: ['Article', 'Adult Care'],
                },
              ],
            },
          },
        },
      });

      const response = await gateway.getArticles(
        '/content/dam/careloneap/content-fragments/articles/ariesmarine/category/mental-health/article-banner',
        !mock,
      );

      expect(response).not.toBeNull();
    });

    it('should throw an error', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({});

      await gateway.getArticles(clientUri, !mock).catch(error => {
        expect(error).toEqual({});
      });
    });
  });

  describe('getCards', () => {
    it('should fetch client cards', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        data: {
          data: {
            cardList: {
              items: [
                {
                  type: 'ArticleModel',
                  path: '/content/dam/careloneap/content-fragments/articles/ariesmarine/category/mental-health/article-banner',
                },
              ],
            },
          },
        },
      });

      const response = await gateway.getCards('cards', !mock);

      expect(response).not.toBeNull();
    });

    it('should throw an error', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({});

      await gateway.getCards(clientUri, !mock).catch(error => {
        expect(error).toEqual({});
      });
    });
  });

  describe('getCardAssets', () => {
    const path =
      '/api/assets/careloneap/content-fragments/custom-card/company-demo/monetary-support';
    const mock = true;

    it('should fetch card assets with mock data', async () => {
      const mockResponse = {
        data: {
          path: '/api/assets/careloneap/content-fragments/custom-card/company-demo/monetary-support',
          properties: {
            elements: {
              onlineResourceUrl: {
                value:
                  '/content/careloneap/us/en/client-home/plan-finances/cm-article?page=topics/financial-wellness?query=',
              },
            },
          },
        },
      };
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);

      const response = await gateway.getCardAssets(path, mock);

      expect(response).toEqual(mockResponse.data.properties.elements);
    });

    it('should fetch card assets from API', async () => {
      const mockResponse = {
        data: {
          properties: {
            elements: {
              title: 'Support starts here',
              description: 'Let us guide you to the right resources.',
            },
          },
        },
      };
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);

      const response = await gateway.getCardAssets(path, !mock);

      expect(response).toEqual(mockResponse.data.properties.elements);
    });

    it('should throw an error if card assets are not present', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({});

      await gateway.getCardAssets(path, !mock).catch(error => {
        expect(error).toEqual({});
      });
    });

    it('should throw an error if an error occurs', async () => {
      (axiosGet as jest.Mock).mockRejectedValue('error');

      await gateway.getCardAssets(path, !mock).catch(error => {
        expect(error).toEqual('error');
      });
    });
  });

  describe('getClients', () => {
    it('should fetch clients with mock data', async () => {
      const mockResponse = [
        {
          brandLogo: {},
          clientLogo: null,
          clientName: 'Company Demo',
          clientUri: 'company-demo',
          customClient: false,
          eapId: null,
          eapNumber: '888-888-8888',
          eapSupportText: 'EAP support :',
          enable: true,
          otherEapNumbers: null,
          path: '/content/dam/careloneap/content-fragments/clients/company-demo',
          type: 'ClientModel',
        },
        {
          brandLogo: {},
          clientLogo: {
            url: 'https://qa.aem.anthem.com/content/dam/careloneap/logos/minimum-clients/Resized_BCBS_NC.png',
          },
          clientName: 'Blue Cross Blue Shield of North Carolina',
          clientUri: 'bcbsnc',
          customClient: true,
          eapId: null,
          eapNumber: '877-764-5643',
          eapSupportText: 'EAP support call/text :',
          enable: true,
          otherEapNumbers: [],
          path: '/content/dam/careloneap/content-fragments/clients/bcbsnc',
          type: 'ClientModel',
        },
        {
          brandLogo: {},
          clientLogo: {
            url: 'https://qa.aem.anthem.com/content/dam/careloneap/logos/myeaphelper/DMBA_horz.png',
          },
          clientName: 'Deseret Mutual Benefits Administrations (DMBA)+',
          clientUri: 'myeaphelper',
          customClient: true,
          eapId: null,
          eapNumber: '844-280-9629',
          eapSupportText: null,
          enable: true,
          otherEapNumbers: [
            '{"eapNumberType":"Call or text : ","otherEapNumber":"844-280-9629"}',
          ],
          path: '/content/dam/careloneap/content-fragments/clients/myeaphelper',
          type: 'ClientModel',
        },
      ];
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);

      const response = await gateway.getClients(false, true);

      expect(response).toEqual(mockResponse);
    });

    it('should fetch clients from API', async () => {
      const apiResponse = {
        data: {
          data: {
            clientList: {
              items: [
                {
                  type: 'ClientModel',
                  path: '/content/dam/careloneap/content-fragments/clients/company-demo',
                  enable: true,
                  clientName: 'Company Demo',
                  clientUri: 'company-demo',
                  customClient: false,
                  brandLogo: {},
                  clientLogo: null,
                  eapId: null,
                  eapSupportText: 'EAP support :',
                  eapNumber: '888-888-8888',
                  otherEapNumbers: null,
                },
                {
                  type: 'ClientModel',
                  path: '/content/dam/careloneap/content-fragments/clients/bcbsnc',
                  enable: true,
                  clientName: 'Blue Cross Blue Shield of North Carolina',
                  clientUri: 'bcbsnc',
                  customClient: true,
                  brandLogo: {},
                  clientLogo: {
                    url: 'https://qa.aem.anthem.com/content/dam/careloneap/logos/minimum-clients/Resized_BCBS_NC.png',
                  },
                  eapId: null,
                  eapSupportText: 'EAP support call/text :',
                  eapNumber: '877-764-5643',
                  otherEapNumbers: [],
                },
                {
                  type: 'ClientModel',
                  path: '/content/dam/careloneap/content-fragments/clients/myeaphelper',
                  enable: true,
                  clientName: 'Deseret Mutual Benefits Administrations (DMBA)+',
                  clientUri: 'myeaphelper',
                  customClient: true,
                  brandLogo: {},
                  clientLogo: {
                    url: 'https://qa.aem.anthem.com/content/dam/careloneap/logos/myeaphelper/DMBA_horz.png',
                  },
                  eapId: null,
                  eapSupportText: null,
                  eapNumber: '844-280-9629',
                  otherEapNumbers: [
                    '{"eapNumberType":"Call or text : ","otherEapNumber":"844-280-9629"}',
                  ],
                },
              ],
            },
          },
        },
      };
      (axiosGet as jest.Mock).mockResolvedValue(apiResponse);

      const response = await gateway.getClients(false, false);

      expect(response).toEqual(apiResponse.data.data.clientList.items);
    });

    it('should throw an error if no clients are found', async () => {
      const emptyResponse = {
        data: {
          data: {
            clientList: {
              items: [],
            },
          },
        },
      };
      (axiosGet as jest.Mock).mockResolvedValue(emptyResponse);

      await expect(gateway.getClients(false, false)).rejects.toEqual(
        emptyResponse,
      );
    });

    it('should throw an error if an error occurs', async () => {
      const error = new Error('error');
      (axiosGet as jest.Mock).mockRejectedValue(error);

      await expect(gateway.getClients(false, false)).rejects.toEqual(error);
    });
  });
});
