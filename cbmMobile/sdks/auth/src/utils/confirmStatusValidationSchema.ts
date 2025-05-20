import * as yup from 'yup';

export const getConfirmStatusValidationSchema = () => {
  return {
    confirmStatusValidationSchema: yup.object().shape({
      employeeStatus: yup.string().required('Employee status cannot be blank'),
      jobCategory: yup.string().required('Job Category cannot be blank'),
      subscriber: yup.string().required(),
      privacyPolicy: yup.bool().oneOf([true], ''),
      termsOfUse: yup.bool().oneOf([true], ''),
      statementOfUnderstanding: yup.bool().oneOf([true], ''),
    }),
  };
};
