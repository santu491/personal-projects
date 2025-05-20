import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { ClientNavigationProp } from '../navigation/client.navigationTypes';

export type ClientContextType = AppContextType;

const ClientContext = React.createContext<ClientContextType | null>(null);

const useClientContextOnly = (): ClientContextType => {
  const context = React.useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

export function useClientContext(): WithNavigation<ClientNavigationProp, ClientContextType> {
  return useWithNavigation<ClientNavigationProp, ClientContextType>(useClientContextOnly());
}

export { ClientContext };
