import { API_RESPONSE, BASE_URL_EXTENSION, BaseController, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityadminapi/common';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { OpenAPI2, Param2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { MetricsService } from '../services/metricsService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.METRICS)
export class MetricsController extends BaseController {

  constructor(
    private result: Result,
    private validate: Validation,
    private metricsSvc: MetricsService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/community/:id')
  @OpenAPI2({
    description: 'Get Metrics for a given community id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommunityMetrics(
  @Param2('id') communityId: string
  ) {
    try {
      if (!this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        return this.result.createError([this.result.errorInfo]);
      }

      const adminUser = this.validate.checkUserIdentity();
      return await this.metricsSvc.getCommunityMetrics(communityId, adminUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }
}
