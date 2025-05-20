import { act, renderHook } from '@testing-library/react-hooks';

import { useHomeContext } from '../../../context/home.sdkContext';
import { Screen } from '../../../navigation/home.navigationTypes';
import { useLanding } from '../useLanding';

jest.mock('../../../context/home.sdkContext');

describe('useLanding', () => {
  const mockUseHomeContext = useHomeContext as jest.Mock;

  beforeEach(() => {
    mockUseHomeContext.mockReturnValue({
      navigation: { navigate: jest.fn() },
      navigationHandler: { requestHideTabBar: jest.fn() },
    });
  });

  it('should hide the tab bar on mount', () => {
    renderHook(() => useLanding());
    const { navigationHandler, navigation } = mockUseHomeContext();

    expect(navigationHandler.requestHideTabBar).toHaveBeenCalledWith(navigation);
  });

  it('should navigate to home screen when onPressContinueAsGuest is called', () => {
    const { result } = renderHook(() => useLanding());
    const { navigation } = mockUseHomeContext();

    act(() => {
      result.current.onPressContinueAsGuest();
    });

    expect(navigation.navigate).toHaveBeenCalledWith(Screen.HOME);
  });

  it('should set showDrawer to false when onRequestClose is called', () => {
    const { result } = renderHook(() => useLanding());

    act(() => {
      result.current.onRequestClose();
    });

    expect(result.current.showDrawer).toBe(false);
  });

  it('should have placeholders for navigateToLogin and navigateToSignUp', () => {
    const { result } = renderHook(() => useLanding());

    expect(result.current.navigateToLogin).toBeDefined();
    expect(result.current.navigateToSignUp).toBeDefined();
  });
});
