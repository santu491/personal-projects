import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { useUserContext } from '../../../context/auth.sdkContext';
import {
  MhsudSignUpData,
  MhsudSignupRequest,
  MhsudSignupResponseDTO,
  PersonalInformationMhsud,
} from '../../../models/signUp';
import { getCreateAccountValidationSchema } from './getCreateAccountValidationSchema';

export const useCreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVerifyEmailPopupVisible, setIsVerifyEmailPopupVisible] = useState(false);
  const [isResendVerificationPopupVisible, setIsResendVerificationPopupVisible] = useState(false);
  const userContext = useUserContext();

  const dateOfBirthMaxDate = useMemo(() => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    return currentDate;
  }, []);

  useEffect(() => {
    userContext.setMhsudUserSignUpData(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { personalInfoValidationSchema } = getCreateAccountValidationSchema();

  const { control, formState, getValues } = useForm<PersonalInformationMhsud>({
    mode: 'onChange',
    defaultValues: {
      dateOfBirth: userContext.mhsudUserSignUpData?.dateOfBirth ?? undefined,
      firstName: userContext.mhsudUserSignUpData?.firstName ?? '',
      memberId: userContext.mhsudUserSignUpData?.memberId ?? '',
      lastName: userContext.mhsudUserSignUpData?.lastName ?? '',
      emailAddress: userContext.mhsudUserSignUpData?.emailAddress ?? '',
      confirmEmailAddress: userContext.mhsudUserSignUpData?.confirmEmailAddress ?? '',
      phoneNumber: userContext.mhsudUserSignUpData?.phoneNumber ?? '',
      phoneExtension: userContext.mhsudUserSignUpData?.phoneExtension ?? '',
      notificationCheckBox: userContext.mhsudUserSignUpData?.notificationCheckBox ?? true,
    },
    resolver: yupResolver(personalInfoValidationSchema),
  });

  const handleContinueButton = async () => {
    const context = {} as MhsudSignUpData;
    const data = userContext.mhsudUserSignUpData
      ? { ...userContext.mhsudUserSignUpData, accept: isChecked }
      : { ...context, accept: isChecked };
    userContext.setMhsudUserSignUpData(data);
    setIsLoading(true);
    const isSuccess = await verifyEmail();
    setIsLoading(false);
    if (!isSuccess) {
      setIsVerifyEmailPopupVisible(true);
    } else {
      setIsError(true);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const onCloseVerifyEmailPopup = () => {
    setIsVerifyEmailPopupVisible(false);
    setIsResendVerificationPopupVisible(false);
  };

  const onPressResendVerification = async () => {
    setIsVerifyEmailPopupVisible(false);
    setIsLoading(true);
    await verifyEmail();
    setIsLoading(false);
    setIsResendVerificationPopupVisible(true);
  };

  const verifyEmail = async () => {
    if (userContext.client?.clientUri) {
      const user: MhsudSignupRequest = {
        clientUri: userContext.client.clientUri,
        firstName: getValues().firstName,
        lastName: getValues().lastName,
        email: getValues().emailAddress,
        confirmEmail: getValues().confirmEmailAddress,
        dateOfBirth: moment(getValues().dateOfBirth).format('YYYY-MM-DD'),
        memberId: getValues().memberId,
        phone: getValues().phoneNumber.replace(/\D/g, '').slice(1), // Remove non-numeric characters
        phoneExt: getValues().phoneExtension,
        messageCenterOptIn: getValues().notificationCheckBox,
      };

      const response: MhsudSignupResponseDTO = await userContext.serviceProvider.callService(
        API_ENDPOINTS.REGISTRATION,
        RequestMethod.POST,
        user,
        { source: userContext.client.source ?? '' }
      );
      return response.status === 'success';
    }
  };

  const onCloseError = () => {
    setIsError(false);
  };

  return {
    control,
    formState,
    dateOfBirthMaxDate,
    handleContinueButton,
    isChecked,
    handleCheckboxChange,
    onCloseVerifyEmailPopup,
    onPressResendVerification,
    isVerifyEmailPopupVisible,
    isResendVerificationPopupVisible,
    isLoading,
    onCloseError,
    isError,
  };
};
