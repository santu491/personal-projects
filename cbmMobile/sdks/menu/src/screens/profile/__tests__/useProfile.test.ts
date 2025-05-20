import { act, renderHook } from '@testing-library/react-hooks';

import { useMenuContext } from '../../../context/menu.sdkContext';
import { useProfile } from '../useProfile';

jest.mock('react-native', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BackHandler: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('../../../context/menu.sdkContext');

describe('useProfile', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };
  const mockNavigationHandler = {
    requestHideTabBar: jest.fn(),
  };
  const mockUserProfileData = { name: 'John Doe' };

  beforeEach(() => {
    (useMenuContext as jest.Mock).mockReturnValue({
      navigation: mockNavigation,
      navigationHandler: mockNavigationHandler,
      userProfileData: mockUserProfileData,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return userProfileData', () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.userProfileData).toEqual(mockUserProfileData);
  });

  it('should call navigation.goBack when onPressLeftArrow is called', () => {
    const { result } = renderHook(() => useProfile());
    act(() => {
      result.current.onPressLeftArrow();
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should call requestHideTabBar on mount', () => {
    renderHook(() => useProfile());
    expect(mockNavigationHandler.requestHideTabBar).toHaveBeenCalledWith(mockNavigation);
  });

  it('should call item.onPress when navigateToDetailsPage is called', () => {
    const mockMenu = {
      id: '1',
      title: 'Menu Item',
      onPress: jest.fn(),
    };

    const { result } = renderHook(() => useProfile());
    act(() => {
      result.current.navigateToDetailsPage(mockMenu);
    });

    expect(mockMenu.onPress).toHaveBeenCalled();
  });
});
