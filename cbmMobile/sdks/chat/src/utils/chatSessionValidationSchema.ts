import * as yup from 'yup';

export const getChatSessionValidationSchema = () => {
  return {
    chatSessionValidationSchema: yup.object().shape({
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
      phone: yup
        .string()
        .required('Phone Number cannot be blank')
        .min(10, 'Phone number cannot be less than 10 digits.'),
    }),
  };
};
