import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { InternalGateway } from '../gateways/internalGateway';
import {
  GetTermsOfUseResponse, InternalAuthResponse,
  IntrospectResponse,
  MemberSummarySoaResponse,
  RevokeResponse
} from '../models/internalRequestModel';

@Service()
export class InternalService {
  constructor(private gateway: InternalGateway,
    @LoggerParam(__filename) private _log: ILogger) { }

  async getTermsOfUse(userNm: string): Promise<GetTermsOfUseResponse> {
    try {
      const resp: GetTermsOfUseResponse = await this.gateway.getTermsOfUse(userNm);
      if (resp) {
        return Promise.resolve(resp);
      } else {
        throw new HttpError(403, 'Issue in getting Terms Of Use');
      }
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Terms Of Use Service failed');
    }
  }

  async updateTermsOfUse(userNm: string) {
    try {
      return await this.gateway.updateAcceptedTOU(userNm);
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Terms Of Use Service - update failed');
    }
  }

  async getAuth(): Promise<InternalAuthResponse> {
    try {
      const resp: InternalAuthResponse = await this.gateway.getAuth();
      if (resp) {
        return Promise.resolve(resp);
      } else {
        throw new HttpError(403, 'Issue in getting Access Token');
      }
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Get Access Token Request failed');
    }
  }

  async getMemberInfo(token: string, usernm: string): Promise<MemberSummarySoaResponse> {
    try {
      const resp: MemberSummarySoaResponse = await this.gateway.getMemberInfo(token, usernm);
      if (resp) {
        return Promise.resolve(resp);
      } else {
        throw new HttpError(403, 'Issue in getting Access Token');
      }
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Get Access Token Request failed');
    }
  }

  async validateAccessToken(token: string): Promise<IntrospectResponse> {
    try {
      const resp = await this.gateway.validateAccessToken(token);
      if (resp) {
        return Promise.resolve(resp);
      } else {
        throw new HttpError(403, 'Issue in validating Access Token');
      }
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Validate Access Token Request failed');
    }
  }

  async revokeAccessToken(token: string): Promise<RevokeResponse> {
    try {
      const resObject = new RevokeResponse();
      const resp = await this.gateway.revokeAccessToken(token);
      if (resp) {
        resObject.revoke = true;
        return Promise.resolve(resObject);
      } else {
        throw new HttpError(403, 'Issue in Revoking Access Token');
      }
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Revoke Access Token Request failed');
    }
  }
}
