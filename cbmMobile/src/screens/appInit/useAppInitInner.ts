import JailMonkey from 'jail-monkey';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { AppUpdateResponseDTO } from '../../models/versionUpdate';
import { AppStatus, AppUnavailableErrorContext } from './appInitContext';

export interface AppInitInnerProps {
  appUpdateAvailable: () => Promise<AppUpdateResponseDTO>;
  reloadApp: () => void;
}

export const useAppInitInner = ({ reloadApp, appUpdateAvailable }: AppInitInnerProps) => {
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.LOADING);
  const [versionUpdate, setVersionUpdate] = useState<AppUpdateResponseDTO | undefined>(undefined);
  const { t } = useTranslation();

  const checkAppUpdate = useCallback(() => {
    appUpdateAvailable()
      .then((response) => {
        setVersionUpdate(response);
        if (!response.data.isForceUpdate) {
          setAppStatus(AppStatus.READY);
        }
      })
      .catch(() => {
        setAppStatus(AppStatus.ERROR);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkAppUpdate();
  }, [checkAppUpdate]);

  const updateApp = useCallback(() => {
    const link = versionUpdate?.data.platform;
    if (link) {
      Linking.openURL(link);
    }
  }, [versionUpdate]);

  const { appUnavailableErrorContext } = useMemo(() => {
    const unavailableErrorContext: AppUnavailableErrorContext | undefined = undefined;

    // check for rooted device
    if (!__DEV__ && JailMonkey.isJailBroken()) {
      setAppStatus(AppStatus.ERROR);
      return {
        appUnavailableErrorContext: {
          body: t('rootedDevice.body'),
          header: t('rootedDevice.header'),
          preventReload: true,
        },
      };
    }

    if (versionUpdate?.data.isForceUpdate) {
      setAppStatus(AppStatus.ERROR);
      return {
        appUnavailableErrorContext: {
          body: t('updateApp.body'),
          header: t('updateApp.header'),
          buttons: [
            {
              onPress: updateApp, // need to refactored later
              title: t('updateApp.updateNow'),
            },
          ],
          preventReload: true,
        },
      };
    }

    return {
      appUnavailableErrorContext: unavailableErrorContext,
    };
  }, [versionUpdate, t, updateApp]);

  const contextValue = useMemo(
    () => ({ appStatus, appUnavailableErrorContext, reloadApp }),
    [appStatus, appUnavailableErrorContext, reloadApp]
  );

  return {
    contextValue,
    appStatus,
  };
};
