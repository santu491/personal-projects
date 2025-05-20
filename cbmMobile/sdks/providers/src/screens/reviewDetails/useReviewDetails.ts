import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../../shared/src/models';
import { useProviderContext } from '../../context/provider.sdkContext';
import { Screen } from '../../navigation/providers.navigationTypes';

export const useReviewDetails = () => {
  const { t } = useTranslation();
  const context = useProviderContext();
  const { scheduleAppointmentInfo, navigation, navigationHandler } = context;
  const clinicalInfo = scheduleAppointmentInfo?.clinicalQuestions?.questionnaire[0];

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const reviewDetails = useMemo(
    () => [
      {
        question: t('appointment.clinicalQuestionnaire.problem'),
        answer: clinicalInfo?.presentingProblem,
      },
      {
        question: t('appointment.clinicalQuestionnaire.problemDescription'),
        answer: clinicalInfo?.answer,
      },
      {
        question: t('appointment.clinicalQuestionnaire.lessProductive'),
        answer: clinicalInfo?.lessProductivedays,
      },
      {
        question: t('appointment.clinicalQuestionnaire.jobMissedDays'),
        answer: clinicalInfo?.jobMissedDays,
      },
    ],
    [t, clinicalInfo]
  );

  const onPressContinue = () => {
    navigation.navigate(Screen.VIEW_COUNSELOR_SETTINGS);
  };

  const onPressCloseIcon = () => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  };

  return {
    reviewDetails,
    onPressContinue,
    onPressCloseIcon,
  };
};
