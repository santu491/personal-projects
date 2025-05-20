import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { MEMBER_DISABLED } from '../../constants/constants';
import { useUserContext } from '../../context/auth.sdkContext';
import { AccountSetUpData, lookUpResponseDTO } from '../../models/signUp';
import { Screen } from '../../navigation/auth.navigationTypes';
import { getAccountValidationSchema } from '../../utils/accountSetUpValidationSchema';

export const useAccountSetUp = () => {
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [isMemberDisabled, setMemberDisabled] = useState(false);

  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const userContext = useUserContext();
  const { navigation } = userContext;

  const { accountValidationSchema } = getAccountValidationSchema(userName);

  const navigateToSignUpScreen = () => {
    navigation.navigate(Screen.LOGIN);
  };

  const handlePreviousButton = () => {
    if (userContext.userSignUpData) {
      userContext.setUserSignUpData({
        ...userContext.userSignUpData,
        ...getValues(),
      });
    }
    navigation.goBack();
  };

  const { control, formState, getValues, trigger } = useForm<AccountSetUpData>({
    mode: 'onChange',
    defaultValues: {
      email: userContext.userSignUpData?.email ?? '',
      secret: userContext.userSignUpData?.secret ?? '',
      phoneNumber: userContext.userSignUpData?.phoneNumber ?? '',
      reEnterSecret: userContext.userSignUpData?.reEnterSecret ?? '',
      voiceEmail: userContext.userSignUpData?.voiceEmail ?? undefined,
    },
    resolver: yupResolver(accountValidationSchema),
  });

  const checkIfEmailAlreadyExists = async () => {
    try {
      setLoading(true);
      const clientUrl = `${API_ENDPOINTS.MEMBER_CHECK}`;
      const headers = { userName: getValues().email };
      const response: lookUpResponseDTO = await userContext.serviceProvider.callService(
        clientUrl,
        RequestMethod.GET,
        null,
        headers
      );
      if (response.data.message === MEMBER_DISABLED) {
        setMemberDisabled(true);
      }
      setLoading(false);
      setIsEmailExist(true);
    } catch (error) {
      setLoading(false);
      setIsEmailExist(false);
    }
  };

  const setEmail = (email: string, invalid: boolean) => {
    setUserName(email);
    if (!invalid) {
      checkIfEmailAlreadyExists();
    }
  };

  const handleContinueButton = () => {
    if (userContext.userSignUpData) {
      userContext.setUserSignUpData({
        ...userContext.userSignUpData,
        ...getValues(),
      });
    }
    navigation.navigate(Screen.CONFIRM_STATUS);
  };

  useEffect(() => {
    // triggers validation on render so continue is disabled properly
    trigger();
  }, [trigger]);

  return {
    control,
    formState,
    getValues,
    handleContinueButton,
    handlePreviousButton,
    isEmailExist,
    navigateToSignUpScreen,
    trigger,
    setEmail,
    loading,
    isMemberDisabled,
  };
};
