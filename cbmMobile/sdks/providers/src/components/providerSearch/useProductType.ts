import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface ProductType {
  id: string;
  label: string;
  value: string;
}

export const useProductType = () => {
  const { t } = useTranslation();

  const productTypes = useMemo(
    () => [
      {
        label: t('providers.productType.mhsud'),
        id: t('providers.productType.mhsud'),
        value: t('providers.productType.mhsud'),
      },
      {
        label: t('providers.productType.eap'),
        id: t('providers.productType.eap'),
        value: t('providers.productType.eap'),
      },
      {
        label: t('providers.productType.both'),
        id: t('providers.productType.both'),
        value: t('providers.productType.both'),
      },
    ],
    [t]
  );
  return {
    productTypes,
  };
};
