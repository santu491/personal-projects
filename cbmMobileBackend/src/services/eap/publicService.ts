import {StatusCodes} from 'http-status-codes';
import {
  AllowedClients,
  APIResponseCodes,
  Messages,
  ServiceConstants,
  SQSParams,
} from '../../constants';
import {ManualPN} from '../../models/Notification';
import {PublicAuth} from '../../types/publicRequest';
import {APP} from '../../utils/app';
import {generateToken} from '../../utils/auth';
import {getAppConfig} from '../../utils/common';
import logger from '../../utils/logger';
import {addToNotificationQueue} from '../../utils/notifications/sqs';
import {ResponseUtil} from '../../utils/responseUtil';

export class PublicService {
  private result = new ResponseUtil();
  private Logger = logger();
  private className = this.constructor.name;

  public async publicAuth(payload: PublicAuth) {
    try {
      if (!AllowedClients.includes(payload.clientId)) {
        return this.result.createException(
          Messages.invalidClientId,
          APIResponseCodes.BAD_REQUEST,
        );
      }
      const expiresIn = ServiceConstants.JWT_EXPIRY_15M;
      const createdAt = new Date();
      const expiresAt = new Date(new Date().getTime() + expiresIn * 60 * 1000);
      const token = generateToken(
        {
          clientId: payload.clientId,
          installationId: payload?.installationId,
          sessionId: payload?.sessionId,
        },
        `${expiresIn}m`,
      );
      return this.result.createSuccess({
        token: token,
        message: Messages.clientAuthSuccess,
        createdAt,
        expiresAt,
        expiresIn,
      });
    } catch (error) {
      this.Logger.error(`${this.className} - publicAuth :: ${error}`);
      return this.result.createException(Messages.somethingWentWrong);
    }
  }

  public async notify(payload: ManualPN) {
    await addToNotificationQueue(
      payload,
      APP.config.awsDetails.notificationQueue,
      SQSParams.NOTIFICATION_MESSAGE_GROUP_ALL,
    );
  }

  public async forceAppUpdate(version: string, platform: 'ios' | 'android') {
    try {
      if (!version) {
        return this.result.createException(
          Messages.invalidRequest,
          APIResponseCodes.BAD_REQUEST,
        );
      }

      const appConfig = await getAppConfig();

      if (!appConfig.appInit[platform]) {
        return this.result.createException(
          Messages.platformError,
          APIResponseCodes.BAD_REQUEST,
        );
      }

      return this.result.createSuccess({
        isForceUpdate: appConfig.appInit[platform].version > version,
        platform: appConfig.appInit[platform].appUrl,
      });
    } catch (error) {
      this.Logger.error(`${this.className} - forceAppUpdate :: ${error}`);
      return this.result.createException(
        error,
        StatusCodes.INTERNAL_SERVER_ERROR,
        Messages.somethingWentWrong,
      );
    }
  }
}
