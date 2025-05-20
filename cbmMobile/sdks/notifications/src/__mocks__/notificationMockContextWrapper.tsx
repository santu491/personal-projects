import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { NotificationContext, NotificationContextType } from '../context/notifications.sdkContext';
import { getMockNotificationContext } from './notificationContext';

export const NotificationMockContextWrapper = ({
  children,
  notificationContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
  notificationContextProps?: NotificationContextType;
}) => {
  let notificationProps = getMockNotificationContext();
  if (notificationContextProps) {
    notificationProps = {
      ...notificationProps,
      ...notificationContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <NotificationContext.Provider value={notificationProps}>{children}</NotificationContext.Provider>;
    </AppMockContextWapper>
  );
};
