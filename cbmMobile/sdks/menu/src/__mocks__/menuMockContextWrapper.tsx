import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { MenuContext, MenuContextType } from '../context/menu.sdkContext';
import { getMockMenuContext } from './menuContext';

export const MenuMockContextWrapper = ({
  children,
  menuContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
  menuContextProps?: MenuContextType;
}) => {
  let menuProps = getMockMenuContext();
  if (menuContextProps) {
    menuProps = {
      ...menuProps,
      ...menuContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <MenuContext.Provider value={menuProps}>{children}</MenuContext.Provider>;
    </AppMockContextWapper>
  );
};
