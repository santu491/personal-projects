import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { NotificationNavigationProp } from '../navigation/notification.navigationTypes';

export type NotificationContextType = AppContextType;
const NotificationContext = React.createContext<NotificationContextType | null>(null);

const useNotificationContextOnly = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export function useNotificationContext(): WithNavigation<NotificationNavigationProp, NotificationContextType> {
  return useWithNavigation<NotificationNavigationProp, NotificationContextType>(useNotificationContextOnly());
}

export { NotificationContext };
