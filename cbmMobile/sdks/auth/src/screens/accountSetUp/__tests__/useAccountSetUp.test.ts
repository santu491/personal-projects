import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from 'react-hook-form';

import { userSignUpData } from '../../../__mocks__/auth';
import { useUserContext } from '../../../context/auth.sdkContext';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { useAccountSetUp } from '../useAccountSetUp';

jest.mock('../../../context/auth.sdkContext');
jest.mock('../../../utils/accountSetUpValidationSchema', () => ({
  getAccountValidationSchema: jest.fn().mockReturnValue({ accountValidationSchema: {} }),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockCallService = jest.fn();
const mockTrigger = jest.fn();

const mockUserContext = {
  navigation: { navigate: mockNavigate, goBack: jest.fn() },
  userSignUpData,
  setUserSignUpData: jest.fn(),
  serviceProvider: { callService: mockCallService },
};

(useUserContext as jest.Mock).mockReturnValue(mockUserContext);
(useForm as jest.Mock).mockReturnValue({
  trigger: mockTrigger,
  control: {},
  formState: {},
  getValues: jest.fn(),
});

describe('useAccountSetUp', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAccountSetUp());
    expect(result.current.control).toBeDefined();
    expect(result.current.formState).toBeDefined();
    expect(result.current.getValues).toBeDefined();
    expect(result.current.isEmailExist).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should navigate to login screen', () => {
    const { result } = renderHook(() => useAccountSetUp());
    act(() => {
      result.current.navigateToSignUpScreen();
    });
    expect(mockNavigate).toHaveBeenCalledWith(Screen.LOGIN);
  });

  it('should handle previous button', () => {
    const { result } = renderHook(() => useAccountSetUp());
    act(() => {
      result.current.handlePreviousButton();
    });
    expect(mockUserContext.setUserSignUpData).toHaveBeenCalled();
    expect(mockUserContext.navigation.goBack).toHaveBeenCalled();
  });

  it('should handle continue button', () => {
    const { result } = renderHook(() => useAccountSetUp());
    act(() => {
      result.current.handleContinueButton();
    });
    expect(mockUserContext.setUserSignUpData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(Screen.CONFIRM_STATUS);
  });

  it('should set email and check if it exists', async () => {
    mockCallService.mockResolvedValueOnce({});
    const { result, waitForNextUpdate } = renderHook(() => useAccountSetUp());
    await act(async () => {
      result.current.setEmail('new@example.com', false);
      await waitForNextUpdate();
    });
    expect(result.current.isEmailExist).toBe(false);
  });

  it('should not check email if invalid', async () => {
    const { result } = renderHook(() => useAccountSetUp());
    await act(async () => {
      result.current.setEmail('invalid-email', true);
    });
    expect(result.current.isEmailExist).toBe(false);
  });
});
