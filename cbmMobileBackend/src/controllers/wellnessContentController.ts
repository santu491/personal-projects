import {Get, JsonController, QueryParam} from 'routing-controllers';
import {API_PATHS, WELLNESS_TOPICS_ROUTES} from '../routingConstants';
import {WellnessContentService} from '../services/eap/wellnessContentService';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {GetMonthlyResourcesSpec, GetTopicsSpec} from '../apiDetails/Wellness';

@JsonController(API_PATHS.wellnessTopics)
export class WellnessContentController {
  result = new ResponseUtil();
  wellnessTopicsService = new WellnessContentService();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Get all the resources/topics updated in that month
   * @route Get /monthly-resources
   * @Param month
   * @returns back all updated resources/topics
   */
  @OpenAPI(GetMonthlyResourcesSpec)
  @Get(WELLNESS_TOPICS_ROUTES.monthlyResources)
  async getMonthlyResourcesController(@QueryParam('month') month: string) {
    try {
      return await this.wellnessTopicsService.getMonthlyResourcesService(month);
    } catch (error) {
      this.Logger.error(
        `${this.className} - getMonthlyResourcesController :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Get all the topics
   * @route Get /topics
   * @returns back all topics
   */
  @OpenAPI(GetTopicsSpec)
  @Get(WELLNESS_TOPICS_ROUTES.topics)
  async getTopicsController() {
    try {
      return await this.wellnessTopicsService.getTopicsService();
    } catch (error) {
      this.Logger.error(`${this.className} - getTopicsController :: ${error}`);
      return error;
    }
  }
}
