import { useTranslation } from 'react-i18next';

import { APP_IMAGES } from '../../../../shared/src/context/appImages';
import { ASSESSMENTS, INSIGHTS, MONTHLY_RESOURCES, NEWS, TOPICS } from '../config/constants/constants';

export const useWellbeingInfo = () => {
  const { t } = useTranslation();
  const welllbeingData = [
    {
      label: t('wellbeing.topics'),
      action: {
        screenName: TOPICS,
        imagePath: APP_IMAGES.WELLNESS_TOPICS,
      },
    },
    {
      label: t('wellbeing.assessments'),
      action: {
        screenName: ASSESSMENTS,
        imagePath: APP_IMAGES.WELLNESS_ASSESSMENTS,
      },
    },
    {
      label: t('wellbeing.resources'),
      action: {
        screenName: MONTHLY_RESOURCES,
        imagePath: APP_IMAGES.WELLNESS_MONTHLY_RESOURCES,
      },
    },
    {
      label: t('wellbeing.news'),
      action: {
        screenName: NEWS,
        imagePath: APP_IMAGES.WELLNESS_NEWS,
      },
    },
    {
      label: t('wellbeing.insights'),
      action: {
        screenName: INSIGHTS,
        imagePath: APP_IMAGES.WELLNESS_INSIGHTS,
      },
    },
  ];
  return {
    welllbeingData,
  };
};
