import {Authorized, Body, JsonController, Post} from 'routing-controllers';
import {AllowedClients} from '../constants';
import {API_PATHS, PROVIDER_ROUTES} from '../routingConstants';
import {ProviderService} from '../services/eap/providerService';
import {
  AddressRequest,
  ProvidersListRequest,
  SendEmailRequest,
} from '../types/providersRequest';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {
  GetAddressSpec,
  GetProvidersListSpec,
  SendEmailRequestSpec,
} from '../apiDetails/Provider';

@JsonController(API_PATHS.provider)
export class ProviderController {
  private responseUtil = new ResponseUtil();
  private providerService = new ProviderService();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Suggest the  full address for the entered address
   * @route POST /addresses
   * @access Public
   * @returns List of addresses
   * @param data
   */
  @OpenAPI(GetAddressSpec)
  @Post(PROVIDER_ROUTES.addresses)
  @Authorized(AllowedClients)
  async getProviderAddresses(@Body() payload: AddressRequest) {
    try {
      return await this.providerService.getProviderAddresses(payload.data);
    } catch (error) {
      this.Logger.error(`${this.className} - getProviderAddresses :: ${error}`);
      return this.responseUtil.createException(error);
    }
  }

  /**
   * Suggest the  Geocode details of selected address
   * @route POST /geoCode/address
   * @access Public
   * @returns GeCode of addresses
   * @param data
   */
  @OpenAPI(GetAddressSpec)
  @Post(PROVIDER_ROUTES.geoCodeAddress)
  @Authorized(AllowedClients)
  async getGeoCodeAddress(@Body() payload: AddressRequest) {
    try {
      return await this.providerService.getGeoCodeAddress(payload.data);
    } catch (error) {
      this.Logger.error(`${this.className} - getGeoCodeAddress :: ${error}`);
      return error;
    }
  }

  /**
   * Get the list of providers generated
   * @route POST /providers
   * @access Public
   * @returns List of the providers
   * @param data
   */
  @OpenAPI(GetProvidersListSpec)
  @Post(PROVIDER_ROUTES.providers)
  @Authorized(AllowedClients)
  async fetchProviders(@Body() payload: ProvidersListRequest) {
    try {
      return await this.providerService.fetchProvidersList(payload);
    } catch (error) {
      this.Logger.error(`${this.className} - fetchProviders :: ${error}`);
      return error;
    }
  }

  /**
   * Get the provider details
   * @route POST /providerDetails
   * @access Public
   * @returns Details of the provider
   * @param data
   */
  @OpenAPI(GetAddressSpec)
  @Post(PROVIDER_ROUTES.providerDetails)
  @Authorized(AllowedClients)
  async getProvidersDetails(@Body() payload: AddressRequest) {
    try {
      return await this.providerService.getProviderDetails(payload.data);
    } catch (error) {
      this.Logger.error(`${this.className} - getProvidersDetails :: ${error}`);
      return error;
    }
  }

  /**
   * Send email to the user
   * @route POST /sendEmail
   * @access Public
   * @returns if the email is sent or not
   * @param data
   */
  @OpenAPI(SendEmailRequestSpec)
  @Post(PROVIDER_ROUTES.email)
  @Authorized(AllowedClients)
  async sendEmail(@Body() payload: SendEmailRequest) {
    try {
      return await this.providerService.sendEmailService(payload);
    } catch (error) {
      this.Logger.error(`${this.className} - sendEmail :: ${error}`);
      return error;
    }
  }
}
