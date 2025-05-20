import React, { useMemo } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { MenuContext, MenuContextType } from './context/menu.sdkContext';

export const MenuSDK = ({ children }: { children: React.ReactNode }) => {
  const appContext = useAppContext();

  const context: MenuContextType = useMemo(() => {
    return {
      ...appContext,
    };
  }, [appContext]);

  return (
    <>
      <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
    </>
  );
};
