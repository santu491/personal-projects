import React, { useMemo } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { WellbeingContext, WellbeingContextType } from './context/wellbeing.sdkContext';

export const WellbeingSDK = ({ children }: { children: React.ReactNode }) => {
  const appContext = useAppContext();

  const context: WellbeingContextType = useMemo(() => {
    return {
      ...appContext,
    };
  }, [appContext]);

  return (
    <>
      <WellbeingContext.Provider value={context}>{children}</WellbeingContext.Provider>
    </>
  );
};
