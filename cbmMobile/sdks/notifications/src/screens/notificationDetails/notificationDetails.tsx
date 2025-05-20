import { useRoute } from '@react-navigation/native';
import React from 'react';

import { CredibleMindComponent } from '../../../../../shared/src/components/credibleMindComponent';
import { NotificationDetailScreenProps } from '../../navigation/notification.navigationTypes';

export const NotificationDetails = () => {
  const { url } = useRoute<NotificationDetailScreenProps['route']>().params;

  return <CredibleMindComponent url={url} />;
};
