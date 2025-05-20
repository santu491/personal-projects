import {
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import { OpenAPI2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { AdminUser } from '../models/userModel';
import { EmailNotificationService } from '../services/emailNotificationService';

@JsonController(API_INFO.securePath)
export class EmailNotificationController extends BaseController {
  constructor(
    private result: Result,
    private emailService: EmailNotificationService,
    private validate: Validation
  ) {
    super();
  }

  @Post('/emailNotification')
  @OpenAPI2({
    description: 'Trigger Mass email to users on privacy policy updates',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async privacyEmailNotification(): Promise<BaseResponse> {
    try {
      const adminUser: AdminUser = this.validate.checkUserIdentity();

      return this.emailService.triggerMassEmail(adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/touMassEmailInfo')
  @OpenAPI2({
    description: 'get tou mass email details',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async touMassEmailInfo(): Promise<BaseResponse> {
    try {
      return this.emailService.touMassEmailInfo();
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
