import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { OpenAPI2, QueryParam2 } from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { ProgramService } from '../services/programService';

@JsonController(API_INFO.securePath)
export class ProgramController extends BaseController {
  constructor(
    private _svc: ProgramService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/auntBertha/program/getServiceTags')
  @OpenAPI2({
    description: 'Get Service tags',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getServiceTags(): Promise<BaseResponse> {
    return this._svc.getServiceTags();
  }

  @Get('/auntBertha/program/getProgramById')
  @OpenAPI2({
    description: 'Get Program by Id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getProgram(
    @QueryParam2('programId') programId: string,
      @QueryParam2('brandCd') brandCd?: string
  ): Promise<BaseResponse> {
    try {
      if (!programId) {
        this.result.errorInfo.title = API_RESPONSE.messages.noProgramIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noProviderIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this._svc.getProgramById(programId, brandCd);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/auntBertha/program/getProgramsByZipCodeAndTerms')
  @OpenAPI2({
    description:
      'Get information for programs in a given zip code and limit to specific terms, attribute tags or service tags',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getProgramsListByZipCode(
    @QueryParam2('zipCode') zipCode: number,
      @QueryParam2('cursor') cursor: number,
      @QueryParam2('limit') limit: number,
      @QueryParam2('terms') terms: string,
      @QueryParam2('attributeTag') attributeTag: string,
      @QueryParam2('atoperand') atoperand: string,
      @QueryParam2('serviceTag') serviceTag: string,
      @QueryParam2('stoperand') stoperand: string,
      @QueryParam2('sortBy') sortBy?: string,
      @QueryParam2('brandCd') brandCd?: string
  ): Promise<BaseResponse> {
    try {
      const errorsList = [];
      if (!zipCode) {
        errorsList.push(
          this.returnError(
            API_RESPONSE.messages.noZipcodeTitle,
            API_RESPONSE.messages.noZipcodeDetail
          )
        );
      }
      if (!terms && !attributeTag && !serviceTag) {
        errorsList.push(
          this.returnError(
            API_RESPONSE.messages.noTermsOrTagsTitle,
            API_RESPONSE.messages.noTermsOrTagsDetail
          )
        );
      }
      if (
        !(
          stoperand === 'and' ||
          stoperand === 'or' ||
          stoperand === null ||
          stoperand === undefined ||
          atoperand === 'and' ||
          atoperand === 'or' ||
          atoperand === undefined ||
          atoperand === null
        )
      ) {
        errorsList.push(
          this.returnError(
            API_RESPONSE.messages.badData,
            API_RESPONSE.messages.badData
          )
        );
      }
      if (serviceTag === undefined) {
        serviceTag = null;
      }
      if (attributeTag === undefined) {
        attributeTag = null;
      }
      if (atoperand === undefined) {
        atoperand = null;
      }
      if (stoperand === undefined) {
        stoperand = null;
      }
      if (errorsList.length > 0) {
        return this.result.createError(errorsList);
      }
      return this._svc.getProgramsListByZipCode(
        zipCode,
        cursor,
        limit,
        terms,
        attributeTag,
        atoperand,
        serviceTag,
        stoperand,
        sortBy,
        brandCd
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private returnError(title: string, detail: string) {
    this.result.errorInfo.title = title;
    this.result.errorInfo.detail = detail;
    return { ...this.result.errorInfo };
  }
}
