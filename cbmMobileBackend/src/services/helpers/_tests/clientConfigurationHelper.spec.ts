import {ClientConfigurationHelper} from '../clientConfigurationHelper';
import {ContentService} from '../../eap/contentService';
import {EAPClientConfigurationGateway} from '../../../gateway/eapClientConfigurationGateway';
import {ResponseUtil} from '../../../utils/responseUtil';
import {TemplateConstants, ServiceConstants} from '../../../constants';

jest.mock('../../eap/contentService');
jest.mock('../../../gateway/eapClientConfigurationGateway');
jest.mock('../../../utils/responseUtil');

describe('ClientConfigurationHelper', () => {
  let clientConfigurationHelper: ClientConfigurationHelper;
  let contentServiceMock: jest.Mocked<ContentService>;
  let clientConfigurationGatewayMock: jest.Mocked<EAPClientConfigurationGateway>;
  let responseUtilMock: jest.Mocked<ResponseUtil>;

  beforeEach(() => {
    contentServiceMock = new ContentService() as jest.Mocked<ContentService>;
    clientConfigurationGatewayMock =
      new EAPClientConfigurationGateway() as jest.Mocked<EAPClientConfigurationGateway>;
    responseUtilMock = new ResponseUtil() as jest.Mocked<ResponseUtil>;

    clientConfigurationHelper = new ClientConfigurationHelper();
    clientConfigurationHelper.contentService = contentServiceMock;
    clientConfigurationHelper.clientConfigurationGateway =
      clientConfigurationGatewayMock;
    clientConfigurationHelper.result = responseUtilMock;
  });

  describe('fetchClientData', () => {
    it('should fetch client data successfully', async () => {
      const appConfig = {
        data: {
          type: {
            objects: [],
            fields: {},
            arrays: {},
            sections: [],
            clients: [],
          },
          host: 'host',
          domainReplacements: [],
        },
      };
      const fetchData = jest
        .fn()
        .mockResolvedValue([{path: 'path', title: 'title'}]);
      contentServiceMock.getContentService.mockResolvedValue(appConfig);
      responseUtilMock.createSuccess.mockReturnValue({data: {}});

      const result = await clientConfigurationHelper.fetchClientData(
        'type',
        'path',
        'item',
        fetchData,
      );

      expect(result).toEqual({data: {}});
      expect(contentServiceMock.getContentService).toHaveBeenCalledWith(
        TemplateConstants.CONTENTID_EAP_CLIENT_CONFIGURATION,
        ServiceConstants.LANGUAGE_EN_US,
      );
      expect(fetchData).toHaveBeenCalledWith(appConfig);
    });

    it('should handle error when fetching client data', async () => {
      const error = new Error('error');
      contentServiceMock.getContentService.mockRejectedValue(error);
      responseUtilMock.createException.mockReturnValue({errors: {}});

      const result = await clientConfigurationHelper.fetchClientData(
        'type',
        'path',
        'item',
        jest.fn(),
      );

      expect(result).toEqual({errors: {}});
      expect(responseUtilMock.createException).toHaveBeenCalledWith(
        error,
        undefined,
        'Error fetching client data',
      );
    });
  });

  describe('getClientItems', () => {
    it('should return client items with the specified prefix', () => {
      const items = [{itemPrefixKey: 'value', otherKey: 'value'}];
      const result = clientConfigurationHelper.getClientItems(
        items,
        'itemPrefix',
      );

      expect(result).toEqual([{itemPrefixKey: 'value'}]);
    });
  });

  describe('assignCustomAttributes', () => {
    it('should assign custom attributes to response items', () => {
      const response = [{path: 'path', title: 'title'}];
      const objects = [{path: 'path', title: 'title', custom: 'custom'}];
      const fields = {field: 'field'};
      const arrays = {
        section: [
          {
            type: 'type',
            path: 'path',
            title: 'title',
            arrayCustom: 'arrayCustom',
          },
        ],
      };

      const result = clientConfigurationHelper.assignCustomAttributes(
        response,
        objects,
        fields,
        arrays,
      );

      expect(result).toEqual([
        {path: 'path', title: 'title', field: 'field', custom: 'custom'},
      ]);
    });
  });

  describe('unassignAttributes', () => {
    it('should unassign attributes from response items', () => {
      const response = {path: 'path', type: 'type'};
      const clients = [{path: 'path', type: 'type', custom: 'custom'}];

      const result = clientConfigurationHelper.unassignAttributes(
        response,
        clients,
      );

      expect(result).toEqual({path: 'path', type: 'type', custom: 'custom'});
    });
  });

  describe('modifyHosts', () => {
    it('should modify hosts in the response', () => {
      const response = {
        host: 'host',
        key: 'value',
      };
      const host = 'host';
      const clientUri = 'clientUri';
      const domainReplacements = [
        {
          pattern: 'http://qa.aem.anthem.com',
          value: 'https://anthem-qa1.adobecqms.net',
        },
        {
          pattern: 'http://uat.aem.anthem.com',
          value: 'https://anthem-uat2.adobecqms.net',
        },
      ];

      const result = clientConfigurationHelper.modifyHosts(
        response,
        host,
        clientUri,
        domainReplacements,
      );

      expect(result).toEqual({host: 'host', key: 'value'});
    });
  });

  describe('processNestedCardData', () => {
    it('should process nested card data', () => {
      const response = {key: 'value', staticRedirectUrl: 'url'};

      const result = clientConfigurationHelper.processNestedCardData(response);

      expect(result).toEqual({key: 'value', redirectUrl: 'url'});
    });
  });

  describe('preAssignMissingAttributeValues', () => {
    it('should pre-assign missing attribute values', async () => {
      const response = [{}];
      const appConfig = {data: {enableMock: {card: false}}};
      clientConfigurationGatewayMock.getCardAssets.mockResolvedValue({
        onlineResourceUrl: {value: 'url'},
      });

      const result =
        await clientConfigurationHelper.preAssignMissingAttributeValues(
          'card',
          response,
          'path',
          appConfig,
        );

      expect(result).toEqual([
        {pageCardsBannerButtonsLearnMoreRedirectUrl: 'url'},
      ]);
    });
  });

  describe('postAssignMissingAttributeValues', () => {
    it('should post-assign missing attribute values', async () => {
      const response = {};
      clientConfigurationHelper.assessmentsSurveyId = 'surveyId';

      const result =
        await clientConfigurationHelper.postAssignMissingAttributeValues(
          'resources',
          response,
        );

      expect(result).toEqual({assessmentsSurveyId: 'surveyId'});
    });
  });
});
