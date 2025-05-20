import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  OpenAPI2,
  Param2
} from '@anthem/communityapi/utils';
import {
  Get,
  JsonController
} from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { AdminService } from '../services/adminService';

@JsonController(API_INFO.contextPath + BASE_URL_EXTENSION.ADMIN)
export class AdminController extends BaseController {
  constructor(
    private adminService: AdminService,
    private validate: Validation,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/profile/:id')
  @OpenAPI2({
    description: 'Get the admin profile by id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAdminProfile(
    @Param2('id') id: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.adminService.getAdminProfile(id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

}
