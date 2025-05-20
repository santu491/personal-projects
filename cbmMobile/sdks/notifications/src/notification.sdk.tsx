import React, { useMemo } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { NotificationContext, NotificationContextType } from './context/notifications.sdkContext';

export const NotificationSDK = ({ children }: { children: React.ReactNode }) => {
  const appContext = useAppContext();

  const context: NotificationContextType = useMemo(() => {
    return {
      ...appContext,
    };
  }, [appContext]);

  return (
    <>
      <NotificationContext.Provider value={context}>{children}</NotificationContext.Provider>
    </>
  );
};
