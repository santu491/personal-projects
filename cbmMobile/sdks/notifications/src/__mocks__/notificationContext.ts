import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { NotificationContextType } from '../context/notifications.sdkContext';

export function getMockNotificationContext(): Readonly<NotificationContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
    notificationCount: 1,
    setNotificationCount: jest.fn(),
  };
}
