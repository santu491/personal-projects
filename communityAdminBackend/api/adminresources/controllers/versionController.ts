import {
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { AppVersionModel } from '../models/appVersionModel';
import { BaseResponse } from '../models/resultModel';
import { VersionService } from '../services/versionService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.APP_VERSION)
export class VersionController extends BaseController {
  constructor(
    private result: Result,
    private validate: Validation,
    private versionService: VersionService
  ) {
    super();
  }

  @Get('/')
  @OpenAPI2({
    description: 'Get app versions',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAppVersion(): Promise<BaseResponse> {
    try {
      return await this.versionService.getAppVersion();
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/')
  @OpenAPI2({
    description: 'Update app versions',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateAppVersion(
    @Body2() payload: AppVersionModel
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      return await this.versionService.updateAppVersion(payload, currentUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
