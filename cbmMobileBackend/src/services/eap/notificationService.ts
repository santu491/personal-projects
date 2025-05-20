import {StatusCodes} from 'http-status-codes';
import {DB_TABLE_NAMES, DynamoDbConstants, Messages} from '../../constants';
import {DynamoDBGateway} from '../../gateway/dynamoDBGateway';
import {EAPMemberProfileGateway} from '../../gateway/eapMemberProfileGateway';
import {NotificationActionReq} from '../../models/Notification';
import {User} from '../../models/Users';
import {MemberOAuthPayload} from '../../types/customRequest';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {AuditHelper} from '../helpers/auditHelper';

export class NotificationService {
  result = new ResponseUtil();
  dynamoDBGateway = new DynamoDBGateway();
  memberGateway = new EAPMemberProfileGateway();
  private Logger = logger();
  private className = this.constructor.name;
  auditHelper = new AuditHelper();

  /**
   * Handle the notification action.
   * @param userInfo  User
   * @param notificationReq Notification action details
   */
  public async notificationActions(
    userInfo: MemberOAuthPayload,
    notificationReq: NotificationActionReq,
  ) {
    try {
      const fetchQuery = {
        [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
        [DynamoDbConstants.KEY]: {
          iamguid: userInfo.iamguid,
          clientName: userInfo.clientName,
        },
      };
      const response = await this.dynamoDBGateway.getRecords(fetchQuery);
      if (!response?.data?.isSuccess) {
        return this.result.createException(
          Messages.userNotFound,
          StatusCodes.BAD_REQUEST,
        );
      }
      const user: User = response.data.value as User;
      if (!user.notifications || user.notifications.length === 0) {
        return this.result.createException(
          Messages.noNotificationNotFound,
          StatusCodes.BAD_REQUEST,
        );
      }

      if (notificationReq.isClearAll) {
        user.notifications = [];
      } else if (notificationReq.isRemove && notificationReq.notificationId) {
        const index = user.notifications?.findIndex(
          notification =>
            notification.notificationId === notificationReq.notificationId,
        );
        if (index !== -1) {
          user.notifications?.splice(index, 1);
        } else {
          return this.result.createException(
            Messages.notificationNotFound,
            StatusCodes.BAD_REQUEST,
          );
        }
      } else if (notificationReq.notificationId && !notificationReq.isRemove) {
        const index = user.notifications?.findIndex(
          notification =>
            notification.notificationId === notificationReq.notificationId,
        );
        const notificationData = user.notifications[index];
        notificationData.viewedTS = new Date().toISOString();
        user.notifications?.splice(index, 1);
        user.notifications.push(notificationData);
      } else {
        return this.result.createException(
          Messages.badRequest,
          StatusCodes.BAD_REQUEST,
        );
      }

      const updateQuery = {
        [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
        [DynamoDbConstants.KEY]: {
          iamguid: userInfo.iamguid,
          clientName: userInfo.clientName,
        },
        [DynamoDbConstants.UPDATE_EXPRESSION]: `${DynamoDbConstants.SET} notifications = :notifications`,
        [DynamoDbConstants.EXPRESSION_ATTRIBUTE_VALUES]: {
          ':notifications': user.notifications,
        },
      };
      const results = await this.dynamoDBGateway.updateRecord(updateQuery);
      if (!results?.data?.isSuccess) {
        return this.result.createException(Messages.somethingWentWrong);
      }

      return this.result.createSuccess({
        unreadCount: user.notifications.filter(pn => !pn.viewedTS).length, // count of unread notifications
      });
    } catch (error: any) {
      this.Logger.error(`${this.className} - notificationActions :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.notificationActionError,
      );
    }
  }

  async getAllNotifications(
    memberOAuth: MemberOAuthPayload,
    size: number,
    from: number,
  ) {
    try {
      const userData = await this.memberGateway.getMemberDbData(
        memberOAuth.iamguid ?? '',
        memberOAuth.clientName ?? '',
      );

      if (!userData) {
        return this.result.createException(
          Messages.userNotFound,
          StatusCodes.BAD_REQUEST,
        );
      }

      let notificationResponse: {count: number; notifications: any[]} = {
        count: 0,
        notifications: [],
      };

      if (userData?.notifications && userData.notifications.length > 0) {
        // sort notification
        userData.notifications.sort(this.sortByCreated);

        // Query notifications from DB
        const notificationIds = userData.notifications
          .slice(from, from + size)
          .map(({notificationId}: {notificationId: string}) => ({
            notificationId,
          }));

        const notifications = await this.dynamoDBGateway.getMultipleRecords({
          RequestItems: {
            [DB_TABLE_NAMES.NOTIFICATIONS]: {
              Keys: notificationIds,
            },
          },
        });

        if (notifications?.data?.isSuccess) {
          notificationResponse = this.formatNotificationResponse(
            notifications,
            userData,
          );
        }
      }

      return this.result.createSuccess(notificationResponse);
    } catch (error: any) {
      this.Logger.error(
        `NotificationService - getAllNotifications - error: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.somethingWentWrong,
      );
    }
  }

  private formatNotificationResponse(notifications: any, userData: any) {
    const notificationResponse: {count: number; notifications: any[]} = {
      count: 0,
      notifications: [],
    };

    notifications =
      notifications?.data?.value[DB_TABLE_NAMES.NOTIFICATIONS] || [];
    const unreadNotifications = userData.notifications.filter(
      (notification: any) => !notification?.viewedTS,
    );
    notificationResponse.count = unreadNotifications.length;

    // Loop through user notifications and update the notification data with viewed value
    notifications.forEach((notification: any) => {
      const index = userData.notifications.findIndex(
        (n: {notificationId: string}) =>
          n.notificationId === notification.notificationId,
      );
      if (index !== -1) {
        notificationResponse.notifications.push({
          ...notification,
          ...userData.notifications[index],
        });
      }
    });

    notificationResponse.notifications.sort(this.sortByCreated);
    return notificationResponse;
  }

  private sortByCreated = (a: {createdTS: string}, b: {createdTS: string}) =>
    new Date(b.createdTS).getTime() - new Date(a.createdTS).getTime();
}
