import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { NotificationMockContextWrapper } from '../../../__mocks__/notificationMockContextWrapper';
import { NotificationSettings } from '../notificationSettings';

// jest.mock('../../../../../../src/util/commonUtils');

jest.mock('../../../../../../src/util/commonUtils', () => ({
  tokenIntegration: () => Promise.resolve('token'),
  getClientDetails: () => Promise.resolve({ supportNumber: '888-888-8888' }),
  isIOS: () => true,
  isAndroid: () => true,
  dimensionCheck: () => true,
  convertApiResponse: () =>
    Promise.resolve({
      status: 201,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
    }),
}));

jest.mock('../../../../../../src/hooks/usePushNotification', () => ({
  reLoginEnablePushNotifications: jest.fn(),
  disablePushNotiofications: jest.fn(),
  usePushNotification: () => ({
    getRNPermissions: () => true,
    requestNotificationPermissionAndroid: jest.fn(),
    enablePushNotifications: jest.fn(),
  }),
}));

describe('NotifcationSettings', () => {
  const notificationSettingsWrapper = (
    <NotificationMockContextWrapper>
      <NotificationSettings />
    </NotificationMockContextWrapper>
  );
  it('renders the component without errors', () => {
    render(notificationSettingsWrapper);
    // Add your assertion here
  });

  it('display Notifications header', () => {
    const { getByTestId } = render(notificationSettingsWrapper);
    expect(getByTestId('notification.profile.notification.settings')).toBeTruthy();
    // Add your assertion here
  });

  it('Switch button toogle on and off', () => {
    const { getByTestId } = render(notificationSettingsWrapper);
    const manageLink = getByTestId('notification.settings.enable.switch');
    expect(manageLink).toBeTruthy();
    fireEvent(manageLink, 'valueChange', false);
  });

  // Add more test cases as needed
});
