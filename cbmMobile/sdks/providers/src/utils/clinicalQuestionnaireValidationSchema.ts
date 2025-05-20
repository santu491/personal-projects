import * as yup from 'yup';

import { ClinicalQuestionnaireFields } from '../config/constants/constants';

export const getClinicalQuestionnaireValidationSchema = () => {
  return {
    clinicalQuestionnaireValidationSchema: yup.object().shape({
      [ClinicalQuestionnaireFields.PROBLEM]: yup.string().required(),
      [ClinicalQuestionnaireFields.LESS_PRODUCTIVE_DAYS]: yup
        .string()

        .required(),
      [ClinicalQuestionnaireFields.JOB_MISSED_DAYS]: yup.string().required(),
    }),
  };
};
