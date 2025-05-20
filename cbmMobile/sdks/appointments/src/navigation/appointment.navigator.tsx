import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { appColors } from '../../../../shared/src/context/appColors';
import { AppUrl } from '../../../../shared/src/models';
import { AppointmentCancelRequests } from '../screens/appointmentCancel/appointmentCancel';
import { AppointmentDetails } from '../screens/appointmentDetails/appointmentDetails';
import { AppointmentHistory } from '../screens/appointmentHistory/appointmentHistory';
import { ClinicalQuestionnaireDetails } from '../screens/clinicalQuestionnaireDetails/clinicalQuestionnaireDetails';
import { ConfirmedRequests } from '../screens/confirmedRequests/confirmedRequests';
import { InActiveRequests } from '../screens/inActiveRequests/inActiveRequests';
import { PendingRequests } from '../screens/pendingRequests/pendingRequests';
import { ProposedDaysAndTime } from '../screens/proposedDaysAndTime/proposedDaysAndTime';
import { ViewOtherRequests } from '../screens/viewOtherRequests/viewOtherRequests';
import { NavStackParams, Screen } from './appointment.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.APPOINTMENTS_HISTORY]: AppUrl.APPOINTMENTS_HISTORY,
    [Screen.PENDING_REQUESTS]: AppUrl.PENDING_REQUESTS,
    [Screen.INACTIVE_REQUESTS]: AppUrl.INACTIVE_REQUESTS,
    [Screen.CONFIRMED_REQUESTS]: AppUrl.CONFIRMED_REQUESTS,
  },
};
export const appointmentsNavConfig: PathConfig<NavStackParams> = navConfig;

export const AppointmentsNavigator = () => (
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
    <Stack.Screen component={AppointmentHistory} name={Screen.APPOINTMENTS_HISTORY} options={{ headerShown: true }} />
    <Stack.Screen component={PendingRequests} name={Screen.PENDING_REQUESTS} options={{ headerShown: true }} />
    <Stack.Screen component={InActiveRequests} name={Screen.INACTIVE_REQUESTS} options={{ headerShown: true }} />
    <Stack.Screen component={ConfirmedRequests} name={Screen.CONFIRMED_REQUESTS} options={{ headerShown: true }} />
    <Stack.Screen component={ViewOtherRequests} name={Screen.VIEW_OTHER_REQUESTS} options={{ headerShown: true }} />
    <Stack.Screen component={AppointmentDetails} name={Screen.APPOINTMENT_DETAILS} options={{ headerShown: true }} />
    <Stack.Screen
      component={ClinicalQuestionnaireDetails}
      name={Screen.CLINICAL_QUESTIONNAIRE_DETAILS}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      component={ProposedDaysAndTime}
      name={Screen.PROPOSED_DAYS_AND_TIME}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      component={AppointmentCancelRequests}
      name={Screen.APPOINTMENT_DETAILS_REQUESTS}
      options={{ headerShown: true }}
    />
  </Stack.Navigator>
);
