import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models';
import { AnalyticsLog } from '../screens/analyticsLog/analyticsLog';
import { CredibleMind } from '../screens/credibleMind/credibleMind';
import { DeleteAccount } from '../screens/deleteAccount/deleteAccount';
import { ProfileDetailsPage } from '../screens/details/profileDetailsPage';
import { Menu } from '../screens/menu/menu';
import { NetworkWatchLogger } from '../screens/networkWatchLogger/networkWatchLogger';
import { Profile } from '../screens/profile/profile';
import { Resource } from '../screens/resource/resource';
import { MenuResourceLibrary } from '../screens/resourceLibrary/resourceLibrary';
import { ViewTopics } from '../screens/viewTopics/viewTopics';
import { WellnessTopics } from '../screens/wellnessTopics/wellnessTopics';
import { NavStackParams, Screen } from './menu.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.MENU]: AppUrl.MENU,
    [Screen.PROFILE]: AppUrl.PROFILE,
  },
};
export const menuNavConfig: PathConfig<NavStackParams> = navConfig;

export const MenuNavigator = () => (
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
    <Stack.Screen component={Menu} name={Screen.MENU} options={{ headerShown: true }} />
    <Stack.Screen component={Profile} name={Screen.PROFILE} options={{ headerShown: true }} />
    <Stack.Screen component={ProfileDetailsPage} name={Screen.PROFILE_DETAILS} options={{ headerShown: true }} />
    <Stack.Screen component={WellnessTopics} name={Screen.WELLNESS_TOPICS} options={{ headerShown: true }} />
    <Stack.Screen component={ViewTopics} name={Screen.VIEW_TOPICS} options={{ headerShown: false }} />
    <Stack.Screen component={DeleteAccount} name={Screen.DELETE_ACCOUNT} options={{ headerShown: true }} />
    <Stack.Screen component={NetworkWatchLogger} name={Screen.NETWORK_WATCH_LOGGER} options={{ headerShown: true }} />
    <Stack.Screen component={CredibleMind} name={Screen.CREDIBLE_MIND} options={{ headerShown: true }} />
    <Stack.Screen component={Resource} name={Screen.RESOURCE} options={{ headerShown: true }} />
    <Stack.Screen component={MenuResourceLibrary} name={Screen.RESOURCE_LIBRARY} options={{ headerShown: true }} />
    <Stack.Screen component={AnalyticsLog} name={Screen.ANALYTICS_LOG} options={{ headerShown: true }} />
  </Stack.Navigator>
);
