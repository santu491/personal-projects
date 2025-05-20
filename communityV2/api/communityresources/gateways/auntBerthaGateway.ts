import { HttpMethod, IUrlParam } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  ProgramListResponse,
  ProgramResponse,
  TaxonomyResponse
} from '../models/programsModel';
import { AuntberthaAuthResponse, RequestToken } from '../models/searchTermModel';

@Service()
export class AuntBerthaGateway {
  constructor(private _http: RestClient) { }

  getToken(request: RequestToken): Promise<AuntberthaAuthResponse> {
    return this._http.invoke({
      url: APP.config.restApi.auntBertha.accesstoken,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: 'Accept',
          value: 'application/json'
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'auntBerthaToken'
    });
  }

  getServiceTags(token: string): Promise<TaxonomyResponse> {
    return this._http.invoke({
      url: APP.config.restApi.auntBertha.serviceTags,
      method: HttpMethod.Get,
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'auntBerthaServiceTags'
    });
  }

  getProgramById(token: string, programId: string): Promise<ProgramResponse> {
    return this._http.invoke({
      url: APP.config.restApi.auntBertha.getProgramById,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: false,
          name: 'programId',
          value: programId
        }
      ],
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'auntBerthaProgramID'
    });
  }

  getProgramsListByZipCode(token: string, params: IUrlParam[]): Promise<ProgramListResponse> {
    return this._http.invoke({
      url: APP.config.restApi.auntBertha.getProgramListByZipCode,
      method: HttpMethod.Get,
      urlParams: params,
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'auntBerthaProgramListByZipcodeRequest',
      allowExceptions: true
    });
  }
}
