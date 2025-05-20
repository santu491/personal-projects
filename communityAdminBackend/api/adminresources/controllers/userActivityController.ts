import { API_RESPONSE, AdminRole, BASE_URL_EXTENSION, BaseController, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityadminapi/common';
import { OpenAPI2, Param2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { UserActivityService } from '../services/userActivityService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.ACTIVITY)
export class UserActivityController extends BaseController {
  constructor(
    private result: Result,
    private validate: Validation,
    private userActivityService: UserActivityService
  ) {
    super();
  }

  @Get('/')
  @OpenAPI2({
    description: 'Get All Admin Activity',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAdminActivity(
    @QueryParam2('adminId') adminId: string
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      if (!currentUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      if (currentUser.role === AdminRole.scadmin || currentUser.role === AdminRole.sysadmin) {
        return await this.userActivityService.getSCAdminActivity(currentUser.id, adminId);
      }
      return await this.userActivityService.getAdminActivity(currentUser.id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/count')
  @OpenAPI2({
    description: 'Get All Admin Activity count',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAdminActivityCount(
    @QueryParam2('read') read: boolean
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      if (!currentUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      if (currentUser.role === AdminRole.scadmin) {
        return await this.userActivityService.getSCAdminActivityCount(currentUser.id, read);
      }
      return await this.userActivityService.getAdminActivityCount(currentUser.id, read);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/read/:activityId')
  @OpenAPI2({
    description: 'Mark admin activity as read',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateActivityAsRead(
    @Param2('activityId') activityId: string
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      if (!currentUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.userActivityService.updateActivityAsRead(
        activityId,
        currentUser.id
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
