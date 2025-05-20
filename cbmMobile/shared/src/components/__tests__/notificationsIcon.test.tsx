import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { NotificationsIcon } from '../notificationsIcon';

const mockNavigateToNotifications = jest.fn();

describe('Notiifcation Icon', () => {
  it('Display the notiifcations with count', async () => {
    const { findByTestId, findByText } = render(
      <NotificationsIcon navigateToNotifications={mockNavigateToNotifications} notificationCount={1} />
    );
    fireEvent.press(await findByTestId('notification.button.icon'));
    expect(await findByText('1')).toBeTruthy();
  });
});
