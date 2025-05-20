import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { RightArrow } from '../../../../../shared/src/assets/icons/icons';
import { appColors } from '../../../../../shared/src/context/appColors';
import { MenuItem } from '../../models/menu';
import { MenuCell, MenuCellProps } from './menuCell';

describe('MenuCell', () => {
  const mockOnPress = jest.fn();
  const menuItem: MenuItem = {
    label: 'Test Label',
    icon: '',
    id: 'menu',
    openURLInNewTab: false,
    redirectUrl: '',
    type: 'menuItem.list',
  };

  const defaultProps: MenuCellProps = {
    menuIcon: <RightArrow color={appColors.lightPurple} width={14} height={14} />,
    menuItem,
    onPress: mockOnPress,
  };

  it('renders correctly with icon', () => {
    const { getByText } = render(<MenuCell {...defaultProps} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders correctly without icon', () => {
    const propsWithoutIcon = {
      ...defaultProps,
      menuItem: { ...menuItem, icon: '' },
      menuIcon: null,
    };
    const { getByText } = render(<MenuCell {...propsWithoutIcon} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(<MenuCell {...defaultProps} />);
    fireEvent.press(getByTestId('menuCell'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
