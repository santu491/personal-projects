import {
  API_RESPONSE, BaseController,
  DEFAULT_RESPONSES, Result, Validation
} from '@anthem/communityadminapi/common';
import { APP, Body2, OpenAPI2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { LoginModel } from '../models/adminUserModel';
import { BaseResponse } from '../models/resultModel';
import { PublicService } from '../services/publicService';

@JsonController(API_INFO.contextPath)
export class PublicController extends BaseController {
  constructor(
    private publicService: PublicService,
    private result: Result,
    private validate: Validation
  ) {
    super();
  }

  @Get('/version')
  @OpenAPI2({
    description: 'Get API version',
    responses: { ...DEFAULT_RESPONSES }
  })
  public version(): string {
    try {
      return `${APP.config.app.apiVersion} ${APP.config.env}`;
    } catch (error) {
      return (error as Error).message;
    }
  }

  @Get('/appMetrics')
  @OpenAPI2({
    description: 'Get the app metrics',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAppMetrics(
    @QueryParam2('market') market: string,
      @QueryParam2('from') fromDate: string,
      @QueryParam2('to') toDate: string
  ): Promise<BaseResponse | string> {
    try {
      if (fromDate && toDate && !(this.validate.isValidDate(fromDate) && this.validate.isValidDate(toDate))) {
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidDate;
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        return this.result.createError([this.result.errorInfo]);
      }
      else {
        const newDate = new Date(toDate);
        newDate.setDate(newDate.getDate() + 1);
        toDate = newDate.toString();
      }

      if (market) {
        const memberMetrics = await this.publicService.getMemberData(market, fromDate, toDate);
        return this.result.createSuccess(memberMetrics);
      }
      const metrics = await this.publicService.getData(fromDate, toDate);
      return this.result.createSuccess(metrics);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/login')
  @OpenAPI2({
    description: 'Admin user login',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async login(
    @Body2() login: LoginModel
  ): Promise<BaseResponse> {
    try {
      if (!login.username || !login.password) {
        this.result.errorInfo.title = API_RESPONSE.messages.enterAdminLoginDetails;
        this.result.errorInfo.detail = API_RESPONSE.messages.enterAdminLoginDetails;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.publicService.login(login);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
