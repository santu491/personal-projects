import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { OpenAPI2, RequestContext } from '@anthem/communityapi/utils';
import { JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { ManageProfileService } from '../services/manageProfileService';

@JsonController(API_INFO.securePath)
export class ManageProfileController extends BaseController {
  constructor(
    private manageProfileService: ManageProfileService,
    private validate: Validation,
    private result: Result
  ) {
    super();
  }

  @Put('/delete/profile')
  @OpenAPI2({
    description: 'Delete profile by ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deleteProfile(): Promise<BaseResponse> {
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);
    if (!this.validate.isHex(currentUser.id)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.manageProfileService.deleteProfile(currentUser.id);
  }
}
