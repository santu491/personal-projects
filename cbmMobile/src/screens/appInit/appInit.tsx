import React from 'react';

// import { ScreenErrorBoundary } from '../errorBoundary/screenErrorBoundary';
import { AppInitInner } from './appInitInner';
import { useAppInit } from './useAppInit';

export const AppInit: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { appUpdateCheck, onReset } = useAppInit();
  return (
    // For time being it's commented out
    // <ScreenErrorBoundary onReset={onReset}>
    <AppInitInner reloadApp={onReset} appUpdateAvailable={appUpdateCheck}>
      {children}
    </AppInitInner>
    // </ScreenErrorBoundary>
  );
};
