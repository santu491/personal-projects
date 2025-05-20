import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../src/config';
import { MemberPlan } from '../screens/memberPlan/memberPlan';
import { NavStackParams, Screen } from './memberPlan.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

export const MemberPlanNavigator = () => (
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
    <Stack.Screen name={Screen.MEMBER_PLAN} component={MemberPlan} />
  </Stack.Navigator>
);
