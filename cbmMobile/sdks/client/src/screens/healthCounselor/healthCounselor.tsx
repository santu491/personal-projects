import React from 'react';
import { useTranslation } from 'react-i18next';

import { EapBenefitsComponent } from '../../components/eapBenefits/eapBenefitsComponent';
import { APP_IMAGES } from '../../constants/images';
import { useClientContext } from '../../context/client.sdkContext';
import { Screen } from '../../navigation/client.navigationTypes';

export const HealthCounselor = () => {
  const { t } = useTranslation();
  const { navigation } = useClientContext();

  const onHandleNextButtonClick = () => {
    navigation.navigate(Screen.WELLNESS_CONTENT);
  };

  const onHandleSkipButtonClick = () => {
    navigation.navigate(Screen.CLIENT_SEARCH, { showHeaderBackIcon: false });
  };

  return (
    <EapBenefitsComponent
      description={t('eapBenefits.healthCounselor.description')}
      imageSource={APP_IMAGES.HEALTH_COUNSELOR}
      onPressNextButton={onHandleNextButtonClick}
      progressStepsCount={1}
      title={t('eapBenefits.healthCounselor.title')}
      onPressSkipButton={onHandleSkipButtonClick}
    />
  );
};
