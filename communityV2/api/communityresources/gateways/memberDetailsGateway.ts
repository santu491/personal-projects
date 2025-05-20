import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  IGbdSummaryRequest,
  IGbdSummaryResponse, IMemberInformation, IMemberTwoFAParameters
} from '../models/memberModel';

@Service()
export class MemberDetailsGateway {
  constructor(private _http: RestClient) {}

  gbdMemberSummary(
    token: string,
    request: IGbdSummaryRequest
  ): Promise<IGbdSummaryResponse> {
    return this._http.invoke<IGbdSummaryResponse>({
      allowExceptions: true,
      url: APP.config.restApi.psgbdTenant.gbdSummary,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GBD_SUMMARY
    });
  }

  memberInformationApi(
    token: string,
    request: IMemberTwoFAParameters
  ): Promise<IMemberInformation> {
    return this._http.invoke<IMemberInformation>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberEligibilityInfo,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_INFO_VALIDATE
    });
  }
}
