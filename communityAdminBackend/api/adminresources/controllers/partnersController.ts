import { API_RESPONSE, BASE_URL_EXTENSION, BaseController, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2, Param2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PartnerRequest } from '../models/partnersModel';
import { PartnersService } from '../services/partnersService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PARTNERS)
export class PartnersController extends BaseController {

  constructor(
    private result: Result,
    private validate: Validation,
    private service: PartnersService
  ) {
    super();
  }

  @Post('/')
  @OpenAPI2({
    description: 'Add Partner Data',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addPartners(
  @Body2() payload: PartnerRequest
  ) {
    try {
      if (this.validate.isNullOrWhiteSpace(payload.title) || this.validate.isNullOrWhiteSpace(payload.logoImage)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.incorrectModel;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.service.createPartner(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/')
  @OpenAPI2({
    description: 'Get all Partners',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPartners(
  @QueryParam2('active') active: boolean
  ) {
    try {
      return this.service.getPartners(active ?? false);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/:id')
  @OpenAPI2({
    description: 'Get a specific partner',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPartnerById(
  @Param2('id') id: string
  ) {
    try {
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdTitle;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.service.getPartnerById(id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/:id')
  @OpenAPI2({
    description: 'Update Partner based on ids',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updatePartner(
  @Param2('id') id: string,
    @Body2() payload: PartnerRequest
  ) {
    try {
      if (this.validate.isNullOrWhiteSpace(payload.title) || this.validate.isNullOrWhiteSpace(payload.logoImage)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.incorrectModel;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.service.updatePartner(id, payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
