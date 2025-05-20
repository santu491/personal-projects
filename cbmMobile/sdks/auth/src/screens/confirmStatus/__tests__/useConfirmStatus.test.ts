import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS, ScreenNames } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { storage } from '../../../../../../src/util/storage';
import { userProfileData } from '../../../__mocks__/auth';
import { useUserContext } from '../../../context/auth.sdkContext';
import { useConfirmStatus } from '../useConfirmStatus';

jest.mock('../../../context/auth.sdkContext');
jest.mock('../../../../../../src/util/storage');
jest.mock('moment', () => jest.fn(() => ({ format: jest.fn() })));

const mockNavigate = jest.fn();
const mockSetUserSignUpData = jest.fn();
const mockCallService = jest.fn();

const mockUserContext = {
  navigation: { navigate: mockNavigate, goBack: jest.fn() },
  userSignUpData: userProfileData,
  setUserSignUpData: mockSetUserSignUpData,
  serviceProvider: { callService: mockCallService },
  setMfaData: jest.fn(),
};

(useUserContext as jest.Mock).mockReturnValue(mockUserContext);

describe('useConfirmStatus', () => {
  it('should navigate to sign-in screen', () => {
    const { result } = renderHook(() => useConfirmStatus());
    act(() => {
      result.current.navigateToSignInScreen();
    });
    expect(mockNavigate).toHaveBeenCalledWith('LOGIN');
  });

  it('should handle previous button', () => {
    const { result } = renderHook(() => useConfirmStatus());
    act(() => {
      result.current.handlePreviousButton();
    });
    expect(mockSetUserSignUpData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should navigate to privacy policy', () => {
    const { result } = renderHook(() => useConfirmStatus());
    act(() => {
      result.current.navigateToPrivacyPolicy();
    });
    expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.PRIVACY_POLICY);
  });

  it('should navigate to terms of use', () => {
    const { result } = renderHook(() => useConfirmStatus());
    act(() => {
      result.current.navigateToTermsOfUse();
    });
    expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.TERMS_OF_USE);
  });

  it('should navigate to statement of understanding', () => {
    const { result } = renderHook(() => useConfirmStatus());
    act(() => {
      result.current.navigateToStatementOfUnderstanding();
    });
    expect(mockNavigate).toHaveBeenCalledWith(ScreenNames.STATEMENT_OF_UNDERSTANDING);
  });

  it('should handle alert button press', () => {
    const { result } = renderHook(() => useConfirmStatus());
    act(() => {
      result.current.onAlertButonPress();
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should handle continue button', async () => {
    const { result } = renderHook(() => useConfirmStatus());
    (storage as jest.Mock).mockReturnValue({
      getObject: jest.fn().mockResolvedValue({ groupId: 'group1', userName: 'client1', subGroupName: 'subgroup1' }),
    });
    mockCallService.mockResolvedValue({ data: { isEmailVerified: true, pingRiskId: 'risk1' } });

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(mockSetUserSignUpData).toHaveBeenCalled();
    expect(mockCallService).toHaveBeenCalledWith(API_ENDPOINTS.REGISTRATION, RequestMethod.POST, expect.any(Object));
    expect(result.current.isSuccess).toBe(true);
  });
});
