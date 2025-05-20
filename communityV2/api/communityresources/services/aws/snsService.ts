import { SNSEnum } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { CreatePlatformEndpointCommand, SNSClient } from '@aws-sdk/client-sns';
import { InstallationRequest } from 'api/communityresources/models/internalRequestModel';
import { Service } from 'typedi';

@Service()
export class SnsService {
  constructor(@LoggerParam(__filename) private _log: ILogger) { }

  public async addEndpoint(request: InstallationRequest): Promise<string> {
    try {
      const client = new SNSClient(
        {
          apiVersion: APP.config.aws.apiVersion,
          region: APP.config.aws.region1
        }
      );
      const params = {
        PlatformApplicationArn:
          request.platform === SNSEnum.IOS
            ? APP.config.aws.iosArn
            : APP.config.aws.androidArn,
        Token: request.deviceToken
      };
      const command = new CreatePlatformEndpointCommand(params);
      const resp = await client.send(command);
      this._log.info('logs: checking for response on sit endpoint:', resp);

      return resp.EndpointArn;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
