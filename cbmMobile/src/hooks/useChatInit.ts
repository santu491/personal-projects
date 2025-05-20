import { useState } from 'react';

import { ChatResponseDTO, ChatSession, ChatSessionResponseDataDTO } from '../../sdks/chat/src/model/chat';
import { AppUrl } from '../../shared/src/models';
import { API_ENDPOINTS } from '../config';
import { ExperienceType, Language } from '../config/apiEndpoints';
import { SourceType } from '../constants/constants';
import { useAppContext } from '../context/appContext';
import { RequestMethod } from '../models/adapters';

export const useChatInit = () => {
  const context = useAppContext();
  const { navigationHandler, setChatConfig, chatConfig, client } = context;
  const [loading, setLoading] = useState(false);

  const getLob = () => {
    return context.client?.source === SourceType.MHSUD
      ? `${context.userProfileData?.clientName ?? ''}_mh_${context.loggedIn ? 'lg' : 'nlg'}`
      : (context.userProfileData?.clientName ?? '');
  };

  const checkChatAvailability = async () => {
    try {
      const chatUrl = `/${context.loggedIn ? ExperienceType.SECURE : ExperienceType.PUBLIC}/${client?.source}/${Language.EN}/${context.client?.clientUri}${API_ENDPOINTS.CHAT_AVAILABILITY}`;

      setLoading(true);
      const response: ChatResponseDTO = await context.serviceProvider.callService(
        chatUrl,
        RequestMethod.GET,
        null,
        context.loggedIn
          ? {
              isSecureToken: true,
            }
          : {}
      );

      setLoading(false);
      const { isChatFlowEnabled, config } = response.data;
      const [environment, deploymentId, url] = config ? config.split('|') : [];
      setChatConfig({ environment, deploymentId, url, isChatFlowEnabled });
      if (isChatFlowEnabled && context.loggedIn && context.userProfileData) {
        startChatSession({
          firstName: context.userProfileData.firstName,
          lastName: context.userProfileData.lastName,
          email: context.userProfileData.emailAddress,
          phone: context.userProfileData.communication.mobileNumber || '',
          lob: getLob(),
        });
      } else {
        navigateToChat();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const startChatSession = async (sessionData: ChatSession) => {
    setLoading(true);
    try {
      const chatUrl = `/${context.loggedIn ? ExperienceType.SECURE : ExperienceType.PUBLIC}/${client?.source}/${Language.EN}/${context.client?.clientUri}${API_ENDPOINTS.CHAT_SESSION}`;
      const response: ChatSessionResponseDataDTO = await context.serviceProvider.callService(
        chatUrl,
        RequestMethod.POST,
        sessionData,
        context.loggedIn
          ? {
              isSecureToken: true,
            }
          : {}
      );
      setLoading(false);
      if (chatConfig) {
        setChatConfig({ ...chatConfig, key: response.data.key });
      }

      navigationHandler.linkTo({ action: AppUrl.CHAT });
    } catch (error) {
      setLoading(false);
      return undefined;
    }
  };

  const navigateToChat = () => {
    navigationHandler.linkTo({ action: AppUrl.START_CHAT });
  };

  return {
    checkChatAvailability,
    startChatSession,
    loading,
  };
};
