import React from 'react';
import { useTranslation } from 'react-i18next';

import { EapBenefitsComponent } from '../../components/eapBenefits/eapBenefitsComponent';
import { APP_IMAGES } from '../../constants/images';
import { useClientContext } from '../../context/client.sdkContext';
import { Screen } from '../../navigation/client.navigationTypes';

export const EapBenefits = () => {
  const { t } = useTranslation();
  const { navigation } = useClientContext();

  const onHandleNextButtonClick = () => {
    navigation.navigate(Screen.HEALTH_COUNSELOR);
  };

  const onHandleSkipButtonClick = () => {
    navigation.navigate(Screen.CLIENT_SEARCH, { showHeaderBackIcon: false });
  };

  return (
    <EapBenefitsComponent
      description={t('eapBenefits.benefits.description')}
      imageSource={APP_IMAGES.EAP_BENEFITS}
      onPressNextButton={onHandleNextButtonClick}
      progressStepsCount={0}
      title={t('eapBenefits.benefits.title')}
      onPressSkipButton={onHandleSkipButtonClick}
    />
  );
};
