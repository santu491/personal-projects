import { useRoute } from '@react-navigation/native';
import { createRef, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native';

import { ErrorInfoDTO, getErrorMessage } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS, APP_CONTENT } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { RequestMethod } from '../../../../../src/models/adapters';
import { isIOS } from '../../../../../src/util/commonUtils';
import { isNotificationPermissionAlertGranted } from '../../../../../src/util/pushNotificationStorage';
import { getSecureStorage, SecureStorageNamespace } from '../../../../../src/util/secureStorage';
import { Installations } from '../../../../notifications/src/model/notification';
import {
  FlowName,
  INVALID_OTP,
  KEYBOARD_ACCESSORY_VIEWID,
  OTP_EXCEED_MESSAGE,
  QUOTA_EXCEEDED,
} from '../../config/constants/auth';
import { DEVICE_TOKEN, LOGIN_USER_NAME } from '../../constants/constants';
import { useUserContext } from '../../context/auth.sdkContext';
import { useNavigationFromLogin } from '../../hooks/useNavigationFromLogin';
import { useProfileDetails } from '../../hooks/useProfileDetails';
import {
  ForgotResponseDTO,
  MfaResponseDTO,
  OtpResponseDTO,
  RememberMeDeviceResponseDTO,
  SuccessAlertData,
} from '../../models/mfa';
import { RememberDevice } from '../../models/signUp';
import { MfaVerifyOtpScreenProps, Screen } from '../../navigation/auth.navigationTypes';

const textInputCount = 6;

export const useVerifyOTPScreen = () => {
  const { t } = useTranslation();

  const userContext = useUserContext();
  const appContext = useAppContext();
  const { pushNotificationPayload } = userContext;
  const { navigationFromLogin } = useNavigationFromLogin();

  const { channelName, otpDescription } = useRoute<MfaVerifyOtpScreenProps['route']>().params;
  const inputAccessoryViewID = KEYBOARD_ACCESSORY_VIEWID;
  const { mfaData, userProfileData, navigation } = userContext;
  const [modelVisible, setModelVisible] = useState(false);
  const [progressStepsCount, setProgressStepsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [otpResponse, setOtpResponse] = useState(<OtpResponseDTO>{});
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isEditableText, setIsEditableText] = useState(true);
  const [successAlertData, setSuccessAlertData] = useState<SuccessAlertData | undefined>();
  const [isServerError, setIsServerError] = useState(false);
  const profileDetails = useProfileDetails();

  const [otp, setOtp] = useState<Array<string>>(new Array(textInputCount).fill(''));

  const inputRefs = Array.from({ length: textInputCount }, () => createRef<TextInput>());

  const { control, getValues } = useForm<RememberDevice>({
    mode: 'onChange',
    defaultValues: {
      rememberDevice: false,
    },
  });

  const {
    enablePushNotifications,
    getRNPermissions,
    configurePushNotificationsAfterReLogin,
    requestNotificationPermissionAndroid,
    handlePostLoginNotification,
    getNotifications,
  } = usePushNotification({
    onPermissionsGrantedUpdate: () => {},
  });

  const updatePNStatusAPICall = useCallback(async () => {
    if (await isNotificationPermissionAlertGranted()) {
      const val: boolean = await getRNPermissions();
      val
        ? configurePushNotificationsAfterReLogin(Installations.SAVE_INSTALLATION)
        : configurePushNotificationsAfterReLogin(Installations.DELETE_INSTALLATION);
    } else {
      isIOS() ? enablePushNotifications() : requestNotificationPermissionAndroid();
    }
  }, [
    configurePushNotificationsAfterReLogin,
    enablePushNotifications,
    getRNPermissions,
    requestNotificationPermissionAndroid,
  ]);

  // Function to handle OTP change
  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    const isComplete = newOtp.every((input) => input.trim() !== '');
    setIsContinueButtonEnabled(isComplete);
    if (text && isComplete) {
      Keyboard.dismiss();
      setOtpCode(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    const key = e.nativeEvent.key;
    const newOtp = [...otp];
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      newOtp[index - 1] = '';
      inputRefs[index - 1].current?.focus();
    } else if (key !== 'Backspace' && index < inputRefs.length - 1) {
      newOtp[index] = key;
      inputRefs[index + 1].current?.focus();
    }
    setOtp(newOtp);
  };

  const clearOtpInputs = useCallback(() => {
    setOtp(new Array(textInputCount).fill(''));
    inputRefs.forEach((ref) => ref.current?.clear());
  }, [inputRefs]);

  const rememberDeviceApi = async () => {
    try {
      const response: RememberMeDeviceResponseDTO = await userContext.serviceProvider.callService(
        API_ENDPOINTS.REMEMBER_DEVICE,
        RequestMethod.GET,
        null,
        {
          isSecureToken: true,
        }
      );
      setLoading(false);

      const deviceToken = response.data.deviceCookie;
      const secureStorage = getSecureStorage(SecureStorageNamespace.AuthSDK);
      await secureStorage.setSecureData(LOGIN_USER_NAME, userContext.mfaData?.userName);
      await secureStorage.setSecureData(DEVICE_TOKEN, deviceToken);
    } catch (error) {
      setLoading(false);
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  };

  const verifyOtpApi = async (otpValue: string) => {
    setLoading(true);
    try {
      const payload = {
        otp: otpValue,
        rememberDevice: getValues().rememberDevice ? 'N' : 'Y',
        pingDeviceId: otpResponse.pingDeviceId,
        pingUserId: otpResponse.pingUserId,
        userName: mfaData?.userName,
        pingRiskId: mfaData?.pingRiskId,
        flowName: mfaData?.flowName,
      };

      const response: MfaResponseDTO = await userContext.serviceProvider.callService(
        API_ENDPOINTS.SEND_OTP,
        RequestMethod.POST,
        payload
      );
      setLoading(false);
      setErrorMessage(undefined);
      successAlertText();
      const forgotSuccessResponse = response.data as ForgotResponseDTO;
      userContext.setForgotSecretCookie(forgotSuccessResponse.cookie);
      await profileDetails.getProfileDetails();
      if (mfaData?.flowName === FlowName.FORGOT_SECRET) {
        navigation.navigate(Screen.RESET_SECRET);
      } else if (mfaData?.flowName === FlowName.LOGIN) {
        setModelVisible(true);
        getNotifications();
      } else {
        setModelVisible(true);
      }
      setProgressStepsCount(progressStepsCount + 1);
      if (getValues().rememberDevice) {
        rememberDeviceApi();
      }
    } catch (error) {
      setLoading(false);
      setIsContinueButtonEnabled(false);
      clearOtpInputs();
      const exceptionData = getErrorMessage(error as ErrorInfoDTO);
      if (exceptionData.statusCode === INVALID_OTP) {
        setIsEditableText(true);
        setErrorMessage(
          `${t('authentication.codeInCorrectText')} ${t('authentication.youHaveText')} ${exceptionData.attemptsRemaining} ${t('authentication.moreText')} ${exceptionData.attemptsRemaining === 1 ? `${t('authentication.attempText')}` : `${t('authentication.attemptsText')}`} ${t('authentication.leftEnterText')}`
        );
      } else if (exceptionData.statusCode === QUOTA_EXCEEDED) {
        setIsEditableText(false);
        setErrorMessage(OTP_EXCEED_MESSAGE);
      } else {
        setModelVisible(true);
        setIsServerError(true);
        setSuccessAlertData({
          title: t('authErrors.authErrorTitle'),
          description: t('authErrors.loginUserText'),
        });
      }
    }
  };

  const sentOtpApi = useCallback(async () => {
    try {
      const payload = {
        channel: channelName,
        userName: mfaData?.userName,
        pingRiskId: mfaData?.pingRiskId,
      };

      const response: MfaResponseDTO = await userContext.serviceProvider.callService(
        API_ENDPOINTS.SEND_OTP,
        RequestMethod.PUT,
        payload
      );
      setLoading(false);
      const sendOtpResponse = response.data as OtpResponseDTO;
      setOtpResponse(sendOtpResponse);
    } catch (error) {
      setLoading(false);
      setModelVisible(true);
      setIsServerError(true);
      setSuccessAlertData({
        title: t('authErrors.authErrorTitle'),
        description: t('authErrors.loginUserText'),
      });
    }
  }, [channelName, mfaData?.pingRiskId, mfaData?.userName, t, userContext.serviceProvider]);

  useEffect(() => {
    sentOtpApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreviousButton = () => {
    isEditableText ? navigation.goBack() : navigation.navigate(Screen.LOGIN);
  };

  const handleContinueButton = () => {
    verifyOtpApi(otpCode);
  };

  const handleResendCode = () => {
    setLoading(true);
    setErrorMessage('');
    setIsEditableText(true);
    sentOtpApi();
  };

  const successAlertText = () => {
    switch (mfaData?.flowName) {
      case FlowName.FORGOT_USER_NAME:
        setSuccessAlertData({
          title: t('verifyPersonalDetails.userNameRetrieved'),
          description: t('verifyPersonalDetails.userNameRetrievedDescription'),
        });
        break;
      case FlowName.REGISTER:
        setSuccessAlertData({
          title: t('authentication.accountRegisterTitle'),
          description: t('authentication.accountRegisterInfo'),
        });
        break;
      default:
        setSuccessAlertData({
          title: t('authentication.accountLoggedInTitle'),
          description: t('authentication.accountLoggedInInfo'),
        });
    }
  };

  const onPressSuccessAlertButton = async () => {
    setModelVisible(false);
    if (!isServerError) {
      await navigateToAuthenticationScreen();
    } else {
      setIsServerError(false);
    }
  };

  const navigateToAuthenticationScreen = async () => {
    switch (mfaData?.flowName) {
      case FlowName.FORGOT_USER_NAME:
      case FlowName.REGISTER:
        navigation.navigate(Screen.LOGIN);
        break;
      case FlowName.FORGOT_SECRET:
        navigation.navigate(Screen.RESET_SECRET);
        break;
      default:
        setLoading(true);
        await navigationFromLogin(userProfileData?.iamguid);
        setLoading(false);
        if (mfaData?.flowName === FlowName.LOGIN) {
          appContext.setLoggedIn(true);
          if (pushNotificationPayload) {
            handlePostLoginNotification(pushNotificationPayload);
          }
          setTimeout(() => {
            updatePNStatusAPICall();
          }, 1000);
        }
    }
  };

  return {
    handleContinueButton,
    handlePreviousButton,
    handleResendCode,
    modelVisible,
    onPressSuccessAlertButton,
    progressStepsCount,
    setModelVisible,
    loading,
    isContinueButtonEnabled,
    errorMessage,
    handleOTPChange,
    inputAccessoryViewID,
    inputRefs,
    otp,
    setOtp,
    isEditableText,
    otpDescription,
    control,
    successAlertData,
    mfaData,
    isServerError,
    handleKeyPress,
  };
};
