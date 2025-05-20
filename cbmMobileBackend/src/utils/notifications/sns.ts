import {
  CreatePlatformEndpointCommandInput,
  CreatePlatformEndpointCommandOutput,
  DeleteEndpointCommand,
  PublishCommand,
  SNS,
  SNSClient,
} from '@aws-sdk/client-sns';
import {APP} from '../app';

export const addDeviceToken = async (request: {
  platform: string;
  deviceToken: string;
}) => {
  try {
    const awsDetails = APP.config.awsDetails;
    // return 'arn:aws:sns:us-east-1:498126410249:endpoint/APNS/carelon-mobile-ios-dev1/dfaf1927-d324-3163-a500-2ad626e8aae6';
    const snsClient = new SNS({
      apiVersion: awsDetails.apiVersion,
      region: awsDetails.region,
    });
    const params: CreatePlatformEndpointCommandInput = {
      PlatformApplicationArn: awsDetails.iosArn,
      Token: request.deviceToken,
    };
    const resp: CreatePlatformEndpointCommandOutput =
      await snsClient.createPlatformEndpoint(params);
    return resp.EndpointArn;
  } catch (error) {
    console.log(error as Error);
    return null;
  }
};

export const disableDeviceToken = async (endpointArn: string) => {
  try {
    // return true;
    const awsDetails = APP.config.awsDetails;
    const snsClient = new SNSClient({
      apiVersion: awsDetails.apiVersion,
      region: awsDetails.region,
    });
    const input = {
      EndpointArn: endpointArn,
    };
    const command = new DeleteEndpointCommand(input);
    const response = await snsClient.send(command);

    return response;
  } catch (error) {
    console.log(error as Error);
    return null;
  }
};

export const sendPushNotification = async (
  title: string,
  body: string,
  deviceArn: string,
  notificationId: string,
  badge?: number,
) => {
  try {
    const awsDetails = APP.config.awsDetails;
    const apnsMessage = {
      aps: {
        alert: {
          title: title,
          body: body,
        },
        badge: badge ?? 0,
      },
      deepLink: 'notifications',
      title: title,
      body: body,
      notificationId: notificationId,
    };
    const gcmMessage = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        deepLink: 'notifications',
        title: title,
        body: body,
        notificationId: notificationId,
      },
    };
    const messageData = {
      default: title,
      APNS: '',
      GCM: '',
    };
    messageData.APNS = JSON.stringify(apnsMessage);
    messageData.GCM = JSON.stringify(gcmMessage);
    const payload = JSON.stringify(messageData);
    const params = {
      Message: payload,
      TargetArn: deviceArn,
      MessageStructure: 'json',
    };

    /* Send PN to endpoint ARN */
    const snsClient = new SNSClient({region: awsDetails.region});
    const payloadData = new PublishCommand(params);
    const response = await snsClient.send(payloadData);
    return response && response.MessageId ? true : false;
  } catch (error) {
    console.log(error as Error);
    return false;
  }
};
