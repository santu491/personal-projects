/* eslint-disable @typescript-eslint/naming-convention */
import { act, renderHook } from '@testing-library/react-hooks';
import { AppState } from 'react-native';

import { usePushNotification } from '../../../../../../src/hooks/usePushNotification';
import { isAndroid } from '../../../../../../src/util/commonUtils';
import { isNotificationPermissionAlertGranted } from '../../../../../../src/util/pushNotificationStorage';
import { useNotificationSettings } from '../useNotificationSettings';

jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
  },
}));

jest.mock('../../../../../../src/hooks/usePushNotification', () => ({
  usePushNotification: jest.fn(),
}));

jest.mock('../../../../../../src/util/commonUtils', () => ({
  isAndroid: jest.fn(),
}));

jest.mock('../../../../../../src/util/pushNotificationStorage', () => ({
  isNotificationPermissionAlertGranted: jest.fn(),
}));

jest.mock('../../../config/util/commonUtils', () => ({
  openDeviceSettings: jest.fn(),
}));

describe('useNotificationSettings', () => {
  const mockUsePushNotification = usePushNotification as jest.Mock;
  const mockIsAndroid = isAndroid as jest.Mock;
  const mockIsNotificationPermissionAlertGranted = isNotificationPermissionAlertGranted as jest.Mock;

  beforeEach(() => {
    mockUsePushNotification.mockReturnValue({
      enablePushNotifications: jest.fn(),
      getRNPermissions: jest.fn(),
      configurePushNotificationsAfterReLogin: jest.fn(),
      requestNotificationPermissionAndroid: jest.fn(),
    });
    mockIsAndroid.mockReturnValue(false);
    mockIsNotificationPermissionAlertGranted.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useNotificationSettings());

    expect(result.current.isPushNotificationEnabled).toBe(false);
    expect(result.current.modelVisible).toBe(false);
    expect(result.current.successAlertData).toBeUndefined();
  });

  it('should update notification permission switch on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNotificationSettings());
    const mockGetRNPermissions = mockUsePushNotification().getRNPermissions;

    await waitForNextUpdate();

    expect(mockGetRNPermissions).toHaveBeenCalled();
    expect(result.current.isPushNotificationEnabled).toBe(undefined);
  });

  it('should handle app state change and update notification settings', async () => {
    renderHook(() => useNotificationSettings());
    const mockGetRNPermissions = mockUsePushNotification().getRNPermissions;
    const mockEnablePushNotifications = mockUsePushNotification().enablePushNotifications;

    mockGetRNPermissions.mockResolvedValue(true);

    const appStateListener = jest.spyOn(AppState, 'addEventListener');

    await act(async () => {
      appStateListener.mock.calls[0][1]('background');
      appStateListener.mock.calls[0][1]('active');
    });

    expect(mockGetRNPermissions).toHaveBeenCalled();
    expect(mockEnablePushNotifications).toHaveBeenCalled();
  });
});
