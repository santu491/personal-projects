import { act, renderHook } from '@testing-library/react-hooks';
import { PermissionsAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { Installations } from '../../../sdks/notifications/src/model/notification';
import { AppUrl } from '../../../shared/src/models';
import { API_ENDPOINTS } from '../../config';
import { useAppContext } from '../../context/appContext';
import { RequestMethod } from '../../models/adapters';
import { NotificationPayloadType } from '../../models/common';
import { setNotificationPermissionAlertGranted } from '../../util/pushNotificationStorage';
import { usePushNotification } from '../usePushNotification';

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  checkPermissions: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getDeviceName: jest.fn(),
  getSystemVersion: jest.fn(),
  getVersion: jest.fn(),
}));

jest.mock('../../context/appContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../../util/pushNotificationStorage');

const mockAppContext = {
  setDeviceToken: jest.fn(),
  serviceProvider: {
    callService: jest.fn(),
  },
  setPushNotificationPayload: jest.fn(),
  loggedIn: true,
  deviceToken: 'mockDeviceToken',
  setNotificationCount: jest.fn(),
  navigationHandler: { linkTo: jest.fn() },
  pushNotificationPayload: true,
};

(useAppContext as jest.Mock).mockReturnValue(mockAppContext);

describe('usePushNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enable push notifications and configure PushNotification', () => {
    const { result } = renderHook(() => usePushNotification({}));

    act(() => {
      result.current.enablePushNotifications();
    });

    expect(PushNotification.configure).toHaveBeenCalled();
  });

  it('should get RN permissions', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    (PushNotification.checkPermissions as jest.Mock).mockImplementation((callback) => {
      callback({ alert: true });
    });

    const permissions = await result.current.getRNPermissions();

    expect(permissions).toBe(true);
  });

  it('should reset badge count', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    (PushNotification.getApplicationIconBadgeNumber as jest.Mock).mockImplementation((callback) => {
      callback(5);
    });

    await act(async () => {
      await result.current.resetBadgeCount(5);
    });

    expect(PushNotification.setApplicationIconBadgeNumber).toHaveBeenCalledWith(5);
    expect(mockAppContext.serviceProvider.callService).toHaveBeenCalled();
  });

  it('should update iOS badge count', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    (PushNotification.getApplicationIconBadgeNumber as jest.Mock).mockImplementation((callback) => {
      callback(5);
    });

    await act(async () => {
      result.current.updateIOSBadgeCount(5);
    });

    expect(PushNotification.setApplicationIconBadgeNumber).toHaveBeenCalledWith(5);
  });

  it('should get notifications', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    const mockResponse = {
      data: {
        count: 10,
      },
    };

    (mockAppContext.serviceProvider.callService as jest.Mock).mockResolvedValue(mockResponse);

    await act(async () => {
      await result.current.getNotifications();
    });

    expect(mockAppContext.setNotificationCount).toHaveBeenCalledWith(10);
  });

  it('should handle registration error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => usePushNotification({}));

    act(() => {
      result.current.enablePushNotifications();
    });

    const onRegistrationErrorCallback = (PushNotification.configure as jest.Mock).mock.calls[0][0].onRegistrationError;
    onRegistrationErrorCallback(new Error('Registration error'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Registration error', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should handle failed notification permission request on Android', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    PermissionsAndroid.request = jest.fn().mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    await act(async () => {
      await result.current.requestNotificationPermissionAndroid();
    });

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    expect(mockAppContext.setDeviceToken).not.toHaveBeenCalled();
  });

  it('should handle granted notification permission request on Android', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    PermissionsAndroid.request = jest.fn().mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    await act(async () => {
      await result.current.requestNotificationPermissionAndroid();
    });

    expect(setNotificationPermissionAlertGranted).toHaveBeenCalled();
  });

  it('should call delete installation API on re-login', async () => {
    const { result } = renderHook(() => usePushNotification({}));

    await act(async () => {
      await result.current.configurePushNotificationsAfterReLogin(Installations.DELETE_INSTALLATION);
    });

    const onRegisterCallback = (PushNotification.configure as jest.Mock).mock.calls[0][0].onRegister;
    onRegisterCallback({ token: 'mockToken' });

    expect(mockAppContext.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.NOTIFICATION_INSTALLATION_DELETE,
      RequestMethod.POST,
      { deviceToken: 'mockToken' }
    );
  });

  it('should configure push notifications badge count', () => {
    const { result } = renderHook(() => usePushNotification({}));

    act(() => {
      result.current.configurePushNotificationsBadgeCount();
    });

    const onRegisterCallback = (PushNotification.configure as jest.Mock).mock.calls[0][0].onRegister;
    onRegisterCallback({ token: 'mockToken' });

    expect(mockAppContext.setDeviceToken).toHaveBeenCalledWith('mockToken');
  });

  it('should call onPermissionsGrantedUpdate with true on successful registration', () => {
    const onPermissionsGrantedUpdate = jest.fn();
    const { result } = renderHook(() => usePushNotification({ onPermissionsGrantedUpdate }));

    const mockToken = 'mockToken';

    act(() => {
      result.current.enablePushNotifications();
    });

    const onRegisterCallback = (PushNotification.configure as jest.Mock).mock.calls[0][0].onRegister;
    onRegisterCallback({ token: mockToken });

    expect(onPermissionsGrantedUpdate).toHaveBeenCalledWith(true);
  });

  it('should call onPermissionsGrantedUpdate with false if not Android', () => {
    const onPermissionsGrantedUpdate = jest.fn();
    const { result } = renderHook(() => usePushNotification({ onPermissionsGrantedUpdate }));

    act(() => {
      result.current.enablePushNotifications();
    });

    expect(onPermissionsGrantedUpdate).toHaveBeenCalledWith(false);
  });

  it('should call onNotificationCalled with CREDIBLEMIND', () => {
    const onPermissionsGrantedUpdate = jest.fn();
    const { result } = renderHook(() => usePushNotification({ onPermissionsGrantedUpdate }));

    const receivedNotification = {
      foreground: false,
      userInteraction: true,
      message: 'string',
      data: {
        deepLinkType: NotificationPayloadType.CREDIBLEMIND,
        deepLink: 'crediblemind',
      },
      badge: 20,
      alert: {},
      sound: 'string',
      id: '562612',
      finish: jest.fn(),
    };
    act(() => {
      result.current.onNotificationCalled(receivedNotification);
    });
    expect(mockAppContext.navigationHandler.linkTo).toHaveBeenCalledWith({
      action: AppUrl.CREDIBLEMIND_WELLBEING,
      params: { url: receivedNotification.data.deepLink },
    });
  });

  it('should call onNotificationCalled with APPOINTMENTS', () => {
    const onPermissionsGrantedUpdate = jest.fn();
    const { result } = renderHook(() => usePushNotification({ onPermissionsGrantedUpdate }));

    const receivedNotification = {
      foreground: false,
      userInteraction: true,
      message: 'string',
      data: {
        deepLinkType: NotificationPayloadType.APPOINTMENTS,
        deepLink: 'APPOINTMENTS',
      },
      badge: 20,
      alert: {},
      sound: 'string',
      id: '562612',
      finish: jest.fn(),
    };
    act(() => {
      result.current.onNotificationCalled(receivedNotification);
    });
    expect(mockAppContext.navigationHandler.linkTo).toHaveBeenCalledWith({
      action: AppUrl.APPOINTMENTS_HISTORY,
    });
  });

  it('should call onNotificationCalled with default', () => {
    const onPermissionsGrantedUpdate = jest.fn();
    const { result } = renderHook(() => usePushNotification({ onPermissionsGrantedUpdate }));

    const receivedNotification = {
      foreground: false,
      userInteraction: true,
      message: 'string',
      data: {
        deepLinkType: 'urtls',
        deepLink: 'APPOINTMENTS',
      },
      badge: 20,
      alert: {},
      sound: 'string',
      id: '562612',
      finish: jest.fn(),
    };
    act(() => {
      result.current.onNotificationCalled(receivedNotification);
    });
    expect(mockAppContext.navigationHandler.linkTo).toHaveBeenCalledWith({
      action: AppUrl.NOTIFICATIONS,
    });
  });

  it('should call clearPushNotificationPayload', () => {
    const onPermissionsGrantedUpdate = jest.fn();
    const { result } = renderHook(() => usePushNotification({ onPermissionsGrantedUpdate }));
    result.current.clearPushNotificationPayload();
    expect(mockAppContext.setPushNotificationPayload).toHaveBeenCalledWith(undefined);
  });
});
