import { API_RESPONSE, BASE_URL_EXTENSION, BaseController, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Body2, OpenAPI2, QueryParam2, RequestContext } from '@anthem/communityapi/utils';
import { JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { CommunityInfoRequest } from '../models/userModel';
import { UserAttributeService } from '../services/userAttributeService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.USER)
export class UserAttributesController extends BaseController {
  constructor(
    private _result: Result,
    private _userAttrService: UserAttributeService,
    private _validate: Validation,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Put('/promote/story')
  @OpenAPI2({
    description: 'Get a users activity screen',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateStoryPromotion(
    @QueryParam2('remindMe') remindMe: boolean
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!currentUser.active) {
        this._result.errorInfo.title = API_RESPONSE.messages.userNotActiveTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.userNotActiveMessage;
        return this._result.createError([this._result.errorInfo]);
      }

      remindMe = remindMe ?? true;
      return this._userAttrService.updateStoryPromotion(currentUser.id, remindMe);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }

  @Put('/communityVisit')
  @OpenAPI2({
    description: 'Update user community visit count',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateUserCommunityVisitCount(
    @QueryParam2('communityId') communitId: string
  ): Promise<BaseResponse> {
    try {
      const currentUser = JSON.parse(RequestContext.getContextItem('userIdentity'));
      if (!this._validate.isHex(communitId)) {
        this._result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.invalidIdTitle;

        return this._result.createError([this._result.errorInfo]);
      }

      return this._userAttrService.updateCommunityVisit(currentUser, communitId);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }

  @Put('/communityDetails')
  @OpenAPI2({
    description: 'Update user community details',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateUserCommunityDetails(
    @Body2({ required: true }) communityInfo: CommunityInfoRequest
  ): Promise<BaseResponse> {
    try {
      const currentUser = JSON.parse(RequestContext.getContextItem('userIdentity'));
      if (!this._validate.isHex(communityInfo.communityId)) {
        this._result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.invalidIdTitle;

        return this._result.createError([this._result.errorInfo]);
      }

      return this._userAttrService.updateCommunityInfo(communityInfo, currentUser);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }
}
