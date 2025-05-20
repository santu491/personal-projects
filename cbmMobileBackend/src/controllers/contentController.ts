import {
  Authorized,
  Get,
  HeaderParam,
  JsonController,
  Param,
} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {GetContentSpec} from '../apiDetails/Content';
import {AllowedClients, Messages, ServiceConstants} from '../constants';
import {API_PATHS, CONTENT_ROUTES} from '../routingConstants';
import {ContentService} from '../services/eap/contentService';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';

@JsonController(API_PATHS.content)
export class ContentController {
  private contentService = new ContentService();
  result = new ResponseUtil();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Get content details
   * @route GET /content/:contentKey/:language
   * @access Public
   * @param contentKey string
   * @param language
   * @returns {object} - Content details
   */
  @OpenAPI(GetContentSpec)
  @Get(CONTENT_ROUTES.GET_CONTENT)
  @Authorized(AllowedClients)
  async getContentDetails(
    @Param('contentKey') contentKey: string,
    @Param('language') language: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.contentService.getContentService(
          contentKey,
          language,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - getContentDetails :: ${error}`);
      return error;
    }
  }
}
