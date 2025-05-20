import { act, renderHook } from '@testing-library/react-hooks';

import { useUserContext } from '../../../../context/auth.sdkContext';
import { useCreateAccount } from '../useCreateAccount';

jest.mock('../../../../context/auth.sdkContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('./../getCreateAccountValidationSchema', () => ({
  getCreateAccountValidationSchema: jest.fn(() => ({
    personalInfoValidationSchema: {},
  })),
}));

describe('useCreateAccount Hook', () => {
  const mockUserContext = {
    setMhsudUserSignUpData: jest.fn(),
    mhsudUserSignUpData: null,
    client: { clientUri: 'testUri', source: 'testSource' },
    serviceProvider: {
      callService: jest.fn(),
    },
  };

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue(mockUserContext);
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCreateAccount());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isChecked).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isVerifyEmailPopupVisible).toBe(false);
    expect(result.current.isResendVerificationPopupVisible).toBe(false);
  });

  it('should toggle isChecked when handleCheckboxChange is called', () => {
    const { result } = renderHook(() => useCreateAccount());
    act(() => {
      result.current.handleCheckboxChange();
    });
    expect(result.current.isChecked).toBe(true);
    act(() => {
      result.current.handleCheckboxChange();
    });
    expect(result.current.isChecked).toBe(false);
  });

  it('should set isVerifyEmailPopupVisible to false when onCloseVerifyEmailPopup is called', () => {
    const { result } = renderHook(() => useCreateAccount());
    act(() => {
      result.current.onCloseVerifyEmailPopup();
    });
    expect(result.current.isVerifyEmailPopupVisible).toBe(false);
    expect(result.current.isResendVerificationPopupVisible).toBe(false);
  });

  it('should set isError to false when onCloseError is called', () => {
    const { result } = renderHook(() => useCreateAccount());
    act(() => {
      result.current.onCloseError();
    });
    expect(result.current.isError).toBe(false);
  });

  it('should call verifyEmail and handle success in handleContinueButton', async () => {
    mockUserContext.serviceProvider.callService.mockResolvedValue({ status: 'success' });
    const { result } = renderHook(() => useCreateAccount());
    await act(async () => {
      await result.current.handleContinueButton();
    });
    expect(mockUserContext.setMhsudUserSignUpData).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('should call verifyEmail and handle failure in handleContinueButton', async () => {
    mockUserContext.serviceProvider.callService.mockResolvedValue({ status: 'failure' });
    const { result } = renderHook(() => useCreateAccount());
    await act(async () => {
      await result.current.handleContinueButton();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isVerifyEmailPopupVisible).toBe(true);
  });

  it('should call verifyEmail in onPressResendVerification', async () => {
    mockUserContext.serviceProvider.callService.mockResolvedValue({ status: 'success' });
    const { result } = renderHook(() => useCreateAccount());
    await act(async () => {
      await result.current.onPressResendVerification();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isResendVerificationPopupVisible).toBe(true);
  });

  it('should calculate dateOfBirthMaxDate correctly', () => {
    const { result } = renderHook(() => useCreateAccount());
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    expect(result.current.dateOfBirthMaxDate).toEqual(currentDate);
  });
});
