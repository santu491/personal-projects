import * as SQS from '@aws-sdk/client-sqs';
import {Messages} from '../../constants';
import {ManualPN} from '../../models/Notification';
import {MessageSQS} from '../../types/notificationRequest';
import {APP} from '../app';
import {randomString} from '../common';
import logger from '../logger';

export const addToNotificationQueue = async (
  notificationData: MessageSQS | ManualPN,
  queueArn: string,
  messageGroupId: string,
) => {
  try {
    const sqsClient = new SQS.SQSClient({
      apiVersion: APP.config.awsDetails.apiVersion,
      region: APP.config.awsDetails.region,
    });

    const sqsQueueData: SQS.SendMessageRequest = {
      MessageBody: JSON.stringify(notificationData),
      QueueUrl: queueArn,
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: randomString(5),
    };
    const sendCommand = new SQS.SendMessageCommand(sqsQueueData);

    const response = await sqsClient.send(sendCommand);
    return response;
  } catch (error) {
    logger().error(Messages.createError, error);
    return null;
  }
};
