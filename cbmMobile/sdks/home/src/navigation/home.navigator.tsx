import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { AppUrl } from '../../../../shared/src/models';
import { appColors } from '../../../../src/config';
import { CredibleMind } from '../screens/credibleMind/credibleMind';
import { ExploreMoreResources } from '../screens/exploreMore/exploreMoreResources';
import { HomeScreen } from '../screens/home/home';
import { Landing } from '../screens/landing/landing';
import { Resource } from '../screens/resource/resource';
import { HomeResourceLibrary } from '../screens/resourceLibrary/resourceLibrary';
import { Telehealth } from '../screens/telehealth/teleHealth';
import { NavStackParams, Screen } from './home.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.HOME]: AppUrl.HOME,
    [Screen.CREDIBLEMIND]: AppUrl.CREDIBLEMIND,
  },
};
export const homeNavConfig: PathConfig<NavStackParams> = navConfig;

export const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      headerStyle: {
        backgroundColor: appColors.white,
        shadowColor: 'transparent',
      },
    }}
  >
    <Stack.Screen component={Landing} name={Screen.LANDING} options={{ headerShown: false }} />
    <Stack.Screen component={HomeScreen} name={Screen.HOME} options={{ headerShown: true }} />
    <Stack.Screen component={Telehealth} name={Screen.TELE_HEALTH} options={{ headerShown: true }} />
    <Stack.Screen component={CredibleMind} name={Screen.CREDIBLEMIND} options={{ headerShown: true }} />
    <Stack.Screen
      component={ExploreMoreResources}
      name={Screen.EXPLORE_MORE_RESOURCES}
      options={{ headerShown: true }}
    />
    <Stack.Screen component={Resource} name={Screen.RESOURCE} options={{ headerShown: true }} />

    <Stack.Screen component={HomeResourceLibrary} name={Screen.RESOURCE_LIBRARY} options={{ headerShown: true }} />
  </Stack.Navigator>
);
