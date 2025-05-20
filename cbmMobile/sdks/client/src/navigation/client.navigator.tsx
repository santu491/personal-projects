import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models/src/navigation/appUrls';
import { ClientDetails } from '../screens/client/client';
import { EapBenefits } from '../screens/eapBenefits/eapBenefits';
import { HealthCounselor } from '../screens/healthCounselor/healthCounselor';
import { LandingScreen } from '../screens/landing/landing';
import { WellnessContent } from '../screens/wellnessContent/wellnessContent';
import { NavStackParams, Screen } from './client.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.LANDING]: AppUrl.LANDING,
    [Screen.CLIENT_SEARCH]: AppUrl.CLIENT_SEARCH,
  },
};
export const clientNavConfig: PathConfig<NavStackParams> = navConfig;

export const ClientNavigator = () => {
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
      <Stack.Screen component={ClientDetails} name={Screen.CLIENT_SEARCH} options={{ headerShown: true }} />
      <Stack.Screen component={LandingScreen} name={Screen.LANDING} options={{ headerShown: false }} />
      <Stack.Screen component={EapBenefits} name={Screen.EAP_BENEFITS} options={{ headerShown: false }} />
      <Stack.Screen component={HealthCounselor} name={Screen.HEALTH_COUNSELOR} options={{ headerShown: false }} />
      <Stack.Screen component={WellnessContent} name={Screen.WELLNESS_CONTENT} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
