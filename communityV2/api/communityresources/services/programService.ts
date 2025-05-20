import { API_RESPONSE, Result } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { AuntBerthaGateway } from '../gateways/auntBerthaGateway';
import {
  ProgramListResponse,
  ProgramResponse,
  TaxonomyResponse
} from '../models/programsModel';
import { BaseResponse } from '../models/resultModel';
import { RequestToken } from '../models/searchTermModel';
import { AccessTokenHelper } from './helpers/accessTokenHelper';
import { ProgramHelperService } from './programHelperService';

@Service()
export class ProgramService {
  constructor(
    private gateway: AuntBerthaGateway,
    @LoggerParam(__filename) private _log: ILogger,
    private result: Result,
    private programHelperService: ProgramHelperService,
    private accessTokenHelper: AccessTokenHelper
  ) {}

  async getServiceTags(): Promise<BaseResponse> {
    try {
      const requestData: RequestToken = {
        username: APP.config.restApi.auntBertha.username,
        password: APP.config.restApi.auntBertha.password,
        api_key: APP.config.restApi.auntBertha.apiKeys[0].apiKey
      };
      const findhelpToken =
        await this.accessTokenHelper.getFindhelpMemberOAuthToken(
          requestData.api_key, requestData
        );
      const resp: TaxonomyResponse = await this.gateway.getServiceTags(
        findhelpToken.data.token
      );
      if (resp) {
        return this.result.createSuccess(resp.nodes);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.noServiceTagTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noServiceTagDetail;
        return this.result.createError([this.result.errorInfo]);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  async getProgramById(
    programId: string,
    brandCd?: string
  ): Promise<BaseResponse> {
    try {
      const requestData: RequestToken = {
        username: APP.config.restApi.auntBertha.username,
        password: APP.config.restApi.auntBertha.password,
        api_key: this.accessTokenHelper.getTokenReqFindHelp(brandCd)
      };
      const findhelpToken =
        await this.accessTokenHelper.getFindhelpMemberOAuthToken(
          requestData.api_key, requestData
        );
      const resp: ProgramResponse = await this.gateway.getProgramById(
        findhelpToken.data.token,
        programId
      );
      const progarmEntityResponse =
        await this.programHelperService.buildProgram(resp);
      if (progarmEntityResponse) {
        return this.result.createSuccess(progarmEntityResponse);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.notFound;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.auntBerthaNoProgramsFound;
        return this.result.createError([this.result.errorInfo]);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  async getProgramsListByZipCode(
    zipCode: number,
    cursor: number,
    limit: number,
    terms: string,
    attributeTag: string,
    atoperand: string,
    serviceTag: string,
    stoperand: string,
    sortBy?: string,
    brandCd?: string
  ): Promise<BaseResponse> {
    try {
      sortBy = sortBy ? sortBy : 'relevance';
      const requestData: RequestToken = {
        username: APP.config.restApi.auntBertha.username,
        password: APP.config.restApi.auntBertha.password,
        api_key: this.accessTokenHelper.getTokenReqFindHelp(brandCd)
      };
      const findhelpToken =
        await this.accessTokenHelper.getFindhelpMemberOAuthToken(
          requestData.api_key, requestData
        );
      const params = [
        { isQueryParam: false, name: 'zipCode', value: zipCode.toString() },
        { isQueryParam: true, name: 'terms', value: terms },
        { isQueryParam: true, name: 'cursor', value: cursor.toString() },
        { isQueryParam: true, name: 'limit', value: limit.toString() },
        { isQueryParam: true, name: 'attributeTag', value: attributeTag },
        { isQueryParam: true, name: 'at_operand', value: atoperand },
        { isQueryParam: true, name: 'serviceTag', value: serviceTag },
        { isQueryParam: true, name: 'st_operand', value: stoperand },
        { isQueryParam: true, name: 'sort_by', value: sortBy },
        { isQueryParam: true, name: 'includeAttributeTags', value: 'true' }
      ];
      if (!brandCd || brandCd === '') {
        brandCd = 'ABCBS';
      }
      const resp: ProgramListResponse =
        await this.gateway.getProgramsListByZipCode(
          findhelpToken.data.token,
          params
        );
      if (resp) {
        if (
          resp.hasOwnProperty('body') &&
          resp['body'].hasOwnProperty('error')
        ) {
          const res = resp['body']['error'];
          this.result.errorInfo.errorCode = res.code;
          this.result.errorInfo.title = res.errors[0].reason;
          this.result.errorInfo.detail = res.errors[0].message;
          return this.result.createError([this.result.errorInfo]);
        }
        if (cursor > resp.count - 1) {
          this.result.errorInfo.title = API_RESPONSE.messages.notFound;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.auntBerthaNoProgramsFound;
          return this.result.createError([this.result.errorInfo]);
        }
        const list = await this.programHelperService.buildProgarmList(resp);
        return this.result.createSuccess(list);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.notFound;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.auntBerthaNoProgramsFound;
        return this.result.createError([this.result.errorInfo]);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
