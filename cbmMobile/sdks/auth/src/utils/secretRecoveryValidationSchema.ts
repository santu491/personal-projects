import * as yup from 'yup';

import { getPasswordValidationItems, PASSWORD_VALIDATION_MESSAGES } from './passwordValidationSchema';

export const getSecretRecoveryValidationSchema = (userName = '') => {
  return {
    secretRecoveryValidationSchema: yup.object().shape({
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
    }),
  };
};
