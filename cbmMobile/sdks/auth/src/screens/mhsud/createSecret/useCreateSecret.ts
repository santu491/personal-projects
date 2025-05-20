// import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { AccountSetUpData } from '../../../models/signUp';
import { getMhsudPasswordValidationItems, PASSWORD_VALIDATION_MESSAGES } from '../../../utils/passwordValidationSchema';
export const useCreateSecret = () => {
  const { control, formState, getValues, trigger } = useForm<AccountSetUpData>({
    mode: 'onChange',
    defaultValues: {
      //   secret: userContext.userSignUpData?.secret ?? '',

      //   reEnterSecret: userContext.userSignUpData?.reEnterSecret ?? '',
      secret: '',

      reEnterSecret: '',
    },
    // resolver: yupResolver(accountValidationSchema),
  });

  const password = getValues().secret;
  console.log('password...', password);

  const validationItems = useMemo(() => {
    return getMhsudPasswordValidationItems(PASSWORD_VALIDATION_MESSAGES, password);
  }, [password]);

  const passwordValidationDropdownItems = useMemo(() => {
    return validationItems;
  }, [validationItems]);
  return {
    control,
    formState,
    getValues,
    trigger,
    validationItems,
    passwordValidationDropdownItems,
  };
};
