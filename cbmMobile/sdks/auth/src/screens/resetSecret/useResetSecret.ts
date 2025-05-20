import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { API_ENDPOINTS, APP_CONTENT } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { useUserContext } from '../../context/auth.sdkContext';
import { ResetSecret } from '../../models/signUp';
import { Screen } from '../../navigation/auth.navigationTypes';
import { getSecretRecoveryValidationSchema } from '../../utils/secretRecoveryValidationSchema';

export const useResetSecret = () => {
  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const userContext = useUserContext();
  const { navigation } = userContext;

  const { secretRecoveryValidationSchema } = getSecretRecoveryValidationSchema();

  const { control, formState, getValues, trigger } = useForm<ResetSecret>({
    mode: 'onChange',
    defaultValues: {
      secret: '',
      reEnterSecret: '',
    },
    resolver: yupResolver(secretRecoveryValidationSchema),
  });

  const resetSecretApi = async () => {
    setLoading(true);
    try {
      const headers = {
        cookie: `${userContext.forgotSecretCookie}`,
      };
      const payload = {
        newPassword: getValues().secret,
        userName: userContext.mfaData?.userName ?? '',
      };
      await userContext.serviceProvider.callService(API_ENDPOINTS.CHANGE_SECRET, RequestMethod.PUT, payload, headers);
      setLoading(false);
      setModelVisible(true);
    } catch (error) {
      setLoading(false);
      setModelVisible(false);
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  };

  const onPressSuccessAlertButton = () => {
    setModelVisible(false);
    navigation.navigate(Screen.LOGIN);
  };

  const handlePreviousButton = () => {
    navigation.navigate(Screen.VERIFY_PERSONAL_DETAILS);
  };

  const handleContinueButton = () => {
    resetSecretApi();
  };

  return {
    handleContinueButton,
    secretRecoveryValidationSchema,
    loading,
    control,
    formState,
    setLoading,
    getValues,
    trigger,
    handlePreviousButton,
    userContext,
    modelVisible,
    onPressSuccessAlertButton,
  };
};
