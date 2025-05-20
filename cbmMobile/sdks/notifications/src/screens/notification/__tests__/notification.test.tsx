import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { getMockNotificationContext } from '../../../__mocks__/notificationContext';
import { NotificationMockContextWrapper } from '../../../__mocks__/notificationMockContextWrapper';
import { useNotificationContext } from '../../../context/notifications.sdkContext';
import { Notification } from '../notification';
import { useNotification } from '../useNotification';

jest.mock('../useNotification');
jest.mock('../../../context/notifications.sdkContext');
jest.mock('../../../../../../src/util/commonUtils');

const mockUseNotification = useNotification as jest.Mock;

const mockNotificationContext = {
  serviceProvider: {
    callService: jest.fn(),
  },
  notificationCount: 3,
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
  },
};
const mockHandleClearAllAction = jest.fn();
const mockOnNotificationClick = jest.fn();
const useNotificationData = {
  notifications: [
    {
      notificationId: '1',
      deeplink: 'url1',
      title: 'title1',
      body: 'body1',
      createdTS: 'date1',
      viewedTS: 'date2',
      type: 'PODCAST',
      primaryTopic: 'topic1',
    },
  ],
  handleClearAllAction: mockHandleClearAllAction,
  onReadAction: jest.fn(),
  onNotificationClick: mockOnNotificationClick,
  loading: false,
  context: getMockNotificationContext(),
  getNotificationTypeButtonName: jest.fn(),
  onPressBackButton: jest.fn(),
  t: (key: string) => key,
  page: 0,
  onMomentumScrollEnd: jest.fn(),
  getNotificationType: jest.fn(),
};

describe('Notification', () => {
  beforeEach(() => {
    mockUseNotification.mockReturnValue(useNotificationData);
    (useNotificationContext as jest.Mock).mockReturnValue(mockNotificationContext);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('displays the correct header title', () => {
    const { getByText } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    expect(getByText('notifications.title')).toBeTruthy();
  });

  it('displays the clear all button', () => {
    const { getByTestId } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    expect(getByTestId('notifications.clearAll')).toBeTruthy();
  });

  it('displays the empty view when no notifications are present', () => {
    mockUseNotification.mockReturnValue({
      ...useNotificationData,
      notifications: undefined,
    });
    const { getByText } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    expect(getByText('notifications.noNotification')).toBeTruthy();
  });

  it('renders the notification list when notifications are present', () => {
    const { getByTestId } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    expect(getByTestId('notification.notificationList')).toBeTruthy();
  });

  it('renders the correct number of notifications', () => {
    const { getAllByTestId } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    const notifications = getAllByTestId('notification.notificationslist.read');
    expect(notifications.length).toBe(1); // Assuming there are 3 notifications in the mock context
  });

  it('calls handleClearAllAction when clear all button is pressed', () => {
    const { getByTestId } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    const clearAllButton = getByTestId('notifications.clearAll');
    fireEvent.press(clearAllButton);
    expect(mockHandleClearAllAction).toHaveBeenCalled();
  });

  it('calls onNotificationClick when a notification is pressed', () => {
    mockUseNotification.mockReturnValue({
      ...useNotificationData,
      notifications: [
        {
          notificationId: '1',
          deeplink: 'url1',
          title: 'title1',
          body: 'body1',
          createdTS: 'date1',
          viewedTS: 'date2',
          type: 'PODCAST',
          primaryTopic: 'topic1',
        },
      ],
    });
    const { getAllByTestId } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    const notificationItems = getAllByTestId('notification.notificationslist.notificationItem');
    fireEvent.press(notificationItems[0]);
    expect(mockOnNotificationClick).toHaveBeenCalled();
  });

  it('displays the loading indicator when loading is true', () => {
    mockUseNotification.mockReturnValue({
      ...useNotificationData,
      loading: true,
    });
    const { getByTestId } = render(
      <NotificationMockContextWrapper>
        <Notification />
      </NotificationMockContextWrapper>
    );
    expect(getByTestId('progress-modal')).toBeTruthy();
  });
});
