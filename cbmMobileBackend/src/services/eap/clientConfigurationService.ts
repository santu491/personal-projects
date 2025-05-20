/* eslint-disable @typescript-eslint/no-explicit-any */
import {ServiceConstants} from '../../constants';
import {EAPClientConfigurationGateway as ClientConfigurationGateway} from '../../gateway/eapClientConfigurationGateway';
import {
  ClientArticlesRequest,
  ClientCardsRequest,
} from '../../models/AppConfig';
import {ResponseUtil} from '../../utils/responseUtil';
import {ContentService} from './contentService';
import {ClientConfigurationHelper} from '../helpers/clientConfigurationHelper';
import {AuditHelper} from '../helpers/auditHelper';

/**
 * ClientConfigurationService class provides methods to fetch client resources, articles, and cards.
 * It uses the ClientConfigurationHelper and ClientConfigurationGateway to retrieve and process the data.
 */
export class ClientConfigurationService {
  result = new ResponseUtil();
  clientConfigurationHelper = new ClientConfigurationHelper();
  clientConfigurationGateway = new ClientConfigurationGateway();
  contentService = new ContentService();
  auditHelper = new AuditHelper();

  /**
   * Fetches client resources based on the client URI and resource type.
   * @param {string} clientUri - The URI of the client.
   * @param {string} [resource] - The type of resource to fetch (optional).
   * @returns {Promise<any>} The result of the fetch operation.
   */
  async getClientResources(clientUri: string, resource?: string) {
    return this.clientConfigurationHelper.fetchClientData(
      ServiceConstants.STRING_RESOURCES,
      clientUri,
      resource!,
      (appConfig: any) =>
        this.clientConfigurationGateway.getResources(
          clientUri,
          appConfig?.data?.enableMock?.resources ?? false,
        ),
    );
  }

  /**
   * Fetches client articles based on the request and item.
   * @param {ClientArticlesRequest} request - The request object containing article details.
   * @param {string} [item] - The item to fetch (optional).
   * @returns {Promise<any>} The result of the fetch operation.
   */
  async getClientArticles(request: ClientArticlesRequest, item?: string) {
    return this.clientConfigurationHelper.fetchClientData(
      ServiceConstants.STRING_ARTICLE,
      request.path,
      item!,
      (appConfig: any) =>
        this.clientConfigurationGateway.getArticles(
          request.path,
          appConfig?.data?.enableMock?.articles ?? false,
        ),
    );
  }

  /**
   * Fetches client cards based on the request and item.
   * @param {ClientCardsRequest} request - The request object containing card details.
   * @param {string} [item] - The item to fetch (optional).
   * @returns {Promise<any>} The result of the fetch operation.
   */
  async getClientCards(request: ClientCardsRequest, item?: string) {
    return this.clientConfigurationHelper.fetchClientData(
      ServiceConstants.STRING_CARD,
      request.path,
      item!,
      (appConfig: any) =>
        this.clientConfigurationGateway.getCards(
          request.path,
          appConfig?.data?.enableMock?.card ?? false,
        ),
    );
  }
}
