import { Result } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, StringUtils } from '@anthem/communityapi/utils';
import { SQSClient, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { BaseResponse } from 'api/communityresources/models/resultModel';
import { Service } from 'typedi';

@Service()
export class SqsService {
  constructor(@LoggerParam(__filename) private _log: ILogger,
    private result: Result) { }

  public async addToNotificationQueue(notificationData, queueArn: string, messageGroupId: string): Promise<BaseResponse> {
    try {
      const client = new SQSClient(
        {
          apiVersion: APP.config.aws.apiVersion,
          region: APP.config.aws.region2
        }
      );
      const sqsQueueData: SendMessageCommandInput = {
        MessageBody: JSON.stringify(notificationData),
        QueueUrl: queueArn,
        MessageGroupId: messageGroupId,
        MessageDeduplicationId: StringUtils.randomString(5)
      };
      const command = new SendMessageCommand(sqsQueueData);
      const response: SendMessageCommandOutput = await client.send(command);

      return this.result.createSuccess(response.MessageId);
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
