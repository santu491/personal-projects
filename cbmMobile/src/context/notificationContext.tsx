import React from 'react';

import { NotificationSDK } from '../../sdks/notifications/src/notification.sdk';

export const NotificationContext = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  return <NotificationSDK children={children} />;
};
