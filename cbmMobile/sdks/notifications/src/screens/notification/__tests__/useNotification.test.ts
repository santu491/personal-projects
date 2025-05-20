import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { getMockAppContext } from '../../../../../../src/__mocks__/appContext';
import { API_ENDPOINTS } from '../../../../../../src/config';
import { useAppContext } from '../../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { PAGE_SIZE } from '../../../config/constants/notification';
import { useNotificationContext } from '../../../context/notifications.sdkContext';
import { NotificationButtonType, NotificationType } from '../../../model/notification';
import { useNotification } from '../useNotification';

jest.mock('../../../context/notifications.sdkContext');
jest.mock('../../../../../../src/context/appContext');

describe('useNotification', () => {
  const mockNotificationContext = {
    serviceProvider: {
      callService: jest.fn(),
    },
    notificationCount: 5,
    unreadCount: 0,
    navigation: {
      navigate: jest.fn(),
      goBack: jest.fn(),
    },
  };

  const mockAppContext = {
    ...getMockAppContext(),
  };

  beforeEach(() => {
    (useNotificationContext as jest.Mock).mockReturnValue(mockNotificationContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch notifications on mount', async () => {
    const mockNotifications = {
      data: {
        count: 3,
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
      },
    };

    mockNotificationContext.serviceProvider.callService.mockResolvedValue(mockNotifications);

    const { result, waitForNextUpdate } = renderHook(() => useNotification());

    await waitForNextUpdate();

    expect(mockNotificationContext.serviceProvider.callService).toHaveBeenCalledWith(
      `${API_ENDPOINTS.NOTIFICATION}?size=${PAGE_SIZE}&from=0`,
      RequestMethod.GET,
      null
    );
    expect(result.current.notifications).toEqual([
      {
        id: '1',
        url: 'url1',
        title: 'title1',
        description: 'body1',
        createdDate: 'date1',
        viewDate: 'date2',
        type: NotificationButtonType.READ,
        topic: 'topic1',
      },
    ]);
    expect(mockAppContext.setNotificationCount).toHaveBeenCalledWith(3);
  });

  it('should handle clear all action', async () => {
    mockNotificationContext.serviceProvider.callService.mockResolvedValue({});

    const { result } = renderHook(() => useNotification());

    await act(async () => {
      await result.current.handleClearAllAction();
    });

    expect(mockNotificationContext.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.NOTIFICATION,
      RequestMethod.PUT,
      { isClearAll: true, notificationId: '', isRemove: false },
      {}
    );
    expect(mockAppContext.setNotificationCount).toHaveBeenCalledWith(0);
  });

  it('should handle notification click', async () => {
    const mockResponse = {
      data: {
        unreadCount: 2,
      },
    };
    mockNotificationContext.serviceProvider.callService.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNotification());

    await act(async () => {
      result.current.onNotificationClick({
        id: '1',
        url: 'url1',
        title: 'title1',
        description: 'body1',
        createdDate: 'date1',
        viewDate: 'date2',
        type: NotificationButtonType.LISTEN,
        topic: 'topic1',
      });
    });

    expect(mockNotificationContext.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.NOTIFICATION,
      RequestMethod.PUT,
      { isRemove: false, notificationId: '1' },
      {}
    );
    expect(mockNotificationContext.navigation.navigate).toHaveBeenCalledWith('NotificationDetails', { url: 'url1' });
  });

  it('should fetch more notifications on momentum scroll end', async () => {
    const mockNotifications = {
      data: {
        count: 3,
        notifications: [
          {
            notificationId: '2',
            deeplink: 'url2',
            title: 'title2',
            body: 'body2',
            createdTS: 'date3',
            viewedTS: 'date4',
            type: 'VIDEO',
            primaryTopic: 'topic2',
          },
        ],
      },
    };

    mockNotificationContext.serviceProvider.callService.mockResolvedValue(mockNotifications);

    const { result, waitForNextUpdate } = renderHook(() => useNotification());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.onMomentumScrollEnd();
    });

    expect(mockNotificationContext.serviceProvider.callService).toHaveBeenCalledWith(
      `${API_ENDPOINTS.NOTIFICATION}?size=${PAGE_SIZE}&from=0`,
      RequestMethod.GET,
      null
    );
    expect(mockAppContext.setNotificationCount).toHaveBeenCalledWith(3);
  });

  it('should handle back button press when push notification payload is present', () => {
    const mockPushNotificationPayload = {
      some: 'payload',
      foreground: true,
      userInteraction: false,
      message: 'Test message',
      data: {},
      badge: 1,
      sound: 'default',
      finish: jest.fn(),
      alert: { title: 'Test alert' },
      id: '1',
    };
    mockAppContext.pushNotificationPayload = mockPushNotificationPayload;

    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.onPressBackButton();
    });

    expect(mockAppContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
    expect(mockAppContext.setPushNotificationPayload).toHaveBeenCalledWith(undefined);
  });

  it('should handle back button press when push notification payload is not present', () => {
    mockAppContext.pushNotificationPayload = undefined;
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.onPressBackButton();
    });

    expect(mockNotificationContext.navigation.goBack).toHaveBeenCalled();
  });

  it('should return correct button name for notification type', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.getNotificationTypeButtonName(NotificationButtonType.LISTEN)).toBe('notifications.listen');
    expect(result.current.getNotificationTypeButtonName(NotificationButtonType.WTACH)).toBe('notifications.watch');
    expect(result.current.getNotificationTypeButtonName(NotificationButtonType.READ)).toBe('notifications.read');
  });

  it('should return correct notification type', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.getNotificationType(NotificationType.PODCAST)).toBe(NotificationButtonType.LISTEN);
    expect(result.current.getNotificationType(NotificationType.VIDEO)).toBe(NotificationButtonType.WTACH);
    expect(result.current.getNotificationType(NotificationType.INSIGHTS)).toBe(NotificationButtonType.READ);
  });
});
