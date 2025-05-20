import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { callNumber } from '../../../../../shared/src/utils/utils';
import { SourceType } from '../../../../../src/constants/constants';
import { useAppContext } from '../../../../../src/context/appContext';
import { useChatInit } from '../../../../../src/hooks/useChatInit';
import { useChatContext } from '../../context/chat.sdkContext';
import { ChatData } from '../../model/chat';
import { getChatSessionValidationSchema } from '../../utils/chatSessionValidationSchema';

export const useStartChat = () => {
  const { t } = useTranslation();
  const { chatConfig, client, genesysChat } = useChatContext();
  const { startChatSession, loading } = useChatInit();
  const context = useAppContext();
  const { chatSessionValidationSchema } = getChatSessionValidationSchema();

  const { control, formState, getValues } = useForm<ChatData>({
    mode: 'onChange',
    defaultValues: {
      phone: '',
      email: '',
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(chatSessionValidationSchema),
  });

  const getLob = () => {
    return client?.source === SourceType.MHSUD
      ? `${client.clientUri}_mh_${context.loggedIn ? 'lg' : 'nlg'}`
      : client?.clientUri;
  };

  const onStartChatButtonClick = async () => {
    const chatSessionDetails = {
      firstName: getValues().firstName,
      lastName: getValues().lastName,
      email: getValues().email,
      phone: getValues().phone,
      lob: getLob() || '',
    };
    await startChatSession(chatSessionDetails);
  };

  const phoneNumberTapped = () => {
    if (client?.supportNumber) {
      callNumber(client.supportNumber);
    }
  };

  return {
    loading,
    t,
    control,
    formState,
    onStartChatButtonClick,
    phoneNumberTapped,
    isChatFlowEnabled: chatConfig?.isChatFlowEnabled,
    genesysChat,
  };
};
