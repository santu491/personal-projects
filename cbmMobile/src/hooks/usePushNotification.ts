import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { PermissionsAndroid } from 'react-native';
import PushNotification, { ReceivedNotification } from 'react-native-push-notification';

import {
  Installations,
  NotificationInstallationResponseDTO,
  NotificationResponseDTO,
  NotificationsResponseDTO,
} from '../../sdks/notifications/src/model/notification';
import { AppUrl } from '../../shared/src/models';
import { ReadNotificationDataDTO } from '../../shared/src/models/src/features/notification';
import { APP_CONTENT } from '../config';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { useAppContext } from '../context/appContext';
import { RequestMethod } from '../models/adapters';
import { NotificationPayloadType } from '../models/common';
import { isAndroid, isIOS } from '../util/commonUtils';
import { deviceDetails } from '../util/deviceDetails';
import { setNotificationPermissionAlertGranted } from '../util/pushNotificationStorage';

interface PushNotificationHookProps {
  getPNInstallationStatus?: (apiName: string) => void;
  onPermissionsGrantedUpdate?: (token: boolean) => void;
}

export const usePushNotification = ({
  onPermissionsGrantedUpdate,
  getPNInstallationStatus,
}: PushNotificationHookProps) => {
  const appContext = useAppContext();
  const enablePushNotifications = () => {
    if (!isAndroid()) {
      onPermissionsGrantedUpdate?.(false);
      setNotificationPermissionAlertGranted(true);
    }
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        if (token.token) {
          setNotificationPermissionAlertGranted(true);
          appContext.setDeviceToken(token.token);
          pushNotificationInstallationAPI(token.token);
          onPermissionsGrantedUpdate?.(true);
        }
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // // process the notification
        onNotificationCalled(notification);

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const configurePushNotificationsAfterReLogin = async (name: string) => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        if (token.token) {
          name === Installations.SAVE_INSTALLATION
            ? pushNotificationInstallationAPI(token.token)
            : callDeleteInstallationAPI(token.token);
        }
      },
    });
  };

  const getRNPermissions = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions.alert ?? false);
      });
    });
  };

  const requestNotificationPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setNotificationPermissionAlertGranted(true);
        enablePushNotifications();
        onPermissionsGrantedUpdate?.(true);
      } else {
        onPermissionsGrantedUpdate?.(false);
        setNotificationPermissionAlertGranted(true);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const pushNotificationInstallationAPI = async (pushNotificationToken: string) => {
    try {
      const payload = {
        deviceToken: pushNotificationToken,
        platform: deviceDetails().metaDevice.platform,
        appVersion: deviceDetails().metaDevice.appVersion,
        osVersion: deviceDetails().metaDevice.osVersion,
        locale: deviceDetails().metaDevice.locale,
        timeZoneOffset: -330,
        badge: 0,
      };
      const response: NotificationInstallationResponseDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.NOTIFICATION_INSTALLATION,
        RequestMethod.POST,
        payload
      );

      if (response.data && getPNInstallationStatus) {
        getPNInstallationStatus(Installations.SAVE_INSTALLATION);
      }
    } catch (error) {
      console.warn((error as Error).message);
    }
  };

  const callDeleteInstallationAPI = async (pushNotificationToken: string) => {
    try {
      const payload = {
        deviceToken: pushNotificationToken,
      };
      const response: NotificationInstallationResponseDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.NOTIFICATION_INSTALLATION_DELETE,
        RequestMethod.POST,
        payload
      );

      if (response.data && getPNInstallationStatus) {
        getPNInstallationStatus(Installations.DELETE_INSTALLATION);
      }
    } catch (error) {
      console.warn((error as Error).message);
    }
  };

  const configurePushNotificationsBadgeCount = async () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)

      onRegister: function (token) {
        if (token.token) {
          appContext.setDeviceToken(token.token);
        }
      },

      onNotification: function (notification) {
        // process the notification
        onNotificationCalled(notification);
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const onNotificationCalled = (notification: Omit<ReceivedNotification, 'userInfo'>) => {
    const userInteraction = notification.userInteraction;
    if (userInteraction) {
      appContext.setPushNotificationPayload(notification);
    }
    handlePostLoginNotification(notification);
  };

  const readNotification = (notificationId: string) => {
    const request = { isRemove: false, notificationId };
    appContext.serviceProvider
      .callService<ReadNotificationDataDTO>(API_ENDPOINTS.NOTIFICATION, RequestMethod.PUT, request, {})
      .then((response: ReadNotificationDataDTO) => {
        appContext.setNotificationCount(response.data.unreadCount);
        updateIOSBadgeCount(response.data.unreadCount);
      });
  };

  const handlePostLoginNotification = (payload: Omit<ReceivedNotification, 'userInfo'>) => {
    const notificationData = payload.data;

    switch (notificationData.deepLinkType.toLowerCase()) {
      case NotificationPayloadType.CREDIBLEMIND:
        readNotification(notificationData.notificationId);
        appContext.navigationHandler.linkTo({
          action: AppUrl.CREDIBLEMIND_WELLBEING,
          params: { url: notificationData.deepLink },
        });
        break;
      case NotificationPayloadType.APPOINTMENTS:
        appContext.navigationHandler.linkTo({
          action: AppUrl.APPOINTMENTS_HISTORY,
        });
        break;
      default:
        appContext.navigationHandler.linkTo({
          action: AppUrl.NOTIFICATIONS,
        });
        break;
    }
  };

  const resetBadgeCount = async (notificationCount?: number) => {
    try {
      updateIOSBadgeCount(notificationCount ?? 0);
      const payload = {
        deviceToken: appContext.deviceToken,
        count: notificationCount,
      };
      await appContext.serviceProvider.callService(API_ENDPOINTS.PN_RESET_BADGE_COUNT, RequestMethod.PUT, payload);
    } catch (error) {
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  };

  const updateIOSBadgeCount = (badgeCount: number) => {
    if (isIOS()) {
      PushNotification.setApplicationIconBadgeNumber(badgeCount);
    }
  };

  const getNotifications = async () => {
    try {
      const response: NotificationResponseDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.NOTIFICATION,
        RequestMethod.GET,
        null
      );
      const notificationData = response.data as NotificationsResponseDTO;
      appContext.setNotificationCount(notificationData.count);
      if (isIOS()) {
        PushNotification.setApplicationIconBadgeNumber(notificationData.count);
      }
    } catch (error) {
      console.warn('Error fetching notifications', error);
    }
  };

  const clearPushNotificationPayload = () => {
    if (appContext.pushNotificationPayload) {
      appContext.setPushNotificationPayload(undefined);
    }
  };

  return {
    enablePushNotifications,
    getRNPermissions,
    requestNotificationPermissionAndroid,
    configurePushNotificationsAfterReLogin,
    configurePushNotificationsBadgeCount,
    resetBadgeCount,
    updateIOSBadgeCount,
    getNotifications,
    onNotificationCalled,
    handlePostLoginNotification,
    clearPushNotificationPayload,
  };
};
