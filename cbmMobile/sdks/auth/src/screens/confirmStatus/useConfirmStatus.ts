import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ErrorInfoDTO, getErrorMessage, isNetworkError } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS, ScreenNames } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { getClientDetails } from '../../../../../src/util/commonUtils';
import { Client } from '../../../../client/src/model/client';
import { FlowName, USER_NAME_EXISTS } from '../../config/constants/auth';
import { EMPLOYER_TYPE, STATES, USER_ROLE } from '../../constants/constants';
import { useUserContext } from '../../context/auth.sdkContext';
import { ConfirmStatus, RegistrationResponseDTO, SignUpRequestDTO, SignUpResponseDTO } from '../../models/signUp';
import { Screen } from '../../navigation/auth.navigationTypes';
import { getConfirmStatusValidationSchema } from '../../utils/confirmStatusValidationSchema';

export const useConfirmStatus = () => {
  const { t } = useTranslation();
  const userContext = useUserContext();
  const { navigation } = userContext;
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShownAlert, setIsShownAlert] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<undefined | string>(undefined);

  const { confirmStatusValidationSchema } = getConfirmStatusValidationSchema();

  const navigateToSignInScreen = () => {
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

  const navigateToPrivacyPolicy = () => {
    navigation.navigate(ScreenNames.PRIVACY_POLICY as never);
  };

  const navigateToTermsOfUse = () => {
    navigation.navigate(ScreenNames.TERMS_OF_USE as never);
  };

  const navigateToStatementOfUnderstanding = () => {
    navigation.navigate(ScreenNames.STATEMENT_OF_UNDERSTANDING as never);
  };

  const onAlertButonPress = () => {
    if (isSuccess) {
      setIsSuccess(false);
      navigation.navigate(Screen.SELECT_MFA_OPTIONS);
    }
    setIsShownAlert(false);
  };

  const { control, formState, getValues } = useForm<ConfirmStatus>({
    mode: 'onChange',
    defaultValues: {
      employeeStatus: userContext.userSignUpData?.employeeStatus ?? '',
      jobCategory: userContext.userSignUpData?.jobCategory ?? '',
      privacyPolicy: userContext.userSignUpData?.privacyPolicy ?? false,
      statementOfUnderstanding: userContext.userSignUpData?.statementOfUnderstanding ?? false,
      subscriber: userContext.userSignUpData?.subscriber ?? undefined,
      termsOfUse: userContext.userSignUpData?.termsOfUse ?? false,
    },
    resolver: yupResolver(confirmStatusValidationSchema),
  });

  const transformSignUpData = async () => {
    const signUpData = userContext.userSignUpData;
    const { employeeStatus, jobCategory, privacyPolicy, subscriber } = getValues();
    if (signUpData) {
      const clientDetails: Client | undefined = await getClientDetails();
      const user: SignUpRequestDTO = {
        address: {
          addressOne: signUpData.addressLineOne,
          addressTwo: signUpData.addressLineTwo,
          city: signUpData.city,
          state: STATES.find((state) => state.value === signUpData.state)?.label ?? '',
          stateCode: signUpData.state,
          zipcode: signUpData.zipcode,
        },
        clientGroupId: clientDetails.groupId,
        clientName: clientDetails.userName,
        communication: {
          consent: signUpData.voiceEmail,
          mobileNumber: `+1${signUpData.phoneNumber}`,
        },
        dob: moment(signUpData.dateOfBirth).format('MM/DD/YYYY'),
        emailAddress: signUpData.email,
        empStatus: employeeStatus,
        employerType: EMPLOYER_TYPE,
        firstName: signUpData.firstName,
        gender: signUpData.gender,
        isEmailVerified: false,
        isFrontDesk: false,
        isMigrated: false,
        isMobVerified: false,
        isPrivacyConsent: privacyPolicy,
        isQuickTutorialSkipped: false,
        isTempPasswordChanged: false,
        jobTitle: jobCategory,
        lastName: signUpData.lastName,
        password: signUpData.secret,
        relStatus: signUpData.relationshipStatus,
        userRole: USER_ROLE,
        userType: subscriber,
        departmentName: clientDetails.subGroupName,
      };
      try {
        setLoading(true);
        const response: SignUpResponseDTO = await userContext.serviceProvider.callService(
          API_ENDPOINTS.REGISTRATION,
          RequestMethod.POST,
          user
        );

        setLoading(false);
        setIsSuccess(true);
        setApiErrorMessage(undefined);
        const registration = response.data as RegistrationResponseDTO;
        const registerMfaData = {
          flowName: FlowName.REGISTER,
          isEmailVerified: registration.isEmailVerified,
          pingRiskId: registration.pingRiskId,
          userName: signUpData.email,
        };

        userContext.setMfaData({ ...registerMfaData });
        setIsShownAlert(true);
      } catch (error) {
        setLoading(false);
        setIsSuccess(false);
        const signUpError = getErrorMessage(error as ErrorInfoDTO);

        if (!isNetworkError(signUpError.status)) {
          if (signUpError.source) {
            const errorArray = signUpError.source;
            const firstValue = Object.entries(errorArray)[0][1];
            const errorMessage = Object.entries(firstValue)[0][1] as string;
            setApiErrorMessage(errorMessage);
          } else {
            if (signUpError.statusCode === USER_NAME_EXISTS) {
              setApiErrorMessage(t('authErrors.userNameExistsError'));
            } else {
              setApiErrorMessage(t('authErrors.registrationErrorText'));
            }
          }
        } else {
          setApiErrorMessage(t('authErrors.registrationErrorText'));
        }
        setIsShownAlert(true);
      }
    }
  };

  const handleContinueButton = () => {
    if (userContext.userSignUpData) {
      userContext.setUserSignUpData({
        ...userContext.userSignUpData,
        ...getValues(),
      });
      transformSignUpData();
    }
  };

  return {
    navigateToSignInScreen,
    handleContinueButton,
    handlePreviousButton,
    navigateToPrivacyPolicy,
    navigateToTermsOfUse,
    navigateToStatementOfUnderstanding,
    control,
    formState,
    isSuccess,
    onAlertButonPress,
    loading,
    isShownAlert,
    apiErrorMessage,
  };
};
