import { act, renderHook } from '@testing-library/react-hooks';

import { useUserContext } from '../../../../context/auth.sdkContext';
import { useLogin } from '../useLogin';

jest.mock('../../../../context/auth.sdkContext', () => ({
  useUserContext: jest.fn(),
}));

describe('useLogin Hook', () => {
  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      navigationHandler: mockNavigationHandler,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.value).toBe('');
    expect(result.current.isCreateAccountDrawerEnabled).toBe(false);
  });

  it('should update value when onChangeText is called', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.onChangeText('test');
    });
    expect(result.current.value).toBe('test');
  });

  it('should enable create account drawer when handleCreateAccount is called', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.handleCreateAccount();
    });
    expect(result.current.isCreateAccountDrawerEnabled).toBe(true);
  });

  it('should disable create account drawer when onCloseCreateAccountDrawer is called', () => {
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.handleCreateAccount();
    });
    act(() => {
      result.current.onCloseCreateAccountDrawer();
    });
    expect(result.current.isCreateAccountDrawerEnabled).toBe(false);
  });
});
