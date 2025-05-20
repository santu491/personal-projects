import * as yup from 'yup';

export const getCreateAccountValidationSchema = () => {
  return {
    personalInfoValidationSchema: yup.object().shape({
      dateOfBirth: yup.date().required('date of birth is required'),
      firstName: yup
        .string()
        .required('First name cannot be blank')
        .matches(/^[a-zA-Z]*$/, 'First name should not contain any special characters or numbers.')
        .min(2, 'First name length should be within 2 and 256 characters')
        .max(256, 'First name length should be within 2 and 256 characters')
        .matches(/^[^\d]*$/, 'First name should not contain any special characters or numbers.'),
      memberId: yup
        .string()
        .required('Member ID cannot be blank')
        .matches(/^[a-zA-Z0-9]*$/, 'Member ID should not contain spaces or special characters')
        .min(2, 'Member ID length should be within 2 and 15 characters')
        .max(15, 'Member ID length should be within 2 and 15 characters'),
      lastName: yup
        .string()
        .required('Last name cannot be blank')
        .matches(/^[a-zA-Z]*$/, 'Last name should not contain any special characters or numbers.')
        .min(2, 'Last name length should be within 2 and 256 characters')
        .max(256, 'Last name length should be within 2 and 256 characters')
        .matches(/^[^\d]*$/, 'Last name should not contain any special characters or numbers.'),
      emailAddress: yup
        .string()
        .required('Email is required')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address format')
        .min(2, 'Should have min 2 to max 45 characters')
        .max(45, 'Should have min 2 to max 45 characters'),
      confirmEmailAddress: yup
        .string()
        .required('Confirm email is required')
        .oneOf([yup.ref('emailAddress')], 'Email addresses do not match'), // Added match validation
      phoneNumber: yup
        .string()
        .required('Phone number cannot be blank') // Corrected error message
        .matches(/^\+1\s?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/, 'Incorrect phone number format'),
      phoneExtension: yup.string(),
    }),
  };
};
