import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models';
import { CredibleMind } from '../screens/credibleMind';
import { Wellbeing } from '../screens/wellbeing';
import { WellbeingDetailsView } from '../screens/wellbeingDetailsView';
import { NavStackParams, Screen } from './wellbeing.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.WELLBEING]: AppUrl.WELLBEING,
    [Screen.CREDIBLEMIND]: AppUrl.CREDIBLEMIND_WELLBEING,
  },
};
export const wellbeingNavConfig: PathConfig<NavStackParams> = navConfig;

export const WellbeingNavigator = () => (
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
    <Stack.Screen component={Wellbeing} name={Screen.WELLBEING} options={{ headerShown: true }} />
    <Stack.Screen component={WellbeingDetailsView} name={Screen.WELLBEINGDETAILS} options={{ headerShown: true }} />
    <Stack.Screen component={CredibleMind} name={Screen.CREDIBLEMIND} options={{ headerShown: true }} />
  </Stack.Navigator>
);
