import React from 'react';

import { getProvidersMockContext } from '../../sdks/providers/src/__mocks__/providersContext';
import { AppContext, AppContextType } from '../context/appContext';
import { getMockAppContext } from './appContext';

export const AppMockContextWapper = ({
  children,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
}) => {
  let props = getMockAppContext();
  if (appContextProps) {
    props = {
      ...getProvidersMockContext,
      ...appContextProps,
    };
  }
  return <AppContext.Provider value={props}>{children}</AppContext.Provider>;
};
