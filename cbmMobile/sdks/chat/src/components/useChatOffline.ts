import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../shared/src/models';
import { callNumber } from '../../../../shared/src/utils/utils';
import { useChatContext } from '../context/chat.sdkContext';

export const useChatOffline = () => {
  const { t } = useTranslation();
  const { navigationHandler, client, genesysChat } = useChatContext();

  const naviagteToHomeScreen = () => {
    navigationHandler.linkTo({ action: AppUrl.HOME_SDK });
  };

  const phoneNumberTapped = () => {
    if (client?.supportNumber) {
      callNumber(client.supportNumber);
    }
  };

  return {
    supportNumber: client?.supportNumber,
    phoneNumberTapped,
    naviagteToHomeScreen,
    genesysChat,
    t,
  };
};
