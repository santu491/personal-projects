import React, { useMemo, useState } from 'react';
import { ReceivedNotification } from 'react-native-push-notification';

import { HomeCardsData, ImmediateAssistanceInfo } from '../../sdks/home/src/model/home';
import { ProfileData } from '../../shared/src/models/src/features/auth';
import { ChatConfig, GenesysChat } from '../../shared/src/models/src/features/chat';
import { Client } from '../../shared/src/models/src/features/client';
import { Header } from '../../shared/src/models/src/features/header';
import { MenuData } from '../../shared/src/models/src/features/menu';
import { MemberAppointStatus } from '../../shared/src/models/src/features/provider';
import { Service } from '../adapters/api/service';
import { ServiceProvider } from '../adapters/api/serviceProvider';
import { ScreenNames } from '../config/appScreens';
import { useMetrics } from '../hooks/useMetrics';
import { CarelonNavigationHandler } from '../navigation/navigationHandler';
import { AppContext, AppContextType } from './appContext';

export const AppContextWapper = ({ children }: { children: React.ReactNode }) => {
  const serviceProviderInstance = new Service().serviceProvider;
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider>(serviceProviderInstance);
  const [loggedIn, setLoggedIn] = useState(false);
  const [navigateScreen, setNavigateScreen] = useState<ScreenNames | undefined>();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [pushNotificationPayload, setPushNotificationPayload] = useState<
    Omit<ReceivedNotification, 'userInfo'> | undefined
  >(undefined);
  const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined);
  const [notificationCount, setNotificationCount] = useState<number | undefined>();
  const [userProfileData, setUserProfileData] = useState<ProfileData | undefined>();
  const [memberAppointmentStatus, setMemberAppointStatus] = useState<MemberAppointStatus | undefined>(undefined);
  const [chatConfig, setChatConfig] = useState<ChatConfig | undefined>();
  const [immediateAssistanceContact, setImmediateAssistanceContact] = useState<ImmediateAssistanceInfo[] | undefined>(
    undefined
  );
  const [isAutoLogOut, setIsAutoLogOut] = useState<boolean>(false);
  const [genesysChat, setGenesysChat] = useState<GenesysChat | undefined>();
  const [assessmentsSurveyId, setAssessmentsSurveyId] = useState<string | undefined>();
  const [menuData, setMenuData] = useState<MenuData[] | undefined>();
  const [host, setHost] = useState<string | undefined>();
  const [wpoClientName, setWpoClientName] = useState<string | undefined>();
  const [hideChat, setHideChat] = useState<boolean>(false);
  const [headerInfo, setHeaderInfo] = useState<undefined | Header>();
  const [homeData, setHomeData] = useState<undefined | HomeCardsData[]>();

  const navigationHandler = useMemo(() => {
    return new CarelonNavigationHandler();
  }, []);

  const { metrics } = useMetrics();

  const context: AppContextType = useMemo(() => {
    return {
      loggedIn,
      setLoggedIn,
      serviceProvider,
      setServiceProvider,
      navigateScreen,
      setNavigateScreen,
      navigationHandler,
      client,
      notificationCount,
      setClient,
      setDeviceToken,
      deviceToken,
      setPushNotificationPayload,
      pushNotificationPayload,
      setNotificationCount,
      userProfileData,
      setUserProfileData,
      memberAppointmentStatus,
      setMemberAppointStatus,
      setChatConfig,
      chatConfig,
      immediateAssistanceContact,
      setImmediateAssistanceContact,
      setGenesysChat,
      genesysChat,
      assessmentsSurveyId,
      setAssessmentsSurveyId,
      setIsAutoLogOut,
      isAutoLogOut,
      menuData,
      setMenuData,
      host,
      setHost,
      wpoClientName,
      setWpoClientName,
      hideChat,
      setHideChat,
      headerInfo,
      setHeaderInfo,
      homeData,
      setHomeData,
      metrics,
    };
  }, [
    loggedIn,
    serviceProvider,
    navigateScreen,
    navigationHandler,
    client,
    notificationCount,
    deviceToken,
    pushNotificationPayload,
    userProfileData,
    memberAppointmentStatus,
    chatConfig,
    immediateAssistanceContact,
    genesysChat,
    assessmentsSurveyId,
    isAutoLogOut,
    menuData,
    host,
    wpoClientName,
    hideChat,
    headerInfo,
    homeData,
    metrics,
  ]);

  return (
    <>
      <AppContext.Provider value={context}>{children}</AppContext.Provider>
    </>
  );
};
