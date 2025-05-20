import {
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2,
  RequestContext
} from '@anthem/communityapi/utils';
import {
  JsonController,
  Put
} from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PollResponseRequest } from '../models/pollModel';
import { BaseResponse } from '../models/resultModel';
import { PollService } from '../services/pollService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.POLL)
export class PollController extends BaseController {
  constructor(
    private pollService: PollService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Put('/')
  @OpenAPI2({
    description: 'Add user response over the post poll',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async userPollResponse(
    @Body2() pollReponse: PollResponseRequest
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      return await this.pollService.userPollResponse(pollReponse, currentUser);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

}
