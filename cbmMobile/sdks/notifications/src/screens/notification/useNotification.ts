import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PushNotification from 'react-native-push-notification';

import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { RequestMethod } from '../../../../../src/models/adapters';
import { isIOS } from '../../../../../src/util/commonUtils';
import { PAGE_SIZE } from '../../config/constants/notification';
import { useNotificationContext } from '../../context/notifications.sdkContext';
import {
  Notification,
  NotificationButtonType,
  NotificationDTO,
  NotificationResponseDTO,
  NotificationsResponseDTO,
  NotificationType,
  ReadNotificationResponseDTO,
} from '../../model/notification';
import { Screen } from '../../navigation/notification.navigationTypes';

export const useNotification = () => {
  const { t } = useTranslation();
  const context = useNotificationContext();
  const appContext = useAppContext();
  const [notifications, setNotifications] = useState<Notification[] | undefined>();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { navigation } = context;
  const { resetBadgeCount, updateIOSBadgeCount } = usePushNotification({});

  const handleClearAllAction = async () => {
    try {
      setLoading(true);
      const request = { isClearAll: true, notificationId: '', isRemove: false };
      await context.serviceProvider.callService(API_ENDPOINTS.NOTIFICATION, RequestMethod.PUT, request, {});
      appContext.setNotificationCount(0);
      resetBadgeCount(0);
      if (isIOS()) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
      setNotifications(undefined);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.warn('Error clearing notifications', error);
    }
  };
  const onReadAction = async (id: string) => {
    const request = { isRemove: false, notificationId: id };
    const response: ReadNotificationResponseDTO = await context.serviceProvider.callService(
      API_ENDPOINTS.NOTIFICATION,
      RequestMethod.PUT,
      request,
      {}
    );
    setNotifications((prevNotifications) =>
      prevNotifications?.map((notification) =>
        notification.id === id ? { ...notification, viewDate: new Date().toDateString() } : notification
      )
    );
    appContext.setNotificationCount(response.data.unreadCount);
    updateIOSBadgeCount(response.data.unreadCount);
    resetBadgeCount(response.data.unreadCount);
  };

  const onNotificationClick = async (notification: Notification) => {
    await onReadAction(notification.id);
    const url = notification.url;
    navigation.navigate(Screen.NOTIFICATION_DETAILS, { url });
  };

  const onPressBackButton = () => {
    if (appContext.pushNotificationPayload) {
      appContext.navigationHandler.linkTo({ action: AppUrl.HOME });
      appContext.setPushNotificationPayload(undefined);
    } else {
      navigation.goBack();
    }
  };

  const getNotificationTypeButtonName = (type: NotificationButtonType) => {
    switch (type) {
      case NotificationButtonType.LISTEN:
        return t('notifications.listen');
      case NotificationButtonType.WTACH:
        return t('notifications.watch');
      case NotificationButtonType.READ:
      default:
        return t('notifications.read');
    }
  };

  const getNotificationType = (type: string) => {
    switch (type) {
      case NotificationType.PODCAST:
        return NotificationButtonType.LISTEN;
      case NotificationType.VIDEO:
        return NotificationButtonType.WTACH;
      case NotificationType.INSIGHTS:
      default:
        return NotificationButtonType.READ;
    }
  };

  const transformNotifications = useCallback((data: NotificationDTO[]) => {
    const notificationData = data.map((notification: NotificationDTO) => ({
      id: notification.notificationId,
      url: notification.deeplink,
      title: notification.title,
      description: notification.body,
      createdDate: notification.createdTS,
      viewDate: notification.viewedTS,
      type: getNotificationType(notification.type),
      topic: notification.primaryTopic,
    }));
    setNotifications((prevNotifications) =>
      prevNotifications ? [...prevNotifications, ...notificationData] : notificationData
    );
  }, []);

  const getNotifications = useCallback(
    async (isLoading = true) => {
      try {
        setLoading(isLoading);
        const response: NotificationResponseDTO = await context.serviceProvider.callService(
          `${API_ENDPOINTS.NOTIFICATION}?size=${PAGE_SIZE}&from=${page}`,
          RequestMethod.GET,
          null
        );
        const notificationData = response.data as NotificationsResponseDTO;
        appContext.setNotificationCount(notificationData.count);
        if (isIOS()) {
          PushNotification.setApplicationIconBadgeNumber(notificationData.count);
        }
        resetBadgeCount(notificationData.count);
        transformNotifications(notificationData.notifications);
        setLoading(false);
        setPage((count) => count + PAGE_SIZE);
      } catch (error) {
        setLoading(false);
        console.warn('Error fetching notifications', error);
      }
    },
    [context.serviceProvider, page, appContext, transformNotifications, resetBadgeCount]
  );

  const onMomentumScrollEnd = async () => {
    if (page !== 0 && page === notifications?.length) {
      await getNotifications(false);
    }
  };

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notifications,
    handleClearAllAction,
    onReadAction,
    onNotificationClick,
    loading,
    context,
    getNotificationTypeButtonName,
    onPressBackButton,
    t,
    page,
    onMomentumScrollEnd,
    getNotificationType,
  };
};
