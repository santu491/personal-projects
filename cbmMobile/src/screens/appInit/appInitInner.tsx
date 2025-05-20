import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ScreenNames } from '../../config';
import { AppUnavailable } from '../appUnavailable/appUnavailable';
import { AppInitContext, AppStatus } from './appInitContext';
import { AppInitInnerProps, useAppInitInner } from './useAppInitInner';

export const AppInitInner: React.FC<React.PropsWithChildren<AppInitInnerProps>> = (props) => {
  const { appStatus, contextValue } = useAppInitInner(props);
  const Stack = createStackNavigator();
  return (
    <AppInitContext.Provider value={contextValue}>
      {appStatus === AppStatus.ERROR || appStatus === AppStatus.LOADING ? (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              headerStyle: {
                shadowColor: 'transparent',
              },
            }}
          >
            <Stack.Screen
              component={AppUnavailable}
              name={ScreenNames.APP_UNAVAILABLE}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        props.children
      )}
    </AppInitContext.Provider>
  );
};
