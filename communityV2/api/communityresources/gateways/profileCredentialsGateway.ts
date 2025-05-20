import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  IProfileCredentials
} from '../models/memberModel';

@Service()
export class ProfileCredentialsGateway {
  constructor(private _http: RestClient) {}
  commercialProfileCredentialUpdateApi(
    token: string,
    request: IProfileCredentials
  ): Promise<IProfileCredentials> {
    return this._http.invoke<IProfileCredentials>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialCredentialUpdate,
      method: HttpMethod.Put,
      data: request,
      urlParams: [
        {
          isQueryParam: true,
          name: headers.USER_NAME,
          value: request.currentUsernm
        },
        {
          isQueryParam: false,
          name: headers.MEMBERID,
          value: request.memberId
        }
      ],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.MBRUID,
          value: request.memberId
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.UPDATE_PROFILE_PASSWORD
    });
  }
}
