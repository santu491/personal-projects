import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { MenuNavigationProp } from '../navigation/menu.navigationTypes';

export type MenuContextType = AppContextType;

const MenuContext = React.createContext<MenuContextType | null>(null);

const useMenuContextOnly = (): MenuContextType => {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export function useMenuContext(): WithNavigation<MenuNavigationProp, MenuContextType> {
  return useWithNavigation<MenuNavigationProp, MenuContextType>(useMenuContextOnly());
}

export { MenuContext };
