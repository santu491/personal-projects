import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { BannerButtonPage } from '../../../../src/models/cardResource';
import { CardInfo } from '../model/home';

export enum Screen {
  CREDIBLEMIND = 'CredibleMind',
  EXPLORE_MORE_RESOURCES = 'ExploreMoreResources',
  HOME = 'Home',
  LANDING = 'landing',
  RESOURCE = 'Resource',
  RESOURCE_LIBRARY = 'ResourceLibrary',
  TELE_HEALTH = 'Telehealth',
}

export type NavStackParams = {
  [Screen.HOME]: undefined;
  [Screen.CREDIBLEMIND]: {
    url: string;
  };
  [Screen.TELE_HEALTH]: { teleHealthData: CardInfo[] };
  [Screen.EXPLORE_MORE_RESOURCES]: undefined;
  [Screen.RESOURCE]: { path: string };
  [Screen.RESOURCE_LIBRARY]: { resourceLibraryData: BannerButtonPage };
  [Screen.LANDING]: undefined;
};

export type HomeNavigationProp = StackNavigationProp<NavStackParams>;
export type HomeScreenProps = StackScreenProps<NavStackParams, Screen.HOME>;
export type TelehealthScreenProps = StackScreenProps<NavStackParams, Screen.TELE_HEALTH>;
export type HomeCredibleMindScreenProps = StackScreenProps<NavStackParams, Screen.CREDIBLEMIND>;
export type HomeCardResourceScreenProps = StackScreenProps<NavStackParams, Screen.RESOURCE>;
export type HomeResourceLibraryScreenProps = StackScreenProps<NavStackParams, Screen.RESOURCE_LIBRARY>;
