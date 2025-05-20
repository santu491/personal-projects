import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export enum Screen {
  CHAT = 'Chat',
  START_CHAT = 'StartChat',
}

export type NavStackParams = {
  [Screen.START_CHAT]: undefined;
  [Screen.CHAT]: undefined;
};

export type ChatNavigationProp = StackNavigationProp<NavStackParams>;
export type StartChatScreenProps = StackScreenProps<NavStackParams, Screen.START_CHAT>;
export type ChatScreenProps = StackScreenProps<NavStackParams, Screen.CHAT>;
