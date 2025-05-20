import {Messages} from '../../../constants';
import {APP} from '../../../utils/app';
import {
  mockAuditHelper,
  mockclientConfigurationGateway,
  mockContentService,
} from '../../../utils/baseTest';
import {appConfig, clientConfigurationData} from '../../../utils/mockData';
import {ResponseUtil} from '../../../utils/responseUtil';
import {ClientConfigurationService} from '../clientConfigurationService';

jest.mock('../../../gateway/eapClientConfigurationGateway', () => ({
  EAPClientConfigurationGateway: jest.fn(() => mockclientConfigurationGateway),
}));
jest.mock('../../helpers/auditHelper', () => ({
  AuditHelper: jest.fn(() => mockAuditHelper),
}));

jest.mock('../contentService', () => ({
  ContentService: jest.fn(() => mockContentService),
}));

describe('clientConfigurationService', () => {
  let service: ClientConfigurationService;
  const responseUtil = new ResponseUtil();
  const clientUri = 'company-demo';

  beforeEach(() => {
    service = new ClientConfigurationService();
    APP.config.clientConfiguration = appConfig.clientConfiguration;
    APP.config.database = appConfig.database;
  });

  describe('getClientResources', () => {
    const resource = 'courses-and-resources';
    it('should fetch client resources', async () => {
      mockContentService.getContentService.mockResolvedValue(
        clientConfigurationData,
      );
      mockclientConfigurationGateway.getResources.mockResolvedValue([
        {
          coursesAndResourcesTitle: 'Courses and resources',
          coursesAndResourcesCards: [
            {
              type: 'CardModel',
              path: '/content/dam/careloneap/content-fragments/custom-card/gtc-default/take-an-assessment_default',
              title: 'Support starts here',
              description: {
                text: 'Let us guide you to the right resources.',
              },
              image: {
                url: 'http://uat.aem.anthem.com/content/dam/careloneap/images/desktop/target/GettyImages-1423556847.jpg',
              },
              openURLInNewTab: true,
              buttonText: 'Get started',
              redirectUrl: null,
              staticRedirectUrl:
                'https://sit.assessment.carelonwellbeing.com/survey/anonymous/a2640dfa-6990-4f59-8f39-d84a1c5bbdae',
            },
          ],
        },
      ]);

      const response = await service.getClientResources(clientUri, resource);

      expect(response).not.toBeNull();
      expect(response).toHaveProperty('data');
    });

    it('should return error if resources client configuration is not present', async () => {
      mockContentService.getContentService.mockResolvedValue({
        data: null,
      });
      mockclientConfigurationGateway.getResources.mockResolvedValue([
        {
          coursesAndResourcesTitle: 'Courses and resources',
          coursesAndResourcesCards: [
            {
              type: 'CardModel',
              path: '/content/dam/careloneap/content-fragments/courses-and-resources/company-demo/learn-to-live',
              title: 'Learn to Live',
            },
          ],
        },
      ]);

      const response = await service.getClientResources(clientUri, resource);

      expect(response).toEqual(
        responseUtil.createException(Messages.clientConfigurationError),
      );
    });

    it('should return an error if an error occurs', async () => {
      mockContentService.getContentService.mockResolvedValue(
        clientConfigurationData,
      );
      mockclientConfigurationGateway.getResources.mockRejectedValue('error');

      const response = await service.getClientResources(clientUri, resource);

      expect(response).toEqual(
        responseUtil.createException(
          'error',
          undefined,
          'Error fetching client resources',
        ),
      );
    });
  });

  describe('getClientArticles', () => {
    const item = 'learn-to-live';
    it('should fetch client articles', async () => {
      mockContentService.getContentService.mockResolvedValue(
        clientConfigurationData,
      );
      mockclientConfigurationGateway.getArticles.mockResolvedValue([
        {
          type: 'ArticleModel',
          path: '/content/dam/careloneap/content-fragments/articles/ariesmarine/category/mental-health/more-about-topics/card1',
          title: null,
          description: {
            text: null,
          },
          image: null,
          mobileImage: null,
          articlePath: '#',
          articlePathURLOpenInNewTab: false,
          articleTags: null,
        },
      ]);

      const response = await service.getClientArticles(
        {
          path: '/content/dam/careloneap/content-fragments/articles/ariesmarine/category/mental-health/more-about-topics/card1',
        },
        item,
      );

      expect(response).not.toBeNull();
      expect(response).toHaveProperty('data');
    });

    it('should return error if articles client configuration is not present', async () => {
      mockContentService.getContentService.mockResolvedValue({
        data: null,
      });

      const response = await service.getClientArticles(
        {
          path: '/content/dam/careloneap/content-fragments/articles/tbi/category/mental-health/care-giver',
        },
        item,
      );

      expect(response).toEqual(
        responseUtil.createException(Messages.clientConfigurationError),
      );
    });

    it('should return an error if an error occurs', async () => {
      mockclientConfigurationGateway.getArticles.mockRejectedValue(
        'Error fetching client articles',
      );
      const response = await service.getClientArticles(
        {
          path: '/content/dam/careloneap/content-fragments/articles/ariesmarine/category/mental-health/more-about-topics/card1',
        },
        item,
      );

      expect(response).toEqual(
        responseUtil.createException(
          'Error while fetching client configuration details',
          undefined,
        ),
      );
    });
  });

  describe('getClientCards', () => {
    it('should fetch client cards', async () => {
      mockContentService.getContentService.mockResolvedValue(
        clientConfigurationData,
      );
      mockclientConfigurationGateway.getCards.mockResolvedValue([
        {
          type: 'CardModel',
          path: '/content/dam/careloneap/content-fragments/custom-card/company-demo/counselling-therapy-emotional-assistance-with-verified-experts',
        },
      ]);

      const response = await service.getClientCards({
        path: '/content/dam/careloneap/content-fragments/custom-card/company-demo/counselling-therapy-emotional-assistance-with-verified-experts',
      });

      expect(response).not.toBeNull();
      expect(response).toHaveProperty('data');
    });

    it('should return error if cards client configuration is not present', async () => {
      mockContentService.getContentService.mockResolvedValue({data: null});
      mockclientConfigurationGateway.getCards.mockResolvedValue([
        {
          type: 'CardModel',
          path: '/content/dam/careloneap/content-fragments/custom-card/company-demo/counselling-therapy-emotional-assistance-with-verified-experts',
        },
      ]);

      const response = await service.getClientCards({
        path: '/content/dam/careloneap/content-fragments/custom-card/company-demo/counselling-therapy-emotional-assistance-with-verified-experts',
      });

      expect(response).toEqual(
        responseUtil.createException(Messages.clientConfigurationError),
      );
    });

    it('should return an error if an error occurs', async () => {
      mockclientConfigurationGateway.getCards.mockRejectedValue('error');
      mockContentService.getContentService.mockResolvedValue(
        clientConfigurationData,
      );
      const response = await service.getClientCards({
        path: '/content/dam/careloneap/content-fragments/custom-card/company-demo/counselling-therapy-emotional-assistance-with-verified-experts',
      });

      expect(response).toEqual(
        responseUtil.createException(
          'error',
          undefined,
          'Error fetching client cards',
        ),
      );
    });
  });
});
