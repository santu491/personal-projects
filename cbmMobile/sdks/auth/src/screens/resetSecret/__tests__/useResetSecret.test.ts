import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { useUserContext } from '../../../context/auth.sdkContext';
import { Screen } from '../../../navigation/auth.navigationTypes';
import { useResetSecret } from '../useResetSecret';

jest.mock('../../../context/auth.sdkContext');

describe('useResetSecret', () => {
  const mockNavigate = jest.fn();
  const mockCallService = jest.fn();
  const mockUserContext = {
    navigation: { navigate: mockNavigate },
    forgotSecretCookie: 'test-cookie',
    mfaData: { userName: 'test-user' },
    serviceProvider: { callService: mockCallService },
  };

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue(mockUserContext);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useResetSecret());
    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(false);
  });

  it('should handle continue button and call resetSecretApi', async () => {
    const { result } = renderHook(() => useResetSecret());
    mockCallService.mockResolvedValueOnce({});

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(mockCallService).toHaveBeenCalledWith(
      API_ENDPOINTS.CHANGE_SECRET,
      RequestMethod.PUT,
      { newPassword: '', userName: 'test-user' },
      { cookie: 'test-cookie' }
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(true);
  });

  it('should handle error in resetSecretApi', async () => {
    const { result } = renderHook(() => useResetSecret());
    mockCallService.mockRejectedValueOnce(new Error('Test error'));

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(false);
  });

  it('should navigate to login screen on success alert button press', () => {
    const { result } = renderHook(() => useResetSecret());

    act(() => {
      result.current.onPressSuccessAlertButton();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.LOGIN);
  });

  it('should navigate to verify personal details screen on previous button press', () => {
    const { result } = renderHook(() => useResetSecret());

    act(() => {
      result.current.handlePreviousButton();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.VERIFY_PERSONAL_DETAILS);
  });
});
