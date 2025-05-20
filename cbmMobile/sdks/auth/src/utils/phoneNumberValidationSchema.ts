import * as yup from 'yup';

export const getPhoneNumberValidationSchema = () => {
  return {
    getPhoneNumberSchema: yup.object().shape({
      phoneNumber: yup
        .string()
        .required('Phone Number cannot be blank')
        .min(10, 'Phone number cannot be less than 10 digits.'),
    }),
  };
};
