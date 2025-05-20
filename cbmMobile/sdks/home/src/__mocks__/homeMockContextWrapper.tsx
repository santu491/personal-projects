import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { HomeContext, HomeContextType } from '../context/home.sdkContext';
import { getMockHomeContext } from './homeContext';

export const HomeMockContextWrapper = ({
  children,
  homeContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
  homeContextProps?: HomeContextType;
}) => {
  let homeProps = getMockHomeContext();
  if (homeContextProps) {
    homeProps = {
      ...homeProps,
      ...homeContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <HomeContext.Provider value={homeProps}>{children}</HomeContext.Provider>;
    </AppMockContextWapper>
  );
};
