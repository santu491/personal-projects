import * as yup from 'yup';

export const getVerifyPersonalDetailsValidationSchema = () => {
  return {
    verifyPersonalDetailsValidationSchema: yup.object().shape({
      dateOfBirth: yup.date().required('date of birth is required'),
      email: yup
        .string()
        .required('Email cannot be blank')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Email address entered is not valid. Please enter a valid email address.'
        ),
      firstName: yup
        .string()
        .required('First name cannot be blank')
        .matches(/^[a-zA-Z0-9 #.,/:-]*$/, 'no special characters allowed')
        .min(2, 'Should have min 2 to max 45 characters')
        .max(45, 'Should have min 2 to max 45 characters')
        .matches(/^[^\d]*$/, 'Should have only alphabets'),
      lastName: yup
        .string()
        .required('Last name cannot be blank')
        .matches(/^[a-zA-Z0-9 #.,/:-]*$/, 'no special characters allowed')
        .min(2, 'Should have min 2 to max 45 characters')
        .max(45, 'Should have min 2 to max 45 characters')
        .matches(/^[^\d]*$/, 'Should have only alphabets'),
    }),
  };
};
