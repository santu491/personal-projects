import { PN_PERMISSION_GRANTED_KEY } from '../../sdks/notifications/src/config/constants/notification';
import { storage, StorageNamespace } from './storage';

export const setNotificationPermissionAlertGranted = async (permissionStatus: boolean) => {
  try {
    const pushNotificationPermissionStorage = storage(StorageNamespace.NotificationsSDK);
    await pushNotificationPermissionStorage.setBool(PN_PERMISSION_GRANTED_KEY, permissionStatus);
  } catch (e) {
    // saving error
    throw new Error('Push notification permission details not found');
  }
};

export const isNotificationPermissionAlertGranted = async () => {
  try {
    const pushNotificationPermissionStorage = storage(StorageNamespace.NotificationsSDK);
    const value = await pushNotificationPermissionStorage.getBool(PN_PERMISSION_GRANTED_KEY);
    return value ?? false;
  } catch (e) {
    return false;
  }
};
