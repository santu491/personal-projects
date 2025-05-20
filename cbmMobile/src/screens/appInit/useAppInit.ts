import { useCallback, useEffect, useLayoutEffect } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { startNetworkLogging } from 'react-native-network-logger';

import { CLIENT_STORAGE_KEY } from '../../../sdks/client/src/constants/constants';
import { Client } from '../../../sdks/client/src/model/client';
import { setUpPinning } from '../../adapters/api/config/sslPinning';
import { API_ENDPOINTS } from '../../config';
import { useAppContext } from '../../context/appContext';
import { usePushNotification } from '../../hooks/usePushNotification';
import { RequestMethod } from '../../models/adapters';
import { Environment } from '../../models/environments';
import { AppUpdateResponseDTO } from '../../models/versionUpdate';
import { isNotificationPermissionAlertGranted } from '../../util/pushNotificationStorage';
import { storage, StorageNamespace } from '../../util/storage';

export const useAppInit = () => {
  const appContext = useAppContext();

  useLayoutEffect(() => {
    setUpPinning(Config.ENV as Environment).catch((error) => console.info('SSL certificate error', error));
  }, []);

  const { getRNPermissions, configurePushNotificationsBadgeCount } = usePushNotification({
    onPermissionsGrantedUpdate: () => {},
  });

  useEffect(() => {
    updatePNStatusAPICall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePNStatusAPICall = useCallback(async () => {
    if (await isNotificationPermissionAlertGranted()) {
      const val: boolean = await getRNPermissions();
      if (val) {
        configurePushNotificationsBadgeCount();
      }
    }
  }, [getRNPermissions, configurePushNotificationsBadgeCount]);

  const isClientDataSaved = useCallback(async () => {
    startNetworkLogging();
    const clientStorage = storage(StorageNamespace.ClientSDK);
    const clientDetails: Client | undefined = await clientStorage.getObject(CLIENT_STORAGE_KEY);
    appContext.setClient(clientDetails);
  }, [appContext]);

  const appUpdateCheck = async () => {
    const appVersion = DeviceInfo.getVersion();
    try {
      const response: AppUpdateResponseDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.APP_VERSION_CHECK,
        RequestMethod.GET,
        null,
        {
          version: appVersion,
          platform: Platform.OS,
        }
      );
      await isClientDataSaved();
      return response;
    } catch (error) {
      console.warn(error);
      throw error;
    }
  };

  const onReset = () => {
    appUpdateCheck();
  };

  return {
    onReset,
    appUpdateCheck,
  };
};
