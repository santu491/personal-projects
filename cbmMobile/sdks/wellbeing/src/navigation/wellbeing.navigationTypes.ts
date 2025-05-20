import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export enum Screen {
  CREDIBLEMIND = 'CredibleMind',
  WELLBEING = 'Wellbeing',
  WELLBEINGDETAILS = 'WellbeingDetailsView',
}

export type NavStackParams = {
  [Screen.WELLBEING]: undefined;
  [Screen.CREDIBLEMIND]: {
    url: string;
  };
  [Screen.WELLBEINGDETAILS]: {
    url: string;
  };
};

export type WellbeingNavigationProp = StackNavigationProp<NavStackParams>;
export type WellbeingScreenProps = StackScreenProps<NavStackParams, Screen.WELLBEING>;
export type WellbeingDetailsScreenProps = StackScreenProps<NavStackParams, Screen.CREDIBLEMIND>;
export type CredibleMindScreenProps = StackScreenProps<NavStackParams, Screen.WELLBEINGDETAILS>;
