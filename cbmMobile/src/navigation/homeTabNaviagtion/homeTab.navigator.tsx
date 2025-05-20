import { PathConfig } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HomeNavigator } from '../../../sdks/home/src/navigation/home.navigator';
import { ProvidersNavigator } from '../../../sdks/providers/src/navigation/providers.navigator';
import { AppUrl } from '../../../shared/src/models';
import { NavStackParams, Screen } from './home.navigationTypes';

const Stack = createNativeStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.HOME_SDK]: AppUrl.HOME_SDK,
    [Screen.PROVIDERS_TAB]: AppUrl.PROVIDERS_TAB,
  },
};
export const homeTabNavConfig: PathConfig<NavStackParams> = navConfig;

export const HomeTabNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen component={HomeNavigator} name={Screen.HOME_SDK} options={{ headerShown: false }} />
      <Stack.Screen component={ProvidersNavigator} name={Screen.PROVIDERS_TAB} />
    </Stack.Navigator>
  );
};
