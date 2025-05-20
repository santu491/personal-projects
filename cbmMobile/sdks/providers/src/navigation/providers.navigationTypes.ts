import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { SearchProvider } from '../model/providerSearchResponse';

export enum Screen {
  CLINICAL_QUESTIONNAIRE = 'ClinicalQuestionnaire',
  COUNSELOR_SETTINGS = 'CounselorSettings',
  FIND_COUNSELOR = 'FindCounselor',
  PROVIDER_DETAIL = 'ProviderDetail',
  PROVIDER_LIST = 'ProviderList',
  REQUEST_APPOINTMENT = 'RequestAppointment',
  REVIEW_DETAILS = 'ReviewDetails',
  SCHEDULE_APPOINTMENT = 'ScheduleAppointment',
  SELECT_DAYS = 'SelectDays',
  SELECT_TIME_RANGE = 'SelectTimeRange',
  VIEW_COUNSELOR_SETTINGS = 'ViewCounselorSettings',
}

export type NavStackParams = {
  [Screen.CLINICAL_QUESTIONNAIRE]: {
    appointmentFlowStatus?: boolean;
  };
  [Screen.COUNSELOR_SETTINGS]: undefined;
  [Screen.FIND_COUNSELOR]: undefined;
  [Screen.PROVIDER_DETAIL]: {
    provider: SearchProvider;
  };
  [Screen.PROVIDER_LIST]: {
    hasEditCounselor?: boolean;
  };
  [Screen.REQUEST_APPOINTMENT]: undefined;
  [Screen.REVIEW_DETAILS]: undefined;
  [Screen.SCHEDULE_APPOINTMENT]: undefined;
  [Screen.SELECT_DAYS]: undefined;
  [Screen.SELECT_TIME_RANGE]: undefined;
  [Screen.VIEW_COUNSELOR_SETTINGS]: undefined;
};

export type ProvidersNavigationProp = StackNavigationProp<NavStackParams>;
export type ClinicalQuestionnaireScreenProps = StackScreenProps<NavStackParams, Screen.CLINICAL_QUESTIONNAIRE>;
export type CounselorSettingsScreenProps = StackScreenProps<NavStackParams, Screen.COUNSELOR_SETTINGS>;
export type FindCounselorScreenProps = StackScreenProps<NavStackParams, Screen.FIND_COUNSELOR>;
export type ProviderDetailScreenProps = StackScreenProps<NavStackParams, Screen.PROVIDER_DETAIL>;
export type ProviderListScreenProps = StackScreenProps<NavStackParams, Screen.PROVIDER_LIST>;
export type RequestAppointmentScreenProps = StackScreenProps<NavStackParams, Screen.REQUEST_APPOINTMENT>;
export type ReviewDetailsScreenProps = StackScreenProps<NavStackParams, Screen.REVIEW_DETAILS>;
export type ScheduleAppointmentScreenProps = StackScreenProps<NavStackParams, Screen.SCHEDULE_APPOINTMENT>;
export type SelectDaysScreenProps = StackScreenProps<NavStackParams, Screen.SELECT_DAYS>;
export type SelectTimeRangeScreenProps = StackScreenProps<NavStackParams, Screen.SELECT_TIME_RANGE>;
export type ViewCounselorSettingsScreenProps = StackScreenProps<NavStackParams, Screen.VIEW_COUNSELOR_SETTINGS>;
