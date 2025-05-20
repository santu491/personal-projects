import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { ProviderDetailProps } from '../components/providerDetails/providerDetails';
import { CancelScreenType } from '../constants/constants';
import { AppointmentCurrentStatus } from '../models/appointments';

export enum Screen {
  APPOINTMENTS_HISTORY = 'AppointmentsHistory',
  APPOINTMENT_DETAILS = 'AppointmentDetails',
  APPOINTMENT_DETAILS_REQUESTS = 'AppointmentDetailsRequests',
  CLINICAL_QUESTIONNAIRE_DETAILS = 'ClinicalQuestionnaire',
  CONFIRMED_REQUESTS = 'ConfirmedRequests',
  INACTIVE_REQUESTS = 'InActiveRequests',
  PENDING_REQUESTS = 'PendingRequests',
  PROPOSED_DAYS_AND_TIME = 'ProposedDaysAndTime',
  VIEW_OTHER_REQUESTS = 'ViewOtherRequests',
}

export type NavStackParams = {
  [Screen.INACTIVE_REQUESTS]: undefined;
  [Screen.APPOINTMENTS_HISTORY]: undefined;
  [Screen.APPOINTMENT_DETAILS]: undefined;
  [Screen.APPOINTMENT_DETAILS_REQUESTS]: {
    appointmentCurrentStatus?: AppointmentCurrentStatus;
    screenType: CancelScreenType;
  };
  [Screen.CLINICAL_QUESTIONNAIRE_DETAILS]: undefined;
  [Screen.CONFIRMED_REQUESTS]: undefined;
  [Screen.PENDING_REQUESTS]: undefined;
  [Screen.PROPOSED_DAYS_AND_TIME]: undefined;
  [Screen.VIEW_OTHER_REQUESTS]: {
    dateOfInitiation?: string;
    otherRequestList?: ProviderDetailProps[];
  };
};

export type AppointmentNavigationProp = StackNavigationProp<NavStackParams>;
export type InActiveRequestScreenProps = StackScreenProps<NavStackParams, Screen.INACTIVE_REQUESTS>;
export type AppointmentHistoryScreenProps = StackScreenProps<NavStackParams, Screen.APPOINTMENTS_HISTORY>;
export type AppointmentDetailsScreenProps = StackScreenProps<NavStackParams, Screen.APPOINTMENT_DETAILS>;
export type AppointmentDetailsRequestsScreenProps = StackScreenProps<
  NavStackParams,
  Screen.APPOINTMENT_DETAILS_REQUESTS
>;
export type ClinicalQuestionnaireDetailsScreenProps = StackScreenProps<
  NavStackParams,
  Screen.CLINICAL_QUESTIONNAIRE_DETAILS
>;
export type ConfirmedRequestsScreenProps = StackScreenProps<NavStackParams, Screen.CONFIRMED_REQUESTS>;
export type PendingRequestsScreenProps = StackScreenProps<NavStackParams, Screen.PENDING_REQUESTS>;
export type ProposedDaysAndTimeScreenProps = StackScreenProps<NavStackParams, Screen.PROPOSED_DAYS_AND_TIME>;
export type ViewOtherRequestsScreenProps = StackScreenProps<NavStackParams, Screen.VIEW_OTHER_REQUESTS>;
