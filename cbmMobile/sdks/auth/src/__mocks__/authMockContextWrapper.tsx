import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { UserContext, UserContextType } from '../context/auth.sdkContext';
import { getMockAuthContext } from './authContext';

export const AuthMockContextWrapper = ({
  children,
  authContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  authContextProps?: UserContextType;
  children: React.ReactNode;
}) => {
  let authProps = getMockAuthContext();
  if (authContextProps) {
    authProps = {
      ...authProps,
      ...authContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <UserContext.Provider value={authProps}>{children}</UserContext.Provider>;
    </AppMockContextWapper>
  );
};
