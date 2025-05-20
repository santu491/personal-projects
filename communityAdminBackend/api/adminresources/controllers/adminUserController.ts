import {
  API_RESPONSE,
  AdminRole,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import { OpenAPI2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { AdminUserService } from '../services/adminUserService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.USER)

export class AdminUserController extends BaseController {
  constructor(
    private result: Result,
    private validate: Validation,
    private userService: AdminUserService
  ) {
    super();
  }

  @Get('/persona')
  @OpenAPI2({
    description: 'Get Persona of the Admin User',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPersona(
    @QueryParam2('isPersona', { required: false }) isPersona: boolean
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (adminUser.role !== AdminRole.scadmin) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedTitle;
      }

      return this.userService.getPersona(isPersona);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
