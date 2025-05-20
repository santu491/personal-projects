import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { footerData } from '../../../__mocks__/menu';
import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { MENU_ID } from '../../../config/constants/constants';
import { MenuType } from '../../../models/menu';
import { Menu } from '../menu';
import { useMenu } from '../useMenu';

jest.mock('../useMenu');
jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
}));

describe('Menu', () => {
  const mockUseMenu = useMenu as jest.Mock;
  const menuData = footerData.find((menu) => menu.id === MENU_ID)?.data;
  beforeEach(() => {
    mockUseMenu.mockReturnValue({
      menuData,
      buttonsData: menuData?.filter((data) => data.type === MenuType.BUTTON),
      handleScreenNavigation: jest.fn(),
      loggedIn: true,
      isSuccess: false,
      loading: false,
      assessmentAlertConfirm: jest.fn(),
      assessmentAlertDismiss: jest.fn(),
      onMenuItemPress: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <MenuMockContextWrapper>
        <Menu />
      </MenuMockContextWrapper>
    );
    expect(getByText('Provider Search')).toBeTruthy();
    expect(getByText('Appointments')).toBeTruthy();
  });

  it('handles button press', () => {
    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <Menu />
      </MenuMockContextWrapper>
    );
    const button = getByTestId('menu.logout.button');
    fireEvent.press(button);
    expect(mockUseMenu().handleScreenNavigation).toHaveBeenCalled();
  });
});
