import { Result } from '@anthem/communityadminapi/common';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, StringUtils } from '@anthem/communityadminapi/utils';
import {
  EmailNotification,
  NotificationQueue,
  NotificationQueueData,
  PollClosingPN,
  ScheduledPNData
} from 'api/adminresources/models/pushNotificationModel';
import { BaseResponse } from 'api/adminresources/models/resultModel';
import { DeleteUserRequest } from 'api/adminresources/models/userModel';
import * as SQS from 'aws-sdk/clients/sqs';
import { Service } from 'typedi';

@Service()
export class SqsService {
  constructor(
    @LoggerParam(__filename) private _log: ILogger,
    private result: Result
  ) {}

  public async addToNotificationQueue(
    notificationData:
    | NotificationQueue
    | NotificationQueueData
    | EmailNotification
    | ScheduledPNData
    | PollClosingPN
    | ScheduledPNData
    | DeleteUserRequest,
    queueArn: string,
    messageGroupId: string
  ): Promise<BaseResponse> {
    try {
      const sqsClient = new SQS({
        apiVersion: APP.config.aws.apiVersion,
        region: APP.config.aws.region2
      });

      const sqsQueueData: SQS.Types.SendMessageRequest = {
        MessageBody: JSON.stringify(notificationData),
        QueueUrl: queueArn,
        MessageGroupId: messageGroupId,
        MessageDeduplicationId: StringUtils.randomString(5)
      };

      const response = await sqsClient.sendMessage(sqsQueueData).promise();
      return this.result.createSuccess(response.MessageId);
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
