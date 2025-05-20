import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { useAppContext } from '../context/appContext';
import { Navigator } from './navigator';
import { navigationRef } from './navRef';

export const AppNavigator: React.FC = () => {
  const context = useAppContext();
  return (
    <NavigationContainer linking={context.navigationHandler.linkingOptions} ref={navigationRef}>
      <Navigator />
    </NavigationContainer>
  );
};
