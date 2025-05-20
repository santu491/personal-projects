import * as yup from 'yup';

export const getProfileCorrectionValidationSchema = () => {
  return {
    profileCorrectionValidationSchema: yup.object().shape({
      emailAddress: yup
        .string()
        .test(
          'is-valid-email',
          'Email address entered is not valid. Please enter a valid email address.',
          (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ),
      firstName: yup
        .string()
        .matches(/^[a-zA-Z0-9 #.,/:-]*$/, 'no special characters allowed')
        .matches(/^[^\d]*$/, 'Should have only alphabets'),
    }),
  };
};
