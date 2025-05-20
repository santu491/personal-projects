import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../../shared/src/models';
import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import { Screen } from '../../navigation/appointment.navigationTypes';

export const useAppointmentHistory = () => {
  const { t } = useTranslation();
  const appointmentContext = useAppointmentContext();
  const { navigation, navigationHandler } = appointmentContext;
  const [isShownLoginAlert, setIsShownLoginAlert] = useState(false);
  const { clearPushNotificationPayload } = usePushNotification({
    onPermissionsGrantedUpdate: () => {},
  });

  const appointmentHistoryData = [
    {
      label: t('appointments.pendingRequests'),
      action: Screen.PENDING_REQUESTS,
    },
    {
      label: t('appointments.confirmedRequests'),
      action: Screen.CONFIRMED_REQUESTS,
    },
    {
      label: t('appointments.inactiveRequests'),
      action: Screen.INACTIVE_REQUESTS,
    },
    {
      label: t('appointments.appointmentDetails'),
      action: Screen.APPOINTMENT_DETAILS,
    },
  ];

  const onHandleSignIn = () => {
    setIsShownLoginAlert(false);
    navigationHandler.linkTo({ action: AppUrl.LOGIN });
  };

  const onCloseAlert = () => {
    setIsShownLoginAlert(false);
  };

  const handleAppointmentHistoryNavigation = (item: Screen) => {
    if (!appointmentContext.loggedIn) {
      setIsShownLoginAlert(true);
    } else {
      setIsShownLoginAlert(false);
      if (item !== Screen.APPOINTMENT_DETAILS_REQUESTS && item !== Screen.VIEW_OTHER_REQUESTS) {
        navigation.navigate(item);
      }
    }
  };

  useEffect(() => {
    clearPushNotificationPayload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    appointmentHistoryData,
    handleAppointmentHistoryNavigation,
    isShownLoginAlert,
    onHandleSignIn,
    onCloseAlert,
  };
};
