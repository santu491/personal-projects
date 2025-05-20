import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { ProviderContext, ProviderContextType } from '../context/provider.sdkContext';
import { getProvidersMockContext } from './providersContext';

export const ProvidersMockContextWrapper = ({
  children,
  providerContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
  providerContextProps?: ProviderContextType;
}) => {
  let providerProps = getProvidersMockContext();
  if (providerContextProps) {
    providerProps = {
      ...providerProps,
      ...providerContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <ProviderContext.Provider value={providerProps}>{children}</ProviderContext.Provider>;
    </AppMockContextWapper>
  );
};
