import { DEVICE_INSTALLATION_STORAGE_KEY } from '../constants/constants';
import { storage, StorageNamespace } from './storage';

export const setDeviceInstallation = async (deviceId: string) => {
  try {
    const pushNotificationPermissionStorage = storage(StorageNamespace.DeviceInstallation);
    await pushNotificationPermissionStorage.setString(DEVICE_INSTALLATION_STORAGE_KEY, deviceId);
  } catch (e) {
    // saving error
    throw new Error('Device installation not found');
  }
};

export const getDeviceInstallation = async () => {
  try {
    const pushNotificationPermissionStorage = storage(StorageNamespace.DeviceInstallation);
    const value = await pushNotificationPermissionStorage.getString(DEVICE_INSTALLATION_STORAGE_KEY);
    return value ?? '';
  } catch (e) {
    return false;
  }
};
