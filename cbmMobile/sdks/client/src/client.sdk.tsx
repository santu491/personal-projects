import React, { useMemo } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { ClientContext, ClientContextType } from './context/client.sdkContext';

export const ClientSDK = ({ children }: { children: React.ReactNode }) => {
  const appContext = useAppContext();

  const context: ClientContextType = useMemo(() => {
    return {
      ...appContext,
    };
  }, [appContext]);

  return (
    <>
      <ClientContext.Provider value={context}>{children}</ClientContext.Provider>
    </>
  );
};
