import {Messages} from '../../constants';
import {WellnessContentGateway} from '../../gateway/wellnessContentGateway';
import {TopicsResponse} from '../../types/wellnessContentModel';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';

export class WellnessContentService {
  result = new ResponseUtil();
  wellnessTopicsGateway = new WellnessContentGateway();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Fetches updated resources/topics for the month
   * @param month Month
   * @returns SUCCESS if resources are fetched
   */
  async getMonthlyResourcesService(month?: string) {
    try {
      month = month || (new Date().getMonth() + 1).toString();
      const response =
        await this.wellnessTopicsGateway.getMonthlyResources(month);
      return response
        ? this.result.createSuccess(response)
        : this.result.createException(response);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - getMonthlyResourcesService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.appointmentError,
      );
    }
  }

  /**
   * Fetches topics
   * @returns SUCCESS if topics are fetched
   */
  async getTopicsService() {
    try {
      const topicsResponse: TopicsResponse =
        await this.wellnessTopicsGateway.getTopics();
      // Sort the topicsResponse.results array alphabetically based on the title property
      topicsResponse.results.sort((a, b) => a.title.localeCompare(b.title));
      return topicsResponse
        ? this.result.createSuccess(topicsResponse)
        : this.result.createException(topicsResponse);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getTopicsService :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.appointmentError,
      );
    }
  }
}
