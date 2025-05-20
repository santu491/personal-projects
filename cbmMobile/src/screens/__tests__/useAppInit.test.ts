import { act, renderHook } from '@testing-library/react-hooks';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { getMockAppContext } from '../../__mocks__/appContext';
import { API_ENDPOINTS } from '../../config';
import { AppContextType, useAppContext } from '../../context/appContext';
import { usePushNotification } from '../../hooks/usePushNotification';
import { RequestMethod } from '../../models/adapters';
import { isNotificationPermissionAlertGranted } from '../../util/pushNotificationStorage';
import { storage } from '../../util/storage';
import { useAppInit } from '../appInit/useAppInit';

jest.mock('../../context/appContext');
jest.mock('../../util/storage');
jest.mock('../../util/pushNotificationStorage');
jest.mock('../../hooks/usePushNotification');

describe('useAppInit', () => {
  const appContextMock = getMockAppContext() as AppContextType;
  let getRNPermissionsMock: jest.Mock;
  let configurePushNotificationsBadgeCountMock: jest.Mock;

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue(appContextMock);
    getRNPermissionsMock = jest.fn().mockResolvedValue(true);
    configurePushNotificationsBadgeCountMock = jest.fn();
    (usePushNotification as jest.Mock).mockReturnValue({
      getRNPermissions: getRNPermissionsMock,
      configurePushNotificationsBadgeCount: configurePushNotificationsBadgeCountMock,
    });
    (isNotificationPermissionAlertGranted as jest.Mock).mockResolvedValue(true);
    (storage as jest.Mock).mockReturnValue({
      getObject: jest.fn().mockResolvedValue({ clientId: '123' }),
    });
    (DeviceInfo.getVersion as jest.Mock).mockReturnValue('1.0.0');
  });

  it('should initialize and call updatePNStatusAPICall', async () => {
    await act(async () => {
      renderHook(() => useAppInit());
    });

    expect(isNotificationPermissionAlertGranted).toHaveBeenCalled();
    expect(getRNPermissionsMock).toHaveBeenCalled();
    expect(configurePushNotificationsBadgeCountMock).toHaveBeenCalled();
  });

  it('should call appUpdateCheck and handle response', async () => {
    const responseMock = { updateRequired: false };
    (appContextMock.serviceProvider.callService as jest.Mock).mockResolvedValue(responseMock);

    const { result } = renderHook(() => useAppInit());

    let response;
    await act(async () => {
      response = await result.current.appUpdateCheck();
    });

    expect(appContextMock.serviceProvider.callService).toHaveBeenCalledWith(
      API_ENDPOINTS.APP_VERSION_CHECK,
      RequestMethod.GET,
      null,
      { version: '1.0.0', platform: Platform.OS }
    );
    expect(response).toBe(responseMock);
  });

  it('should call onReset and trigger appUpdateCheck', async () => {
    const { result } = renderHook(() => useAppInit());

    await act(async () => {
      result.current.onReset();
    });

    expect(appContextMock.serviceProvider.callService).toHaveBeenCalled();
  });
});
