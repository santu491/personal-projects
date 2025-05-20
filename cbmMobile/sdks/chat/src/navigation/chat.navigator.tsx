import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models/src/navigation/appUrls';
import { Chat } from '../screens/chat/chat';
import { StartChat } from '../screens/startChat/startChat';
import { NavStackParams, Screen } from './chat.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.START_CHAT]: AppUrl.START_CHAT,
    [Screen.CHAT]: AppUrl.CHAT,
  },
};
export const chatNavConfig: PathConfig<NavStackParams> = navConfig;

export const ChatNavigator = () => {
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
      <Stack.Screen component={StartChat} name={Screen.START_CHAT} options={{ headerShown: true }} />
      <Stack.Screen component={Chat} name={Screen.CHAT} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};
