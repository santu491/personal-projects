import { BaseController, DEFAULT_RESPONSES } from '@anthem/communityapi/common';
import { Body2, OpenAPI2 } from '@anthem/communityapi/utils';
import { JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { TermsOfUseRequest } from '../models/internalRequestModel';
import { InternalService } from '../services/internalService';

@JsonController(API_INFO.securePath)
export class InternalController extends BaseController {
  constructor(private _svc: InternalService) {
    super();
  }

  @Put('/termsofuse')
  @OpenAPI2({
    description: 'Update Terms of Use Details for given member',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateTermsOfUse(@Body2() request: TermsOfUseRequest){
    return this._svc.updateTermsOfUse(request.userNm);
  }
}
