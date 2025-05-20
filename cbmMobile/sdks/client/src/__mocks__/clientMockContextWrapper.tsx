import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { ClientContext, ClientContextType } from '../context/client.sdkContext';
import { getMockClientContext } from './clientContext';

export const ClientMockContextWrapper = ({
  children,
  clientContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
  clientContextProps?: ClientContextType;
}) => {
  let clientProps = getMockClientContext();
  if (clientContextProps) {
    clientProps = {
      ...clientProps,
      ...clientContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <ClientContext.Provider value={clientProps}>{children}</ClientContext.Provider>;
    </AppMockContextWapper>
  );
};
