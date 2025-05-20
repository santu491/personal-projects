import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { NotificationInfoTooltip } from '../notificationInfoTooltip';
import { useNotificationInfoTooltip } from '../useNotificationInfoTooltip';

jest.mock('../useNotificationInfoTooltip', () => ({
  useNotificationInfoTooltip: jest.fn(),
}));

describe('NotificationInfoTooltip', () => {
  const mockUseNotificationInfoTooltip = useNotificationInfoTooltip as jest.Mock;

  beforeEach(() => {
    mockUseNotificationInfoTooltip.mockReturnValue({
      visible: true,
      onPressCloseIcon: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<NotificationInfoTooltip />);
    expect(getByTestId('home.notificationInfotooltip.title')).toBeTruthy();
    expect(getByTestId('home.notificationInfotooltip.subTitle')).toBeTruthy();
    expect(getByTestId('home.notificationInfotooltip.accountText')).toBeTruthy();
    expect(getByTestId('home.notificationInfotooltip.menuText')).toBeTruthy();
  });

  it('calls onPressCloseIcon when close icon is pressed', () => {
    const { getByTestId } = render(<NotificationInfoTooltip />);
    const closeIconButton = getByTestId('home.notificationInfotooltip.closeButton');
    fireEvent.press(closeIconButton);
    expect(mockUseNotificationInfoTooltip().onPressCloseIcon).toHaveBeenCalled();
  });
});
