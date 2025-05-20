import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useProviderContext } from '../../context/provider.sdkContext';
import { SearchProvider } from '../../model/providerSearchResponse';

export const useProviderListComponent = (providerInfo: SearchProvider) => {
  const { t } = useTranslation();
  const { selectedProviders } = useProviderContext();

  const findIndex: number = useMemo(() => {
    if (selectedProviders === undefined) {
      return -1;
    }
    return selectedProviders.findIndex((provider) => provider.providerId === providerInfo.providerId);
  }, [providerInfo.providerId, selectedProviders]);

  return {
    t,
    selectedProviders,
    findIndex,
  };
};
