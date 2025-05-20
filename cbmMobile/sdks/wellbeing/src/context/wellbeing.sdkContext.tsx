import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { WellbeingNavigationProp } from '../navigation/wellbeing.navigationTypes';

export type WellbeingContextType = AppContextType;

const WellbeingContext = React.createContext<WellbeingContextType | null>(null);

const useWellbeingContextOnly = (): WellbeingContextType => {
  const context = React.useContext(WellbeingContext);
  if (!context) {
    throw new Error('useWellbeingContext must be used within a WellbeingContextProvider');
  }
  return context;
};

export function useWellbeingContext(): WithNavigation<WellbeingNavigationProp, WellbeingContextType> {
  return useWithNavigation<WellbeingNavigationProp, WellbeingContextType>(useWellbeingContextOnly());
}

export { WellbeingContext };
