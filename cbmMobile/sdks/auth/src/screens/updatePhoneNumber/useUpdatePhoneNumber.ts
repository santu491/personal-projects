import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppUrl } from '../../../../../shared/src/models';
import { ErrorInfoDTO, getErrorMessage } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../src/models/adapters';
import { useUserContext } from '../../context/auth.sdkContext';
import { UpdatePhoneNumber } from '../../models/signUp';
import { getPhoneNumberValidationSchema } from '../../utils/phoneNumberValidationSchema';

export const useUpdatePhoneNumber = () => {
  const userContext = useUserContext();
  const { navigation, navigationHandler } = userContext;
  const { setUserProfileData } = useAppContext();

  const { getPhoneNumberSchema } = getPhoneNumberValidationSchema();

  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [phoneNumberUpdateError, setPhoneNumberUpdateError] = useState<string | undefined>();

  const { control, formState, getValues } = useForm<UpdatePhoneNumber>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
    },
    resolver: yupResolver(getPhoneNumberSchema),
  });

  const updatePhoneNumberApi = async () => {
    setLoading(true);
    try {
      const communication = {
        mobileNumber: `+1${getValues().phoneNumber}`,
        consent: userContext.userProfileData?.communication.consent ?? false,
      };
      const payload = {
        employerType: userContext.userProfileData?.employerType ?? '',
        communication,
      };

      await userContext.serviceProvider.callService(API_ENDPOINTS.UPDATE_PHONE_NUMBER, RequestMethod.PUT, payload, {
        isSecureToken: true,
      });
      setLoading(false);
      setModelVisible(true);
      if (userContext.userProfileData) {
        setUserProfileData({ ...userContext.userProfileData, ...{ communication } });
      }
    } catch (error) {
      setLoading(false);
      setModelVisible(false);
      const errorResponse = getErrorMessage(error as ErrorInfoDTO);
      setPhoneNumberUpdateError(errorResponse.message);
    }
  };

  const updatePhoneNumberError = () => {
    setPhoneNumberUpdateError(undefined);
  };

  const onPressSuccessAlertButton = () => {
    setModelVisible(false);
    navigationHandler.linkTo({ action: AppUrl.PROFILE });
  };

  const handleContinueButton = () => {
    updatePhoneNumberApi();
  };

  const handlePreviousButton = () => {
    navigation.goBack();
  };

  return {
    handleContinueButton,
    handlePreviousButton,
    getPhoneNumberSchema,
    loading,
    control,
    formState,
    setLoading,
    modelVisible,
    onPressSuccessAlertButton,
    phoneNumberUpdateError,
    setPhoneNumberUpdateError,
    updatePhoneNumberError,
  };
};
