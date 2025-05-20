import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppUrl } from '../../../../../shared/src/models';
import { ErrorInfoDTO, getErrorMessage, isNetworkError } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { RequestMethod } from '../../../../../src/models/adapters';
import { isIOS } from '../../../../../src/util/commonUtils';
import { isNotificationPermissionAlertGranted } from '../../../../../src/util/pushNotificationStorage';
import { getSecureStorage, SecureStorageNamespace } from '../../../../../src/util/secureStorage';
import { storage, StorageNamespace } from '../../../../../src/util/storage';
import { CLIENT_STORAGE_KEY } from '../../../../client/src/constants/constants';
import { Installations } from '../../../../notifications/src/model/notification';
import { FlowName, LOGIN_CONTINUE, LOGIN_TWO_FACTOR } from '../../config/constants/auth';
import { AUTH_SDK_ANALYTICS } from '../../config/constants/tags';
import { DEVICE_TOKEN, LOGIN_USER_NAME } from '../../constants/constants';
import { useUserContext } from '../../context/auth.sdkContext';
import { useNavigationFromLogin } from '../../hooks/useNavigationFromLogin';
import { useProfileDetails } from '../../hooks/useProfileDetails';
import { LoginResponseDTO, LoginSuccessResponseDTO } from '../../models/login';
import { Login } from '../../models/signUp';
import { Screen } from '../../navigation/auth.navigationTypes';
import { getLoginValidationSchema } from '../../utils/loginValidationSchema';

export const useLogin = () => {
  const userContext = useUserContext();
  const { setUserProfileData, setLoggedIn, setClient, client, isAutoLogOut, setIsAutoLogOut, setNotificationCount } =
    useAppContext();
  const { navigationFromLogin } = useNavigationFromLogin();
  const profileDetails = useProfileDetails();
  const { navigation, pushNotificationPayload, navigationHandler, metrics } = userContext;

  const [secretError, setSecretError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [isShownErrorAlert, setIsShownErrorAlert] = useState(false);

  const { loginValidationSchema } = getLoginValidationSchema();

  const { control, formState, getValues, trigger } = useForm<Login>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      secret: '',
    },
    resolver: yupResolver(loginValidationSchema),
  });

  const {
    configurePushNotificationsAfterReLogin,
    enablePushNotifications,
    getRNPermissions,
    requestNotificationPermissionAndroid,
    resetBadgeCount,
    handlePostLoginNotification,
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

  const handleBackButton = () => {
    if (isAutoLogOut) {
      setIsAutoLogOut(false);
      navigationHandler.linkTo({ action: AppUrl.HOME });
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const secureStorage = getSecureStorage(SecureStorageNamespace.AuthSDK);
      const savedUserName = await secureStorage.getSecureData<string>(LOGIN_USER_NAME);
      const deviceToken =
        getValues().email === savedUserName ? await secureStorage.getSecureData<string>(DEVICE_TOKEN) : undefined;
      const payload = {
        username: getValues().email,
        pdsw: getValues().secret,
      };

      const response: LoginResponseDTO = await userContext.serviceProvider.callService(
        API_ENDPOINTS.LOGIN_AUTH,
        RequestMethod.POST,
        payload,
        deviceToken ? { cookie: deviceToken } : {}
      );

      setIsShownErrorAlert(false);
      setLoading(false);
      const loginResponse = response.data as LoginSuccessResponseDTO;
      setUserProfileData({ ...loginResponse.profile });
      setSecretError(undefined);
      setUserProfileData(loginResponse.profile);
      setIsAutoLogOut(false);
      if (client && client.userName !== loginResponse.profile.clientName) {
        const clientDetails = {
          ...client,
          userName: loginResponse.profile.clientName,
          groupId: loginResponse.profile.clientGroupId,
          subGroupName: loginResponse.profile.departmentName,
          logoUrl: undefined,
        };
        setClient({ ...clientDetails, shouldUpdateHomeInfo: true });
        const clientStorage = storage(StorageNamespace.ClientSDK);
        clientStorage.setObject(CLIENT_STORAGE_KEY, clientDetails);
      }
      await profileDetails.getProfileDetails();
      setNotificationCount(loginResponse.profile.notificationCount);
      if (pushNotificationPayload) {
        resetBadgeCount(loginResponse.profile.notificationCount);
        handlePostLoginNotification(pushNotificationPayload);
      }
      if (loginResponse.status.toUpperCase() === LOGIN_CONTINUE) {
        setLoggedIn(true);
        await navigationFromLogin(loginResponse.profile.iamguid);
        updatePNStatusAPICall();
      } else if (loginResponse.status.toUpperCase() === LOGIN_TWO_FACTOR || loginResponse.pingRiskId) {
        const loginMfaData = {
          email: getValues().email,
          flowName: FlowName.LOGIN,
          isEmailVerified: loginResponse.profile.isEmailVerified,
          pingRiskId: loginResponse.pingRiskId,
          userName: getValues().email,
        };
        userContext.setMfaData({ ...loginMfaData });
        navigation.navigate(Screen.SELECT_MFA_OPTIONS);
      }
    } catch (error) {
      setLoading(false);
      const errorResponse = getErrorMessage(error as ErrorInfoDTO);
      if (!isNetworkError(errorResponse.status)) {
        setSecretError(errorResponse.message);
        setIsShownErrorAlert(false);
      } else {
        setIsShownErrorAlert(true);
        setSecretError(undefined);
      }
    }
  };

  const updateSecretError = () => {
    setSecretError(undefined);
  };

  const onPressErrorAlert = () => {
    setIsShownErrorAlert(false);
  };

  const navigateToSignUpScreen = () => {
    userContext.setUserSignUpData(undefined);
    navigation.navigate(Screen.PERSONAL_DETAILS);
  };

  const navigateToForgotSecretScreen = () => {
    const registerMfaData = {
      flowName: FlowName.FORGOT_SECRET,
      isEmailVerified: false,
      pingRiskId: '',
      userName: '',
    };

    userContext.setMfaData({ ...registerMfaData });
    navigation.navigate(Screen.VERIFY_PERSONAL_DETAILS);
  };
  const navigateToForgotUserNameScreen = () => {
    const registerMfaData = {
      flowName: FlowName.FORGOT_USER_NAME,
      isEmailVerified: false,
      pingRiskId: '',
      userName: '',
    };

    userContext.setMfaData({ ...registerMfaData });
    navigation.navigate(Screen.VERIFY_PERSONAL_DETAILS);
  };

  //analytics
  useEffect(() => {
    metrics.trackState(AUTH_SDK_ANALYTICS.STATES.LOGIN_SCREEN);
  }, [metrics]);

  return {
    handleLogin,
    navigateToForgotSecretScreen,
    navigateToForgotUserNameScreen,
    navigateToSignUpScreen,
    secretError,
    loading,
    control,
    formState,
    getValues,
    trigger,
    updateSecretError,
    isShownErrorAlert,
    onPressErrorAlert,
    handleBackButton,
  };
};
