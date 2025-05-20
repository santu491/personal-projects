import React from 'react';
import { useTranslation } from 'react-i18next';

import { EapBenefitsComponent } from '../../components/eapBenefits/eapBenefitsComponent';
import { APP_IMAGES } from '../../constants/images';
import { useClientContext } from '../../context/client.sdkContext';
import { Screen } from '../../navigation/client.navigationTypes';

export const WellnessContent = () => {
  const { t } = useTranslation();
  const { navigation } = useClientContext();

  const onHandleNextButtonClick = () => {
    navigation.navigate(Screen.CLIENT_SEARCH, { showHeaderBackIcon: false });
  };

  const onHandleSkipButtonClick = () => {
    navigation.navigate(Screen.CLIENT_SEARCH, { showHeaderBackIcon: false });
  };

  return (
    <EapBenefitsComponent
      description={t('eapBenefits.wellnessContent.description')}
      imageSource={APP_IMAGES.WELLNESS_CONTENT}
      onPressNextButton={onHandleNextButtonClick}
      progressStepsCount={2}
      title={t('eapBenefits.wellnessContent.title')}
      onPressSkipButton={onHandleSkipButtonClick}
    />
  );
};
