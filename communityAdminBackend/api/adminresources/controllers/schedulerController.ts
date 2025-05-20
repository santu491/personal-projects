import {
  BaseController,
  DEFAULT_RESPONSES,
  Result
} from '@anthem/communityadminapi/common';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Body2, OpenAPI2 } from '@anthem/communityadminapi/utils';
import { JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { SchedulerPayload } from '../models/schedulerModel';
import { SchedulerService } from '../services/schedulerService';

@JsonController(API_INFO.schedulerPath)
export class SchedulerController extends BaseController {
  constructor(
    private result: Result,
    private schedulerService: SchedulerService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  // Admin custom PNs
  @Post('/pushNotification')
  @OpenAPI2({
    description: 'Handle the scheduled PN from the Admin.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async scheduledPushNotification(@Body2() payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const data = await this.schedulerService.handlePushNotification(payload);
      return this.result.createSuccess(data);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  // Maternity due date based PNs
  @Post('/communityPN')
  @OpenAPI2({
    description: 'Handle the weekly PN for the maternity community.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async scheduleWeeklyPN(@Body2() payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const data = await this.schedulerService.handleWeeklyPushNotification(payload);
      return this.result.createSuccess(data);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  // Scheduled Post PN
  @Post('/postScheduler')
  @OpenAPI2({
    description: 'Handle the scheduled Post job',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async schedulePost(@Body2() payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const data = await this.schedulerService.handleScheduledPost(payload);
      return this.result.createSuccess(data);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  // Post's Poll closed
  @Post('/postPollCloser')
  @OpenAPI2({
    description: 'Handle the scheduled Post Poll Closing job',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async schedulePostPollClosed(@Body2() payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const data = await this.schedulerService.handlePostPollClosed(payload);
      return this.result.createSuccess(data);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  // Post's Poll Closing Soon
  @Post('/postPollReminder')
  @OpenAPI2({
    description: 'Handle the scheduled Post Poll Closing job',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async schedulePostPollClosingSoon(@Body2() payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const data = await this.schedulerService.handlePostPollClosingSoon(payload);
      return this.result.createSuccess(data);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

}
