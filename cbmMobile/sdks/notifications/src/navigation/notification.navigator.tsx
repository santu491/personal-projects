import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models';
import { Notification } from '../screens/notification/notification';
import { NotificationDetails } from '../screens/notificationDetails/notificationDetails';
import { NotificationSettings } from '../screens/notificationSettings/notificationSettings';
import { NavStackParams, Screen } from './notification.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.NOTIFICATIONS]: AppUrl.NOTIFICATIONS,
    [Screen.NOITFICATION_SETTINGS]: AppUrl.NOITFICATION_SETTINGS,
  },
};
export const notificationNavConfig: PathConfig<NavStackParams> = navConfig;

export const NotificationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerStyle: {
          backgroundColor: appColors.white,
          shadowColor: 'transparent',
        },
      }}
    >
      <Stack.Screen component={Notification} name={Screen.NOTIFICATIONS} options={{ headerShown: true }} />
      <Stack.Screen
        component={NotificationDetails}
        name={Screen.NOTIFICATION_DETAILS}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        component={NotificationSettings}
        name={Screen.NOITFICATION_SETTINGS}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
