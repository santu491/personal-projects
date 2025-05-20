import { useEffect, useState } from 'react';

import { storage, StorageNamespace } from '../../../../../src/util/storage';

export const NOTIFICATION_INFO_TOOLTIP = 'NOTIFICATION_INFO_TOOLTIP';

export const useNotificationInfoTooltip = () => {
  const [visible, setVisible] = useState<boolean>();

  const onPressCloseIcon = () => {
    setVisible(false);
    setNotificationToolTipShown(true);
  };

  useEffect(() => {
    getNotificationInfoToolTipValue();
  }, []);

  const setNotificationToolTipShown = async (notificationTooltipShow: boolean) => {
    try {
      const notificationInfoTooltipShown = storage(StorageNamespace.HomeSDK);
      await notificationInfoTooltipShown.setBool(NOTIFICATION_INFO_TOOLTIP, notificationTooltipShow);
    } catch (e) {
      throw new Error('notification tooltip details not found');
    }
  };

  const getNotificationInfoToolTipValue = async () => {
    try {
      const notificationInfoTooltipStorage = storage(StorageNamespace.HomeSDK);
      const isNotificationToolTipShown = await notificationInfoTooltipStorage.getBool(NOTIFICATION_INFO_TOOLTIP);
      setVisible(!isNotificationToolTipShown);
    } catch (e) {
      setVisible(true);
    }
  };

  return {
    onPressCloseIcon,
    visible,
  };
};
