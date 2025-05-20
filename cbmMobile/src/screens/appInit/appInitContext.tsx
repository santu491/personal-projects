import { Button } from '@sydney/motif-components';
import React, { ComponentProps } from 'react';

export enum AppStatus {
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  READY = 'READY',
}

export interface AppUnavailableErrorContext {
  body?: string;
  buttons?: Array<ComponentProps<typeof Button>>;
  header?: string;
  icon?: React.ReactNode;
  preventReload?: boolean;
}

export interface AppInitContextType {
  appStatus: AppStatus;
  appUnavailableErrorContext?: AppUnavailableErrorContext;
  appUpdateAvailable?: boolean;
  appUpdateDescription?: string;
  reloadApp: () => void;
}

export const AppInitContext = React.createContext<AppInitContextType>({
  appStatus: AppStatus.LOADING,
  appUpdateAvailable: false,
  reloadApp: () => {
    // N/A until context is set
  },
});
