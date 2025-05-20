import {
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result
} from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { UserCleanUp } from '../models/userModel';
import { AppMemberService } from '../services/appMemberService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.USER)
export class AppMemberController extends BaseController {
  constructor(
    private appMemberService: AppMemberService,
    private result: Result
  ) {
    super();
  }

  @Get('/delete')
  @OpenAPI2({
    description: 'Get list of members who are marked for delete',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getDeleteRequestedUsers(): Promise<BaseResponse> {
    try {
      const users = await this.appMemberService.getDeleteRequestedUsers();

      return users;
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/delete')
  @OpenAPI2({
    description: 'Update the members who are marked for delete',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateUserDeleteRequest(
    @Body2() payload: UserCleanUp
  ): Promise<BaseResponse> {
    try {
      const response = await this.appMemberService.updateUserDeleteRequest(payload.approved, payload.userId);

      return response;
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

}
