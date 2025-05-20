import React from 'react';
import { ReceivedNotification } from 'react-native-push-notification';

import { HomeCardsData, ImmediateAssistanceInfo } from '../../sdks/home/src/model/home';
import { NavigationHandler } from '../../shared/src/commonui/src';
import { ProfileData } from '../../shared/src/models/src/features/auth';
import { ChatConfig, GenesysChat } from '../../shared/src/models/src/features/chat';
import { Client } from '../../shared/src/models/src/features/client';
import { Header } from '../../shared/src/models/src/features/header';
import { MenuData } from '../../shared/src/models/src/features/menu';
import { MemberAppointStatus } from '../../shared/src/models/src/features/provider';
import { ServiceProvider } from '../adapters/api/serviceProvider';
import { Metrics } from '../analytics/metrics';
import { ScreenNames } from '../config';

export interface AppContextType {
  assessmentsSurveyId: string | undefined;
  chatConfig: ChatConfig | undefined;
  client: Client | undefined;
  deviceToken: string | undefined;
  genesysChat: GenesysChat | undefined;
  headerInfo: Header | undefined;
  hideChat: boolean;
  homeData: HomeCardsData[] | undefined;
  host: string | undefined;
  immediateAssistanceContact: ImmediateAssistanceInfo[] | undefined;
  isAutoLogOut: boolean;
  loggedIn: boolean;
  memberAppointmentStatus: MemberAppointStatus | undefined;
  menuData: MenuData[] | undefined;
  metrics: Metrics;
  navigateScreen: ScreenNames | undefined;
  navigationHandler: NavigationHandler;
  notificationCount: number | undefined;
  pushNotificationPayload: Omit<ReceivedNotification, 'userInfo'> | undefined;
  serviceProvider: ServiceProvider;
  setAssessmentsSurveyId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setChatConfig: React.Dispatch<React.SetStateAction<ChatConfig | undefined>>;
  setClient: React.Dispatch<React.SetStateAction<Client | undefined>>;
  setDeviceToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  setGenesysChat: React.Dispatch<React.SetStateAction<GenesysChat | undefined>>;
  setHeaderInfo: React.Dispatch<React.SetStateAction<Header | undefined>>;
  setHideChat: React.Dispatch<React.SetStateAction<boolean>>;
  setHomeData: React.Dispatch<React.SetStateAction<HomeCardsData[] | undefined>>;
  setHost: React.Dispatch<React.SetStateAction<string | undefined>>;
  setImmediateAssistanceContact: React.Dispatch<React.SetStateAction<ImmediateAssistanceInfo[] | undefined>>;
  setIsAutoLogOut: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setMemberAppointStatus: React.Dispatch<React.SetStateAction<MemberAppointStatus | undefined>>;
  setMenuData: React.Dispatch<React.SetStateAction<MenuData[] | undefined>>;
  setNavigateScreen: React.Dispatch<React.SetStateAction<ScreenNames | undefined>>;
  setNotificationCount: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPushNotificationPayload: React.Dispatch<React.SetStateAction<Omit<ReceivedNotification, 'userInfo'> | undefined>>;
  setServiceProvider: React.Dispatch<React.SetStateAction<ServiceProvider>>;
  setUserProfileData: React.Dispatch<React.SetStateAction<ProfileData | undefined>>;
  setWpoClientName: React.Dispatch<React.SetStateAction<string | undefined>>;
  userProfileData: ProfileData | undefined;
  wpoClientName: string | undefined;
}

const AppContext = React.createContext<AppContextType | null>(null);

const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used as parent of all sdk contexts');
  }
  return context;
};

export { AppContext, useAppContext };
