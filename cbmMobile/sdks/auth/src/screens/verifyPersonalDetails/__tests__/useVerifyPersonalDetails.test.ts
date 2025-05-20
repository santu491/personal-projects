import { act, renderHook } from '@testing-library/react-hooks';

import { getErrorMessage, isNetworkError } from '../../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../../src/config';
import { FlowName } from '../../../config/constants/auth';
import { useUserContext } from '../../../context/auth.sdkContext';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { useVerifyPersonalDetails } from '../useVerifyPersonalDetails';

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    control: {},
    formState: {},
    getValues: jest.fn(() => ({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      email: 'john.doe@example.com',
    })),
  })),
}));
jest.mock('moment', () =>
  jest.fn(() => ({
    format: jest.fn(() => '01/01/2000'),
  }))
);
jest.mock('../../../context/auth.sdkContext', () => ({
  useUserContext: jest.fn(),
}));
jest.mock('../../../../../../shared/src/utils/utils', () => ({
  getErrorMessage: jest.fn(),
  isNetworkError: jest.fn(),
}));

describe('useVerifyPersonalDetails', () => {
  const mockNavigate = jest.fn();
  const mockSetMfaData = jest.fn();
  const mockCallService = jest.fn();

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      mfaData: { flowName: FlowName.FORGOT_USER_NAME },
      navigation: { navigate: mockNavigate },
      serviceProvider: { callService: mockCallService },
      setMfaData: mockSetMfaData,
    });
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());
    expect(result.current.dateOfBirthMaxDate).toBeInstanceOf(Date);
    expect(result.current.control).toBeDefined();
    expect(result.current.formState).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.apiError).toBeUndefined();
    expect(result.current.isShownErrorAlert).toBe(false);
  });

  it('should handle continue button click successfully', async () => {
    const mockResponse = {
      data: {
        isEmailVerified: true,
        pingRiskId: '12345',
      },
    };
    mockCallService.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useVerifyPersonalDetails());

    await act(async () => {
      await result.current.handleContinueButton();
    });

    expect(mockCallService).toHaveBeenCalledWith(API_ENDPOINTS.FORGOT_USER_NAME, 'POST', {
      firstName: 'John',
      lastName: 'Doe',
      dob: '01/01/2000',
      emailAddress: 'john.doe@example.com',
      bu: 'carelonwellbeing',
    });
    expect(mockSetMfaData).toHaveBeenCalledWith({
      flowName: FlowName.FORGOT_USER_NAME,
      isEmailVerified: true,
      pingRiskId: '12345',
      userName: 'john.doe@example.com',
    });
    expect(mockNavigate).toHaveBeenCalledWith(Screen.SELECT_MFA_OPTIONS);
  });

  it('should handle continue button click with error', async () => {
    const mockError = { status: 500 };
    mockCallService.mockRejectedValue(mockError);
    (getErrorMessage as jest.Mock).mockReturnValue(mockError);
    (isNetworkError as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useVerifyPersonalDetails());

    await act(async () => {
      await result.current.handleContinueButton();
    });

    expect(result.current.apiError).toBe('verifyPersonalDetails.forgotUserNameError');
    expect(result.current.isShownErrorAlert).toBe(true);
  });

  it('should update API error', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    act(() => {
      result.current.updateApiError();
    });

    expect(result.current.apiError).toBeUndefined();
  });

  it('should handle error alert press', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    act(() => {
      result.current.onPressErrorAlert();
    });

    expect(result.current.isShownErrorAlert).toBe(false);
  });

  it('should set loading state correctly during handleContinueButton', async () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    mockCallService.mockResolvedValue({
      data: {
        isEmailVerified: true,
        pingRiskId: '12345',
      },
    });

    await act(async () => {
      const handleContinueButtonPromise = result.current.handleContinueButton();
      await handleContinueButtonPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set apiError correctly when network error occurs', async () => {
    const mockError = { status: 0 };
    mockCallService.mockRejectedValue(mockError);
    (getErrorMessage as jest.Mock).mockReturnValue(mockError);
    (isNetworkError as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useVerifyPersonalDetails());

    await act(async () => {
      await result.current.handleContinueButton();
    });

    expect(result.current.apiError).toBe('authErrors.loginUserText');
    expect(result.current.isShownErrorAlert).toBe(true);
  });

  it('should reset apiError when updateApiError is called', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    act(() => {
      result.current.updateApiError();
    });

    expect(result.current.apiError).toBeUndefined();
  });

  it('should hide error alert when onPressErrorAlert is called', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    act(() => {
      result.current.onPressErrorAlert();
    });

    expect(result.current.isShownErrorAlert).toBe(false);
  });

  it('should not change apiError if it is already undefined', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    act(() => {
      result.current.updateApiError();
    });

    expect(result.current.apiError).toBeUndefined();
  });

  it('should set apiError to undefined when it has a value', () => {
    const { result } = renderHook(() => useVerifyPersonalDetails());

    act(() => {
      result.current.updateApiError();
    });

    expect(result.current.apiError).toBeUndefined();
  });
});
