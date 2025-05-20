import { API_RESPONSE, BaseController, BASE_URL_EXTENSION, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityadminapi/common';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Body2, OpenAPI2, Param2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PromptRequest } from '../models/promptModel';
import { BaseResponse } from '../models/resultModel';
import { PromptsService } from '../services/promptsService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PROMPTS)
export class PromptsController extends BaseController {

  constructor(
    private _result: Result,
    private _validate: Validation,
    @LoggerParam(__filename) private _log: ILogger,
    private _promptService: PromptsService
  ) {
    super();
  }

  @Get('/:communityId')
  @OpenAPI2({
    description: 'Get the Admin post based on the Id.',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getPromptsByCommunity(
    @Param2('communityId') communityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this._validate.isHex(communityId)) {
        this._result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this._result.createError([this._result.errorInfo]);
      }
      return this._promptService.getByCommunityId(communityId);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException(error);
    }
  }

  @Post('/')
  @OpenAPI2({
    description: 'Get the Admin post based on the Id.',
    response: { ...DEFAULT_RESPONSES }
  })
  public async updatePrompts(
    @Body2() promptsData: PromptRequest
  ): Promise<BaseResponse> {
    try {
      let validId = true;
      promptsData.prompts.forEach((prompt) => {
        if (!this._validate.isHex(prompt.promptId)) {
          validId = false;
        }
      });
      if (!validId || !this._validate.isHex(promptsData.communityId)) {
        this._result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this._result.createError([this._result.errorInfo]);
      }
      return this._promptService.setPromptData(promptsData);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException(error);
    }
  }
}
