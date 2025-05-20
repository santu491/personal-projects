import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { useAppContext } from '../../../../../../src/context/appContext';
import { usePushNotification } from '../../../../../../src/hooks/usePushNotification';
import { getSecureStorage } from '../../../../../../src/util/secureStorage';
import { storage } from '../../../../../../src/util/storage';
import { useUserContext } from '../../../context/auth.sdkContext';
import { useNavigationFromLogin } from '../../../hooks/useNavigationFromLogin';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { useLogin } from '../useLogin';

jest.mock('../../../hooks/useNavigationFromLogin');
jest.mock('../../../context/auth.sdkContext');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../../../../src/hooks/usePushNotification');
jest.mock('../../../../../../src/util/secureStorage');

jest.mock('../../../../../../src/util/secureStorage');
jest.mock('../../../../../../src/util/storage');

describe('useLogin', () => {
  const mockNavigate = jest.fn();
  const mockCallService = jest.fn();
  const mockSetUserProfileData = jest.fn();
  const mockSetLoggedIn = jest.fn();
  const mockConfigurePushNotificationsAfterReLogin = jest.fn();
  const mockEnablePushNotifications = jest.fn();
  const mockGetRNPermissions = jest.fn();
  const mockRequestNotificationPermissionAndroid = jest.fn();
  const mockResetBadgeCount = jest.fn();
  const mockGetNotifications = jest.fn();

  const navigationBack = jest.fn();

  const mockUserContext = {
    navigation: { navigate: mockNavigate, canGoBack: jest.fn().mockReturnValue(true), goBack: navigationBack },
    serviceProvider: { callService: mockCallService },
    setMfaData: jest.fn(),
    pushNotificationPayload: {},
    setUserSignUpData: jest.fn(),
    navigationHandler: {
      linkTo: jest.fn(),
    },
    metrics: {
      trackState: jest.fn(),
    },
  };

  const mockNavigationFromLogin = {
    navigationFromLogin: jest.fn(),
  };

  const mockAppContext = {
    setUserProfileData: mockSetUserProfileData,
    setLoggedIn: mockSetLoggedIn,
    setIsAutoLogOut: jest.fn(),
    setNotificationCount: jest.fn(),
    client: {
      userName: 'dev',
    },
    setClient: jest.fn(),
  };

  const mockPushNotification = {
    configurePushNotificationsAfterReLogin: mockConfigurePushNotificationsAfterReLogin,
    enablePushNotifications: mockEnablePushNotifications,
    getRNPermissions: mockGetRNPermissions,
    requestNotificationPermissionAndroid: mockRequestNotificationPermissionAndroid,
    resetBadgeCount: mockResetBadgeCount,
    getNotifications: mockGetNotifications,
    handlePostLoginNotification: jest.fn(),
  };

  const mockClientStorage = {
    setObject: jest.fn(),
  };

  const mockSecureStorage = {
    getSecureData: jest.fn().mockResolvedValue('savedUserName'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue(mockUserContext);
    (useNavigationFromLogin as jest.Mock).mockReturnValue(mockNavigationFromLogin);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (usePushNotification as jest.Mock).mockReturnValue(mockPushNotification);

    (getSecureStorage as jest.Mock).mockReturnValue(mockSecureStorage);

    (storage as jest.Mock).mockReturnValue(mockClientStorage);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.loading).toBe(false);
    expect(result.current.secretError).toBeUndefined();
    expect(result.current.isShownErrorAlert).toBe(false);
  });

  it('should handle login error', async () => {
    const { result } = renderHook(() => useLogin());
    mockCallService.mockRejectedValueOnce(new Error('Test error'));

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.secretError).toBe('Invalid error format');
  });

  it('should navigate to forgot secret screen', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.navigateToForgotSecretScreen();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.VERIFY_PERSONAL_DETAILS);
  });

  it('should navigate to forgot username screen', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.navigateToForgotUserNameScreen();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.VERIFY_PERSONAL_DETAILS);
  });

  it('should handleBackButton', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.handleBackButton();
    });
    expect(mockUserContext.navigation.goBack).toHaveBeenCalledWith();
  });

  it('should handleBackButton with isAutoLogOut as true', () => {
    const updateMockAppContext = {
      ...mockAppContext,
      isAutoLogOut: true,
    };

    (useAppContext as jest.Mock).mockReturnValue(updateMockAppContext);
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.handleBackButton();
    });
    expect(mockAppContext.setIsAutoLogOut).toHaveBeenCalled();
    expect(mockUserContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });

  it('should handle updateSecretError', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.updateSecretError();
    });
    expect(result.current.secretError).toBeUndefined();
  });

  it('should handle onPressErrorAlert', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.onPressErrorAlert();
    });
    expect(result.current.isShownErrorAlert).toBeFalsy();
  });

  it('should handle navigateToSignUpScreen', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.navigateToSignUpScreen();
    });
    expect(mockUserContext.navigation.navigate).toHaveBeenCalledWith(Screen.PERSONAL_DETAILS);
  });

  it('should handle successful login', async () => {
    const mockResponse = {
      data: {
        profile: {
          clientName: 'clientName',
          clientGroupId: 'clientGroupId',
          departmentName: 'departmentName',
          notificationCount: 10,
          isEmailVerified: true,
          iamguid: 'iamguid',
        },
        status: 'CONTINUE',
      },
    };
    (mockUserContext.serviceProvider.callService as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockSetUserProfileData).toHaveBeenCalledWith(mockResponse.data.profile);
  });

  it('should handle successful login with 2FA', async () => {
    const mockResponse = {
      data: {
        profile: {
          clientName: 'clientName',
          clientGroupId: 'clientGroupId',
          departmentName: 'departmentName',
          notificationCount: 10,
          isEmailVerified: true,
          iamguid: 'iamguid',
        },
        status: 'TWOFACTOR',
        pingRiskId: '12312',
      },
    };
    (mockUserContext.serviceProvider.callService as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockSetUserProfileData).toHaveBeenCalledWith(mockResponse.data.profile);
  });
});
