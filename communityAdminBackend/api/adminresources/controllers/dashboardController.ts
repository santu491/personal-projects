import { BASE_URL_EXTENSION, BaseController, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityadminapi/common';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { OpenAPI2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { DashboardService } from '../services/dashboardService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.DASHBOARD)
export class DashboardController extends BaseController {

  constructor(
    private result: Result,
    private validate: Validation,
    private dashboardService: DashboardService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/activeUsers')
  @OpenAPI2({
    description: 'Get Active User Count',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCurrentUserCount() {
    try {
      return await this.dashboardService.getActiveUsersCount();
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  @Get('/newUsers')
  @OpenAPI2({
    description: 'Get New User Count',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getNewUserCount() {
    try {
      return await this.dashboardService.getNewUsersCount();
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  @Get('/latestPosts')
  @OpenAPI2({
    description: 'Get the latest posts published in communities',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getLatestPosts() {
    try {
      const admin = this.validate.checkUserIdentity();
      return await this.dashboardService.getLatestPost(admin.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  @Get('/postActivity')
  @OpenAPI2({
    description: 'Get the number of activities in community posts',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPostActivity() {
    try {
      const admin = this.validate.checkUserIdentity();
      return await this.dashboardService.getPostActivities(admin.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  @Get('/userCount')
  @OpenAPI2({
    description: 'Get the number of users',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getUserCount() {
    try {
      return await this.dashboardService.getUserData();
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }
}
