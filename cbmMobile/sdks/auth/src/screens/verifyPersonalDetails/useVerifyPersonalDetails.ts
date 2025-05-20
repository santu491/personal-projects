import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ErrorInfoDTO, getErrorMessage, isNetworkError } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { FlowName } from '../../config/constants/auth';
import { BUSINESS_UINT } from '../../constants/constants';
import { useUserContext } from '../../context/auth.sdkContext';
import { ForgotUserNameResponseDTO } from '../../models/forgotUserName';
import { VerifyPersonalDetails } from '../../models/signUp';
import { Screen } from '../../navigation/auth.navigationTypes';
import { getVerifyPersonalDetailsValidationSchema } from '../../utils/verifyPersonalDetailsValidationSchema';

export const useVerifyPersonalDetails = () => {
  const userContext = useUserContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>();
  const [isShownErrorAlert, setIsShownErrorAlert] = useState(false); // State for API errors

  const { mfaData, navigation } = userContext;
  const flowName = mfaData?.flowName;

  const dateOfBirthMaxDate = useMemo(() => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);
    return currentDate;
  }, []);

  const { verifyPersonalDetailsValidationSchema } = getVerifyPersonalDetailsValidationSchema();

  const { control, formState, getValues } = useForm<VerifyPersonalDetails>({
    mode: 'onChange',
    defaultValues: {
      dateOfBirth: undefined,
      email: '',
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(verifyPersonalDetailsValidationSchema),
  });

  const handleContinueButton = async () => {
    const personalDetails = {
      firstName: getValues().firstName,
      lastName: getValues().lastName,
      dob: moment(getValues().dateOfBirth).format('MM/DD/YYYY'),
      emailAddress: getValues().email,
      bu: BUSINESS_UINT,
    };
    try {
      setLoading(true);
      const response: ForgotUserNameResponseDTO = await userContext.serviceProvider.callService(
        flowName === FlowName.FORGOT_SECRET ? API_ENDPOINTS.FORGOT_SECRET : API_ENDPOINTS.FORGOT_USER_NAME,
        RequestMethod.POST,
        personalDetails
      );

      const forgotUserNameResponse = response.data;
      setLoading(false);
      const registerMfaData = {
        flowName: flowName === FlowName.FORGOT_SECRET ? FlowName.FORGOT_SECRET : FlowName.FORGOT_USER_NAME,
        isEmailVerified: forgotUserNameResponse.isEmailVerified,
        pingRiskId: forgotUserNameResponse.pingRiskId,
        userName: getValues().email,
      };
      userContext.setMfaData({ ...registerMfaData });
      navigation.navigate(Screen.SELECT_MFA_OPTIONS);
    } catch (error) {
      setLoading(false);
      const errorResponse = getErrorMessage(error as ErrorInfoDTO);
      if (!isNetworkError(errorResponse.status)) {
        setApiError(t('verifyPersonalDetails.forgotUserNameError'));
      } else {
        setApiError(t('authErrors.loginUserText'));
      }
      setIsShownErrorAlert(true);
    }
  };

  const updateApiError = () => {
    if (apiError) {
      setApiError(undefined);
    }
  };

  const onPressErrorAlert = () => {
    setIsShownErrorAlert(false);
  };

  return {
    dateOfBirthMaxDate,
    control,
    formState,
    handleContinueButton,
    loading,
    flowName,
    apiError,
    updateApiError,
    onPressErrorAlert,
    isShownErrorAlert,
  };
};
