import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppointmentContext } from '../../context/appointments.sdkContext';

export const useClinicalQuestionnaireDetails = () => {
  const { t } = useTranslation();
  const appointmentContext = useAppointmentContext();
  const { selectedProviders } = appointmentContext;
  const clinicalInfo = selectedProviders?.[0]?.clinicalQuestions?.questionnaire[0];

  const clinicalQuestionnaireDetails = useMemo(
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

  return {
    clinicalQuestionnaireDetails,
    clinicalInfo,
  };
};
