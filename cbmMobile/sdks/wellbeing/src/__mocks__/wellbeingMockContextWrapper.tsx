import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { WellbeingContext, WellbeingContextType } from '../context/wellbeing.sdkContext';
import { getMockWellbeingContext } from './wellbeingContext';

export const WellbeingMockContextWrapper = ({
  children,
  wellbeingContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  children: React.ReactNode;
  wellbeingContextProps?: WellbeingContextType;
}) => {
  let wellbeingProps = getMockWellbeingContext();
  if (wellbeingContextProps) {
    wellbeingProps = {
      ...wellbeingProps,
      ...wellbeingContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <WellbeingContext.Provider value={wellbeingProps}>{children}</WellbeingContext.Provider>;
    </AppMockContextWapper>
  );
};
