import { API_RESPONSE, BaseController, DEFAULT_RESPONSES, Result, Validation } from '@anthem/communityadminapi/common';
import { OpenAPI2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { SearchTermService } from '../services/searchTermService';

@JsonController(API_INFO.securePath)
export class SearchTermController extends BaseController {
  constructor(
    private searchTermService: SearchTermService,
    private result: Result,
    private validate: Validation
  ) {
    super();
  }

  @Put('/addSearchTerms')
  @OpenAPI2({
    description: 'Add a new Search Term to the Database.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addSearchTerm(
    @QueryParam2('searchterm') searchterm: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      return await this.searchTermService.addSearchTerm(searchterm);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
