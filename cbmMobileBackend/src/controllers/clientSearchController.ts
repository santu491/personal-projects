import {Authorized, Get, JsonController, QueryParam} from 'routing-controllers';
import {AllowedClients, Messages, ServiceConstants} from '../constants';
import {API_PATHS, AUTH_ROUTES} from '../routingConstants';
import {searchEAPClient} from '../services/eap/clientSearchService';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {ValidationUtil} from '../utils/validationUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {ClientSearch} from '../apiDetails/ClientSearch';

// Controller for handling member authentication related requests
@JsonController(API_PATHS.auth)
export class ClientSearchController {
  result = new ResponseUtil();
  validate = new ValidationUtil();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Endpoint for searching clients
   * @route GET /clients
   * @access Public
   * @returns Client details
   * @param source - The source of the request
   * @param client - The client to be searched
   * @param searchData - The data to be searched
   * @param clientDetails - The details of the client making the request
   * @throws Error
   */
  @OpenAPI(ClientSearch)
  @Get(AUTH_ROUTES.clients)
  @Authorized(AllowedClients)
  async clientSearch(
    @QueryParam('source', {required: true}) source: string,
    @QueryParam('client') client: string,
    @QueryParam('searchData', {required: true}) searchData: string,
  ) {
    try {
      // If the source is EAP, use the searchEAPClient service
      if (source === ServiceConstants.STRING_EAP) {
        if (
          this.validate.isNullOrEmpty(searchData) ||
          !this.validate.isValidString(searchData)
        ) {
          return this.result.createException(Messages.invalidRequest);
        }

        // Call the 'searchEAPClient' function with the client, searchData, and clientId
        return await searchEAPClient(client, searchData);
      }

      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - clientSearch :: ${error}`);
      // If an error occurs, return the error
      return error;
    }
  }
}
