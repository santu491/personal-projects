import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useUserContext } from '../../context/auth.sdkContext';
import { PersonalDetails, SignUpData } from '../../models/signUp';
import { Screen } from '../../navigation/auth.navigationTypes';
import { getPersonalDetailsValidationSchema } from '../../utils/personalDetailsValidationSchema';

export const usePersonalDetails = () => {
  const userContext = useUserContext();
  const { navigation } = userContext;

  const dateOfBirthMaxDate = useMemo(() => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);
    return currentDate;
  }, []);

  const { personalDetailsValidationSchema } = getPersonalDetailsValidationSchema();

  const navigateToSignUpScreen = () => {
    navigation.navigate(Screen.LOGIN);
  };

  const { control, formState, getValues } = useForm<PersonalDetails>({
    mode: 'onChange',
    defaultValues: {
      addressLineOne: userContext.userSignUpData?.addressLineOne ?? '',
      addressLineTwo: userContext.userSignUpData?.addressLineTwo ?? '',
      city: userContext.userSignUpData?.city ?? '',
      dateOfBirth: userContext.userSignUpData?.dateOfBirth ?? undefined,
      firstName: userContext.userSignUpData?.firstName ?? '',
      gender: userContext.userSignUpData?.gender ?? '',
      lastName: userContext.userSignUpData?.lastName ?? '',
      relationshipStatus: userContext.userSignUpData?.relationshipStatus ?? '',
      state: userContext.userSignUpData?.state ?? '',
      zipcode: userContext.userSignUpData?.zipcode ?? '',
    },
    resolver: yupResolver(personalDetailsValidationSchema),
  });

  const handleContinueButton = () => {
    const context = {} as SignUpData;
    const data = userContext.userSignUpData
      ? { ...userContext.userSignUpData, ...getValues() }
      : { ...getValues(), ...context };
    userContext.setUserSignUpData(data);
    navigation.navigate(Screen.ACCOUNT_SETUP);
  };

  return {
    navigateToSignUpScreen,
    handleContinueButton,
    control,
    formState,
    dateOfBirthMaxDate,
  };
};
