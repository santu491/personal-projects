import * as yup from 'yup';

import { getPasswordValidationItems, PASSWORD_VALIDATION_MESSAGES } from './passwordValidationSchema';

export const getAccountValidationSchema = (userName = '') => {
  return {
    accountValidationSchema: yup.object().shape({
      phoneNumber: yup
        .string()
        .required('Phone Number cannot be blank')
        .min(10, 'Phone number cannot be less than 10 digits.'),
      email: yup
        .string()
        .required('Email cannot be blank')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Email address entered is not valid. Please enter a valid email address.'
        ),
      secret: yup
        .string()
        .required('Password cannot be blank')
        .test(
          'new-password-validations',
          'The password you have entered does not match the minimum requirements listed below',
          function (value) {
            return getPasswordValidationItems(PASSWORD_VALIDATION_MESSAGES, value, userName).every(
              (item) => item.valid
            );
          }
        ),
      reEnterSecret: yup
        .string()
        .required('Re enter password cannot be blank')
        .test('passwords-match', 'The passwords do not match. Please try again.', function (value) {
          return this.parent.secret === value;
        }),
      voiceEmail: yup.bool().required(),
    }),
  };
};
