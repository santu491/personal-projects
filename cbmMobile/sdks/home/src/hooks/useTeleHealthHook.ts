import { useTranslation } from 'react-i18next';

import { RE_DIRECT_URL_API_TYPE } from '../config/constants/home';

export const useTeleHealthHook = () => {
  const { t } = useTranslation();
  const teleHealthInPersonData = [
    {
      buttonText: t('home.getStarted'),
      title: t('home.teleHealth.searchCounselors'),
      description: t('home.teleHealth.searchCounselorsDescription'),
      icon: 'SearchCounselorsIcon',
      redirectUrl: `page:${RE_DIRECT_URL_API_TYPE.PROVIDERS_FIND_COUNSELOR}`,
      openURLInNewTab: false,
    },
  ];
  return {
    teleHealthInPersonData,
  };
};
