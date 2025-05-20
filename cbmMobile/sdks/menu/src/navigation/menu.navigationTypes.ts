import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { BannerButtonPage } from '../../../../src/models/cardResource';
import { WellnesssTopicsList, WellnesssTopicsListDTO } from '../../../notifications/src/model/wellnessTopics';
import { MenuList } from '../models/menu';

export enum Screen {
  ANALYTICS_LOG = 'AnalyticsLog',
  CREDIBLE_MIND = 'CredibleMind',
  DELETE_ACCOUNT = 'DeleteAccount',
  MENU = 'Menu',
  NETWORK_WATCH_LOGGER = 'NetworkWatchLogger',
  PROFILE = 'Profile',
  PROFILE_DETAILS = 'ProfileDetails',
  RESOURCE = 'RESOURCE',
  RESOURCE_LIBRARY = 'ResourceLibrary',
  VIEW_TOPICS = 'ViewTopics',
  WELLNESS_TOPICS = 'WellnessTopics',
}

export type NavStackParams = {
  [Screen.MENU]: undefined;
  [Screen.PROFILE]: undefined;
  [Screen.PROFILE_DETAILS]: {
    listData: MenuList[];
    title: string;
  };
  [Screen.WELLNESS_TOPICS]: undefined;
  [Screen.VIEW_TOPICS]: {
    selectedTopicsList: WellnesssTopicsList[];
    topicsList: WellnesssTopicsListDTO[]; // this should cleanup later
  };
  [Screen.DELETE_ACCOUNT]: undefined;
  [Screen.NETWORK_WATCH_LOGGER]: undefined;
  [Screen.CREDIBLE_MIND]: {
    url: string;
  };
  [Screen.RESOURCE]: { path: string };
  [Screen.RESOURCE_LIBRARY]: { resourceLibraryData: BannerButtonPage };
  [Screen.ANALYTICS_LOG]: undefined;
};

export type MenuNavigationProp = StackNavigationProp<NavStackParams>;
export type MenuScreenProps = StackScreenProps<NavStackParams, Screen.MENU>;
export type ProfileScreenProps = StackScreenProps<NavStackParams, Screen.PROFILE>;
export type ProfileDetailsScreenProps = StackScreenProps<NavStackParams, Screen.PROFILE_DETAILS>;
export type WellnessTopicsScreenProps = StackScreenProps<NavStackParams, Screen.WELLNESS_TOPICS>;
export type ViewTopicsScreenProps = StackScreenProps<NavStackParams, Screen.VIEW_TOPICS>;
export type DeleteAccountScreenProps = StackScreenProps<NavStackParams, Screen.DELETE_ACCOUNT>;
export type NetworkWatchLoggerScreenProps = StackScreenProps<NavStackParams, Screen.NETWORK_WATCH_LOGGER>;
export type MenuCredibleMindScreenProps = StackScreenProps<NavStackParams, Screen.CREDIBLE_MIND>;
export type MenuResourceScreenProps = StackScreenProps<NavStackParams, Screen.RESOURCE>;
export type MenuResourceLibraryScreenProps = StackScreenProps<NavStackParams, Screen.RESOURCE_LIBRARY>;
export type MenuAnalyticsLogScreenProps = StackScreenProps<NavStackParams, Screen.ANALYTICS_LOG>;
