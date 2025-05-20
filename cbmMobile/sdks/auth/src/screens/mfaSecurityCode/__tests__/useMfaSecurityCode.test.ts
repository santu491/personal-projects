import { act, renderHook } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';

import { APP_IMAGES } from '../../../config/appImages';
import { useUserContext } from '../../../context/auth.sdkContext';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { useMfaSecurityCode } from '../useMfaSecurityCode';

jest.mock('../../../context/auth.sdkContext');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../../../../src/hooks/usePushNotification');
jest.mock('../../../../../../src/util/secureStorage');

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useMfaSecurityCode', () => {
  const mockNavigate = jest.fn();
  const mockCallService = jest.fn();
  const mockGoBack = jest.fn();

  const mockUserContext = {
    navigation: { navigate: mockNavigate, goBack: mockGoBack },
    serviceProvider: { callService: mockCallService },
    mfaData: { userName: 'testUser', isEmailVerified: true },
  };

  const mockTranslation = {
    t: (key: string) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue(mockUserContext);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMfaSecurityCode());
    expect(result.current.isContinueButtonEnabled).toBe(false);
    expect(result.current.selectedMfa).toBeUndefined();
    expect(result.current.getContacts).toEqual([]);
  });

  it('should handle MFA option press', () => {
    const { result } = renderHook(() => useMfaSecurityCode());
    const mockContact = {
      channel: 'EMAIL',
      contactValue: 'test@example.com',
      description: 'Email description',
      image: APP_IMAGES.EMAIL,
      verifyOtpDesc: 'desc',
    };

    act(() => {
      result.current.handlePressMFAOption(mockContact);
    });

    expect(result.current.selectedMfa).toEqual(mockContact);
    expect(result.current.isContinueButtonEnabled).toBe(true);
  });

  it('should handle previous button', () => {
    const { result } = renderHook(() => useMfaSecurityCode());

    act(() => {
      result.current.handlePreviousButton();
    });

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should handle continue button', () => {
    const { result } = renderHook(() => useMfaSecurityCode());
    const mockContact = {
      channel: 'EMAIL',
      contactValue: 'test@example.com',
      verifyOtpDesc: 'desc',
      description: 'Email description',
      image: APP_IMAGES.EMAIL,
    };

    act(() => {
      result.current.handlePressMFAOption(mockContact);
      result.current.handleContinueButton();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.VERTIFY_OTP, {
      channelName: undefined,
      otpDescription: undefined,
    });
  });

  it('should fetch member contacts list on mount', async () => {
    const mockContacts = [{ channel: 'EMAIL', contactValue: 'test@example.com' }];
    mockCallService.mockResolvedValueOnce({ data: { contacts: mockContacts } });

    const { result, waitForNextUpdate } = renderHook(() => useMfaSecurityCode());

    await waitForNextUpdate();

    expect(result.current.getContacts).toEqual([
      {
        channel: 'EMAIL',
        contactValue: 'test@example.com',
        image: APP_IMAGES.EMAIL,
        verifyOtpDesc: 'authentication.emailOTPDesc test@example.com. authentication.selectOptionDescription',
        description: 'Email me the code at test@example.com',
      },
    ]);
  });

  it('should handle error in fetching member contacts list', async () => {
    mockCallService.mockRejectedValueOnce(new Error('Error'));

    const { result, waitForNextUpdate } = renderHook(() => useMfaSecurityCode());

    await waitForNextUpdate();

    expect(result.current.getContacts).toEqual([]);
  });
});
