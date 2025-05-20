import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export enum Screen {
  CLIENT_SEARCH = 'ClientSearch',
  EAP_BENEFITS = 'EapBenefits',
  HEALTH_COUNSELOR = 'HealthCounselor',
  LANDING = 'Landing',
  WELLNESS_CONTENT = 'WellnessContent',
}

export type NavStackParams = {
  [Screen.LANDING]: undefined;
  [Screen.CLIENT_SEARCH]: { showHeaderBackIcon?: boolean };
  [Screen.EAP_BENEFITS]: undefined;
  [Screen.HEALTH_COUNSELOR]: undefined;
  [Screen.WELLNESS_CONTENT]: undefined;
};

export type ClientNavigationProp = StackNavigationProp<NavStackParams>;
export type LandingScreenProps = StackScreenProps<NavStackParams, Screen.LANDING>;
export type ClientSearchScreenProps = StackScreenProps<NavStackParams, Screen.CLIENT_SEARCH>;
export type EapBenefitsScreenProps = StackScreenProps<NavStackParams, Screen.EAP_BENEFITS>;
export type HealthCounselorScreenProps = StackScreenProps<NavStackParams, Screen.HEALTH_COUNSELOR>;
export type WellnessContentScreenProps = StackScreenProps<NavStackParams, Screen.WELLNESS_CONTENT>;
