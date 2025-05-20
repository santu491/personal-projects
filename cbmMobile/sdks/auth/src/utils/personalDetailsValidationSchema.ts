import * as yup from 'yup';

export const getPersonalDetailsValidationSchema = () => {
  return {
    personalDetailsValidationSchema: yup.object().shape({
      addressLineOne: yup.string().required('Address line 1 cannot be blank'),
      city: yup
        .string()
        .matches(/^[a-zA-Z0-9 #.,/:-]*$/, 'no special characters allowed')
        .required('City cannot be blank'),
      dateOfBirth: yup.date().required('date of birth is required'),
      firstName: yup
        .string()
        .required('First name cannot be blank')
        .matches(/^[a-zA-Z0-9 #.,/:-]*$/, 'no special characters allowed')
        .min(2, 'Should have min 2 to max 45 characters')
        .max(45, 'Should have min 2 to max 45 characters')
        .matches(/^[^\d]*$/, 'Should have only alphabets'),
      gender: yup.string().required('gender cannot be blank'),
      lastName: yup
        .string()
        .required('Last name cannot be blank')
        .matches(/^[a-zA-Z0-9 #.,/:-]*$/, 'no special characters allowed')
        .min(2, 'Should have min 2 to max 45 characters')
        .max(45, 'Should have min 2 to max 45 characters')
        .matches(/^[^\d]*$/, 'Should have only alphabets'),
      relationshipStatus: yup.string().required('relationship status cannot be blank'),
      state: yup.string().required(),
      zipcode: yup
        .string()
        .required('zipcode cannot be blank')
        .matches(/(^\d{5}(?:[-\s]\d{4})?$)/, 'You have entered an invalid zipcode.'),
    }),
  };
};
