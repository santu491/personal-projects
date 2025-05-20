
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { HealthwiseGateway } from '../gateways/healthwiseGateway';
import { HealthwiseAuthResponse } from '../models/healthWiseModel';

@Service()
export class HealthwiseTokenService {
  constructor(private gateway: HealthwiseGateway,
    @LoggerParam(__filename) private _log: ILogger) {}

  async postAuth(): Promise<HealthwiseAuthResponse> {
    try {
      const resp: HealthwiseAuthResponse = await this.gateway.postAuth();

      if (resp) {
        return Promise.resolve(resp);
      } else {
        throw new HttpError(403, 'Missing Token');
      }
    } catch (error) {
      this._log.error(error as Error);
      throw new HttpError(500, 'Healthwise Bertha Authorization Service failed');
    }
  }
}
