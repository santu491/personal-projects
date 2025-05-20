import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { AuthNavigator } from '../../sdks/auth/src/navigation/auth.navigator';
import { ChatNavigator } from '../../sdks/chat/src/navigation/chat.navigator';
import { ClientNavigator } from '../../sdks/client/src/navigation/client.navigator';
import { NotificationNavigator } from '../../sdks/notifications/src/navigation/notification.navigator';
import { PrivacyPolicyScreen } from '../../shared/src/components/privacyPolicy';
import { StatementOfUnderstandingScreen } from '../../shared/src/components/statementOfUnderstanding/statementOfUnderstanding';
import { TermsOfUseScreen } from '../../shared/src/components/termsOfUse';
import { ScreenNames } from '../config';
import { useAppContext } from '../context/appContext';
import { CrisisSupport } from '../features/crisisSupport/crisisSupport';
import { NotificationPayloadType } from '../models/common';
import { TabNavigator } from './tabNavigator';

export const Navigator = () => {
  const Stack = createStackNavigator();
  const appContext = useAppContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {!appContext.client ? <Stack.Screen component={ClientNavigator} name={ScreenNames.CLIENT_SDK} /> : null}
      {appContext.pushNotificationPayload &&
      appContext.pushNotificationPayload.data.deepLinkType.toLowerCase() !==
        NotificationPayloadType.CREDIBLEMIND.toLowerCase() ? (
        <Stack.Screen component={AuthNavigator} name={ScreenNames.AUTH_SDK} />
      ) : null}
      <Stack.Screen component={TabNavigator} name={ScreenNames.TAB_NAVIAGTION} />
      <Stack.Screen component={AuthNavigator} name={ScreenNames.AUTH_SDK} />
      <Stack.Screen component={NotificationNavigator} name={ScreenNames.NOTIFICATION_SDK} />
      <Stack.Screen component={ChatNavigator} name={ScreenNames.CHAT_SDK} />
      <Stack.Screen component={PrivacyPolicyScreen} name={ScreenNames.PRIVACY_POLICY} options={{ headerShown: true }} />
      <Stack.Screen component={TermsOfUseScreen} name={ScreenNames.TERMS_OF_USE} options={{ headerShown: true }} />
      <Stack.Screen
        component={StatementOfUnderstandingScreen}
        name={ScreenNames.STATEMENT_OF_UNDERSTANDING}
        options={{ headerShown: true }}
      />
      <Stack.Screen component={CrisisSupport} name={ScreenNames.CRISIS_SUPPORT} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};
