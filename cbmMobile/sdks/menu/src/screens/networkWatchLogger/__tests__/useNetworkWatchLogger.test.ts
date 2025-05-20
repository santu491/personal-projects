import { renderHook } from '@testing-library/react-hooks';
import { BackHandler } from 'react-native';

import { useMenuContext } from '../../../context/menu.sdkContext';
import { useNetworkWatchLogger } from '../useNetworkWatchLogger';

jest.mock('react-native', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BackHandler: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('../../../context/menu.sdkContext', () => ({
  useMenuContext: jest.fn(),
}));

describe('useNetworkWatchLogger', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };
  const mockNavigationHandler = {
    requestHideTabBar: jest.fn(),
  };

  beforeEach(() => {
    (useMenuContext as jest.Mock).mockReturnValue({
      navigation: mockNavigation,
      navigationHandler: mockNavigationHandler,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call navigation.goBack when onPressLeftArrow is called', () => {
    const { result } = renderHook(() => useNetworkWatchLogger());
    result.current.onPressLeftArrow();
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should call requestHideTabBar on mount', () => {
    renderHook(() => useNetworkWatchLogger());
    expect(mockNavigationHandler.requestHideTabBar).toHaveBeenCalledWith(mockNavigation);
  });

  it('should call onPressLeftArrow when hardware back button is pressed', () => {
    let backAction: () => boolean = () => false;
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, action) => {
      backAction = () => action() ?? false;
      return { remove: jest.fn() };
    });

    renderHook(() => useNetworkWatchLogger());
    expect(backAction()).toBe(true);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
