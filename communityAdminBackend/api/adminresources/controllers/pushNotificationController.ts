import { API_RESPONSE, BASE_URL_EXTENSION, BaseController, DEFAULT_RESPONSES, RequestValidation, Result, Validation, ValidationResponse, noCommunity } from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Delete, Get, JsonController, Post, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PageParam } from '../models/pageParamModel';
import { PushNotifiationTemplatePayload, PushNotificationRequest, TargetAudience, ViewPNRequest } from '../models/pushNotificationModel';
import { BaseResponse } from '../models/resultModel';
import { AdminUser } from '../models/userModel';
import { PushNotificationService } from '../services/pushNotificationService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PUSH_NOTIFICATION)
export class PushNotificationController extends BaseController {
  constructor(
    private result: Result,
    private validate: Validation,
    private requestValidation: RequestValidation,
    private pnService: PushNotificationService
  ) {
    super();
  }

  @Post('/')
  @OpenAPI2({
    description: 'Create a new scheduled push Notification',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async pushNotification(
    @Body2() payload: PushNotificationRequest
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      const validation: ValidationResponse = this.requestValidation.pushNotificationValidation(payload);
      if (validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validation.reason;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.pnService.createPushNotification(payload, adminUser.id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/all')
  @OpenAPI2({
    description: 'Get all the PNs (Scheduled/Cancelled)',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getPushNotifications(
    @Body2() payload: ViewPNRequest,
      @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const pageParams: PageParam = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      return await this.pnService.getPushNotification(
        pageParams,
        payload
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/edit')
  @OpenAPI2({
    description: 'Update the scheduled push Notification',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updatePushNotification(
    @Body2() payload: PushNotificationRequest
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      const validation: ValidationResponse = this.requestValidation.pushNotificationValidation(payload);
      if (validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validation.reason;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.pnService.updatePushNotification(payload, adminUser.id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Delete('/remove')
  @OpenAPI2({
    description: 'Update the scheduled push Notification',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removePushNotification(
    @QueryParam2('id') id: string
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.pnService.removePushNotification(id, this.validate.checkUserIdentity().id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/count')
  @OpenAPI2({
    description: 'Get Target Audience Count',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getTargetAudienceCount(
    @Body2() payload: TargetAudience
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      for (const community of payload.communities) {
        if (!this.validate.isHex(community)) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
          return this.result.createError([this.result.errorInfo]);
        }
      }

      return this.pnService.getTargetAudienceCount(
        payload
      );

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/metrics')
  @OpenAPI2({
    description: 'Get the metrix related to the Push Notification',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getPNMetrix(
  @QueryParam2('communities') communities: string[]
  ) {
    try {
      if (communities) {
        const communitiesIds = communities.filter((value) => value !== noCommunity);
        const validation = this.requestValidation.validCommunityArray(communitiesIds, true);
        if (communities.length > 0 && validation.validationResult) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
          return this.result.createError([this.result.errorInfo]);
        }
      }

      return this.pnService.getPNMetrix(communities);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/notificationTemplates')
  @OpenAPI2({
    description: 'Get the Push Notification template',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getNotificationTemplate() {
    try {
      const adminUser: AdminUser = this.validate.checkUserIdentity();

      return this.pnService.getPNTemplates(adminUser);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/notificationTemplates')
  @OpenAPI2({
    description: 'Update the Push Notification template',
    response: { ...DEFAULT_RESPONSES }
  })
  public async updateNotificationTemplate(
  @QueryParam2('templateId') templateId: string,
    @Body2() payload: PushNotifiationTemplatePayload
  ) {
    try {
      const adminUser: AdminUser = this.validate.checkUserIdentity();

      return this.pnService.updatePNTemplates(adminUser, templateId, payload.en);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
