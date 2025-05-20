import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState } from 'react-native';

import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { isAndroid } from '../../../../../src/util/commonUtils';
import { isNotificationPermissionAlertGranted } from '../../../../../src/util/pushNotificationStorage';
import { openDeviceSettings } from '../../config/util/commonUtils';
import { Installations, SuccessPreferencesAlertData } from '../../model/notification';

export const useNotificationSettings = () => {
  const { t } = useTranslation();

  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(false);
  const appState = useRef(AppState.currentState);
  const [modelVisible, setModelVisible] = useState(false);
  const [isDeviceSettingsOpen, setIsDeviceSettingsOpen] = useState(false);
  const previousStatePushNotificationRef = useRef(isPushNotificationEnabled);

  const [successAlertData, setSuccessAlertData] = useState<SuccessPreferencesAlertData | undefined>();

  const {
    enablePushNotifications,
    getRNPermissions,
    configurePushNotificationsAfterReLogin,
    requestNotificationPermissionAndroid,
  } = usePushNotification({
    onPermissionsGrantedUpdate: async (token) => {
      if (!(await isNotificationPermissionAlertGranted())) {
        setIsPushNotificationEnabled(token);
      }
    },
    getPNInstallationStatus: (apiName) => {
      successAlertText(apiName);
      setModelVisible(true);
    },
  });

  const updateNotificationPermissionSwitch = useCallback(async () => {
    const val: boolean = await getRNPermissions();
    setIsPushNotificationEnabled(val);
    previousStatePushNotificationRef.current = val;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateNotificationSettingsBasedOnPermissions = useCallback(async () => {
    const val: boolean = await getRNPermissions();
    setIsPushNotificationEnabled(val);
    if (previousStatePushNotificationRef.current !== val) {
      if (val) {
        enablePushNotifications();
      } else {
        configurePushNotificationsAfterReLogin(Installations.DELETE_INSTALLATION);
      }
    }
  }, [configurePushNotificationsAfterReLogin, enablePushNotifications, getRNPermissions, setIsPushNotificationEnabled]);

  const handleAppForegroundNotificationPermissionUpdate = useCallback(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        (await isNotificationPermissionAlertGranted())
      ) {
        await updateNotificationSettingsBasedOnPermissions();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [updateNotificationSettingsBasedOnPermissions]);

  const togglePushNotificationSwitch = async () => {
    previousStatePushNotificationRef.current = isPushNotificationEnabled;

    if (!isPushNotificationEnabled) {
      if (await isNotificationPermissionAlertGranted()) {
        openDeviceSettings();
      } else {
        /// This method is for First time permission alert action
        requestInitialNotificationPermission();
        setIsPushNotificationEnabled((previousState) => !previousState);
      }
    } else {
      openSettingsForGrantedPermissions(); // This method is for already granted permission alert action
    }
  };

  const openSettingsForGrantedPermissions = () => {
    if (isAndroid()) {
      // Android relaunches the app after permission is granted, so we need to check if the permission is granted again
      setModelVisible(true);
      setIsDeviceSettingsOpen(true);
      setSuccessAlertData({
        title: t('notifications.title'),
        description: t('notifications.preferences.notificationTurnedOffMessage'),
      });
    } else {
      openDeviceSettings();
    }
  };

  const requestInitialNotificationPermission = () => {
    if (isAndroid()) {
      requestNotificationPermissionAndroid();
    } else {
      enablePushNotifications();
    }
  };

  const successAlertText = (title: string) => {
    switch (title) {
      case Installations.SAVE_INSTALLATION:
        setSuccessAlertData({
          title: t('notifications.preferences.successAlertTitle'),
          description: t('notifications.preferences.successAlertMessage'),
        });

        break;
      default:
        setSuccessAlertData({
          title: t('notifications.preferences.disableAlertTitle'),
          description: t('notifications.preferences.disableAlertMessage'),
        });
        break;
    }
  };

  const onPressSuccessAlertButton = () => {
    if (isDeviceSettingsOpen) {
      openDeviceSettings();
      setIsDeviceSettingsOpen(false);
    }
    setModelVisible(false);
  };

  useEffect(() => {
    const unsubscribe = handleAppForegroundNotificationPermissionUpdate();
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateNotificationPermissionSwitch();
  }, [updateNotificationPermissionSwitch]);

  return {
    isPushNotificationEnabled,
    setIsPushNotificationEnabled,
    updateNotificationPermissionSwitch,
    togglePushNotificationSwitch,
    successAlertText,
    successAlertData,
    modelVisible,
    onPressSuccessAlertButton,
  };
};
