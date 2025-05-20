import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2, Param2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { CommunityModel } from '../models/communitiesModel';
import { BaseResponse } from '../models/resultModel';
import { CommunityService } from '../services/communityServies';

@JsonController(API_INFO.securePath)
export class CommunitiesController extends BaseController {
  constructor(
    private result: Result,
    private communityService: CommunityService,
    private validate: Validation
  ) {
    super();
  }

  @Put('/createCommunity')
  @OpenAPI2({
    description: 'Create a new Community with Prompts and Libraries',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async createCommunity(
    @Body2() communityModel: CommunityModel
  ): Promise<BaseResponse> {
    try {
      return await this.communityService.createCommunity(communityModel, this.validate.checkUserIdentity());
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities')
  @OpenAPI2({
    description: 'Get all Communities',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllCommunity(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number,
      @QueryParam2('active', { required: false }) active: boolean,
      @QueryParam2('withImage') withImage: boolean
  ): Promise<BaseResponse> {
    try {
      const pageParams = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      withImage = withImage ?? true;
      return await this.communityService.getAllCommunities(pageParams, withImage, active);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/subCommunity/:id')
  @OpenAPI2({
    description: 'Get Cancer Sub community options',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getSubCommunities(
    @Param2('id') id: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.communityService.getSubCommunities(id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/admins')
  @OpenAPI2({
    description: 'Get community specific users',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommunityAdmins(
    @QueryParam2('communityId') communityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.communityService.getCommunityAdmins(communityId);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
