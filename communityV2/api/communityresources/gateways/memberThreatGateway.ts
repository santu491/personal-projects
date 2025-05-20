import { headers } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  IMemberTwoFALoginThreatRequest,
  IMemberTwoFALoginThreatResponse, TreatRequestDetails
} from '../models/memberModel';

@Service()
export class MemberThreatGateway {
  constructor(private _http: RestClient) {}

  memberLoginThreatApi(
    loginTreatRequestParameters: TreatRequestDetails,
    request: IMemberTwoFALoginThreatRequest
  ): Promise<IMemberTwoFALoginThreatResponse> {
    return this._http.invoke<IMemberTwoFALoginThreatResponse>({
      allowExceptions: true,
      allowRawResponse: true,
      url: loginTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...loginTreatRequestParameters.header
      ],
      responseType: ResponseType.JSON,
      requestName: loginTreatRequestParameters.requestName
    });
  }

  memberRecoveryThreatApi(
    recoveryTreatRequestParameters: TreatRequestDetails,
    request: IMemberTwoFALoginThreatRequest
  ): Promise<IMemberTwoFALoginThreatResponse> {
    return this._http.invoke<IMemberTwoFALoginThreatResponse>({
      allowExceptions: true,
      allowRawResponse: true,
      url: recoveryTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...recoveryTreatRequestParameters.header
      ],
      responseType: ResponseType.JSON,
      requestName: recoveryTreatRequestParameters.requestName
    });
  }
}
