import * as yup from 'yup';

export const getLoginValidationSchema = () => {
  return {
    loginValidationSchema: yup.object().shape({
      email: yup
        .string()
        .required('Email cannot be blank')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Email address entered is not valid. Please enter a valid email address.'
        ),
      secret: yup.string().required('Password cannot be blank'),
    }),
  };
};
