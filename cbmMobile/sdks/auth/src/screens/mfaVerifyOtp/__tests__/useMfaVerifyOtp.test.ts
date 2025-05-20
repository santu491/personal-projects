import { useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { useAppContext } from '../../../../../../src/context/appContext';
import { usePushNotification } from '../../../../../../src/hooks/usePushNotification';
import { useUserContext } from '../../../context/auth.sdkContext';
import { useNavigationFromLogin } from '../../../hooks/useNavigationFromLogin';
import { useVerifyOTPScreen } from '../useMfaVerifyOtp';

jest.mock('../../../context/auth.sdkContext');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../../../../src/hooks/usePushNotification');
jest.mock('../../../../../../src/util/secureStorage');
jest.mock('../../../hooks/useNavigationFromLogin');

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('../../../context/auth.sdkContext');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../../../../src/hooks/usePushNotification');
jest.mock('../../../../../../src/util/secureStorage');

describe('useVerifyOTPScreen', () => {
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

  const mockUserContext = {
    navigation: { navigate: mockNavigate, goBack: jest.fn() },
    serviceProvider: { callService: mockCallService },
    setMfaData: jest.fn(),
    pushNotificationPayload: null,
    mfaData: { userName: 'testUser', flowName: 'LOGIN', pingRiskId: '123' },
    userProfileData: { iamguid: 'testGuid' },
  };

  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };

  const mockAppContext = {
    setUserProfileData: mockSetUserProfileData,
    setLoggedIn: mockSetLoggedIn,
    navigationHandler: mockNavigationHandler,
  };

  const mockPushNotification = {
    configurePushNotificationsAfterReLogin: mockConfigurePushNotificationsAfterReLogin,
    enablePushNotifications: mockEnablePushNotifications,
    getRNPermissions: mockGetRNPermissions,
    requestNotificationPermissionAndroid: mockRequestNotificationPermissionAndroid,
    resetBadgeCount: mockResetBadgeCount,
    getNotifications: mockGetNotifications,
  };

  const mockRoute = {
    params: {
      channelName: 'SMS',
      otpDescription: 'Test OTP Description',
    },
  };

  const mockTranslation = {
    t: (key: string) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue(mockUserContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (usePushNotification as jest.Mock).mockReturnValue(mockPushNotification);
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
    (useNavigationFromLogin as jest.Mock).mockReturnValue({
      navigationFromLogin: jest.fn(),
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.isContinueButtonEnabled).toBe(false);
  });

  it('should handle OTP change', () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    act(() => {
      result.current.handleOTPChange('1', 0);
    });
    expect(result.current.otp[0]).toBe('1');
  });

  it('should handle continue button', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    mockCallService.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should handle resend code', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    mockCallService.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      result.current.handleResendCode();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('should handle key press event', () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    act(() => {
      result.current.handleKeyPress(
        { nativeEvent: { key: 'Backspace' } } as NativeSyntheticEvent<TextInputKeyPressEventData>,
        1
      );
    });
    expect(result.current.otp[0]).toBe('');
  });

  it('should handle success alert button press', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    await act(async () => {
      result.current.onPressSuccessAlertButton();
    });
    expect(result.current.modelVisible).toBe(true);
  });

  it('should handle success alert button press with server error', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    act(() => {
      result.current.isServerError = true;
    });
    await act(async () => {
      result.current.onPressSuccessAlertButton();
    });
    expect(result.current.isServerError).toBe(true);
  });

  it('should handle OTP API call success', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    mockCallService.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should handle OTP API call failure', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    mockCallService.mockRejectedValueOnce({ response: { status: 400 } });

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle resend code API call success', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    mockCallService.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      result.current.handleResendCode();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('should handle resend code API call failure', async () => {
    const { result } = renderHook(() => useVerifyOTPScreen());
    mockCallService.mockRejectedValueOnce({ response: { status: 400 } });

    await act(async () => {
      result.current.handleResendCode();
    });

    expect(result.current.loading).toBe(false);
  });
});
