import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export enum Screen {
  HOME_SDK = 'HomeSDK',
  PROVIDERS_TAB = 'ProvidersSDK',
}

export type NavStackParams = {
  [Screen.HOME_SDK]: undefined;
  [Screen.PROVIDERS_TAB]: undefined;
};

export type HomeNavigationProp = StackNavigationProp<NavStackParams>;
export type HomeScreenProps = StackScreenProps<NavStackParams, Screen.HOME_SDK>;
export type ProvidersScreenProps = StackScreenProps<NavStackParams, Screen.PROVIDERS_TAB>;
