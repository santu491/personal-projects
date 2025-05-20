import { useContext } from 'react';

import { AppInitContext } from '../appInit/appInitContext';

export function useAppUnavailable() {
  const { appStatus, appUnavailableErrorContext, appUpdateAvailable, reloadApp } = useContext(AppInitContext);

  return {
    appStatus,
    appUnavailableErrorContext,
    appUpdateAvailable,
    reloadApp,
  };
}
