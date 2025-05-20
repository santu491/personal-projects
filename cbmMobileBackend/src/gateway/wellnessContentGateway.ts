import {HeaderKeys, ReplaceStringKeyWords} from '../constants';
import {APP} from '../utils/app';
import {axiosGet} from '../utils/httpUtil';
import {decrypt} from '../utils/security/encryptionHandler';

export class WellnessContentGateway {
  private xApiKey = decrypt(APP.config.credibleMindDetails.xApiKey);
  private host = APP.config.credibleMindDetails.host;
  private monthlyResourcesURL = APP.config.credibleMindDetails.monthlyResources;
  private topicsURL = APP.config.credibleMindDetails.topics;

  /**
   * Retrieves the wellness resources for a specific month.
   *
   * @param {string} month - The month for which the resources are to be retrieved.
   * @returns {Promise} A promise that resolves to the wellness resources for the specified month.
   * @throws {Error} If there is an error during the retrieval process.
   */
  async getMonthlyResources(month: string) {
    const url = `${this.host}${this.monthlyResourcesURL}`.replace(
      ReplaceStringKeyWords.month,
      month,
    );
    const headers = {
      month,
      [HeaderKeys.X_API_KEY]: this.xApiKey,
    };
    const response = await axiosGet(url, headers);
    if (!response || !response.data) {
      throw response;
    }
    return response.data;
  }

  /**
   * Retrieves the wellness topics.
   *
   * @returns {Promise} A promise that resolves to the wellness topics.
   * @throws {Error} If there is an error during the retrieval process.
   */
  async getTopics() {
    const url = `${this.host}${this.topicsURL}`;
    const headers = {
      [HeaderKeys.X_API_KEY]: this.xApiKey,
    };
    const response = await axiosGet(url, headers);
    if (!response || !response.data) {
      throw response;
    }
    return response.data;
  }
}
