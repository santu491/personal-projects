import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export enum Screen {
  NOITFICATION_SETTINGS = 'NotificationSettings',
  NOTIFICATIONS = 'Notifications',
  NOTIFICATION_DETAILS = 'NotificationDetails',
  WELLNESS_TOPICS = 'WellnessTopics',
}

export type NavStackParams = {
  [Screen.NOTIFICATIONS]: undefined;
  [Screen.NOTIFICATION_DETAILS]: {
    url: string;
  };
  [Screen.NOITFICATION_SETTINGS]: undefined;
  [Screen.WELLNESS_TOPICS]: undefined;
};

export type NotificationNavigationProp = StackNavigationProp<NavStackParams>;
export type NotificationScreenProps = StackScreenProps<NavStackParams, Screen.NOTIFICATIONS>;
export type NotificationDetailScreenProps = StackScreenProps<NavStackParams, Screen.NOTIFICATION_DETAILS>;
export type NotificationSettingsScreenProps = StackScreenProps<NavStackParams, Screen.NOITFICATION_SETTINGS>;
export type WellnessScreenProps = StackScreenProps<NavStackParams, Screen.WELLNESS_TOPICS>;
