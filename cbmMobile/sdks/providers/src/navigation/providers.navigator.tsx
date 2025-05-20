import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models';
import { ClinicalQuestionnaire } from '../screens/clinicalQuestionnaire/clinicalQuestionnaire';
import { CounselorSettings } from '../screens/counselorSettings/counselorSettings';
import { CounselorScreen } from '../screens/findCounselor/findCounselor';
import { ProviderDetailScreen } from '../screens/providerDetail/providerDetail';
import { ProviderListScreen } from '../screens/providerList/providerList';
import { RequestAppointment } from '../screens/requestAppointment/requestAppointment';
import { ReviewDetails } from '../screens/reviewDetails/reviewDetails';
import { ScheduleAppointment } from '../screens/scheduleAppointment/scheduleAppointment';
import { SelectDays } from '../screens/selectDays/selectDays';
import { SelectTimeRange } from '../screens/selectTimeRange/selectTimeRange';
import { ViewCounselorSettings } from '../screens/viewcounselorsettings/viewCounselorSettings';
import { NavStackParams, Screen } from './providers.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.FIND_COUNSELOR]: AppUrl.FIND_COUNSELOR,
    [Screen.SCHEDULE_APPOINTMENT]: AppUrl.SCHEDULE_APPOINTMENT,
    [Screen.CLINICAL_QUESTIONNAIRE]: AppUrl.CLINICAL_QUESTIONNAIRE,
  },
};
export const providerNavConfig: PathConfig<NavStackParams> = navConfig;

export const ProvidersNavigator = () => {
  return (
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
      <Stack.Screen component={CounselorScreen} name={Screen.FIND_COUNSELOR} options={{ headerShown: true }} />
      <Stack.Screen component={ProviderListScreen} name={Screen.PROVIDER_LIST} options={{ headerShown: true }} />
      <Stack.Screen component={ProviderDetailScreen} name={Screen.PROVIDER_DETAIL} options={{ headerShown: true }} />
      <Stack.Screen
        component={ScheduleAppointment}
        name={Screen.SCHEDULE_APPOINTMENT}
        options={{ headerShown: true }}
      />
      <Stack.Screen component={ReviewDetails} name={Screen.REVIEW_DETAILS} options={{ headerShown: true }} />
      <Stack.Screen
        component={ClinicalQuestionnaire}
        name={Screen.CLINICAL_QUESTIONNAIRE}
        options={{ headerShown: true }}
      />
      <Stack.Screen component={CounselorSettings} name={Screen.COUNSELOR_SETTINGS} options={{ headerShown: true }} />
      <Stack.Screen
        component={ViewCounselorSettings}
        name={Screen.VIEW_COUNSELOR_SETTINGS}
        options={{ headerShown: true }}
      />
      <Stack.Screen component={RequestAppointment} name={Screen.REQUEST_APPOINTMENT} options={{ headerShown: true }} />
      <Stack.Screen component={SelectDays} name={Screen.SELECT_DAYS} options={{ headerShown: true }} />
      <Stack.Screen component={SelectTimeRange} name={Screen.SELECT_TIME_RANGE} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};
