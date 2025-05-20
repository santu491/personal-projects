import { renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { useMenuContext } from '../../../context/menu.sdkContext';
import { useProfileDetailsPage } from '../useProfileDetailsPage';

jest.mock('../../../context/menu.sdkContext');

describe('useProfileDetailsPage', () => {
  const mockNavigationHandler = {
    requestHideTabBar: jest.fn(),
    linkTo: jest.fn(),
  };
  const mockNavigation = {};

  beforeEach(() => {
    (useMenuContext as jest.Mock).mockReturnValue({
      navigationHandler: mockNavigationHandler,
      navigation: mockNavigation,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call requestHideTabBar on mount', () => {
    renderHook(() => useProfileDetailsPage());

    expect(mockNavigationHandler.requestHideTabBar).toHaveBeenCalledWith(mockNavigation);
  });

  it('should call linkTo with correct action when handleEditPhoneNumber is called', () => {
    const { result } = renderHook(() => useProfileDetailsPage());

    result.current.handleEditPhoneNumber();

    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.UPDATE_PHONE_NUMBER });
  });
});
