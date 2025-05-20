import { useEffect, useMemo } from 'react';

import { AppUrl } from '../../../../../shared/src/models';
import { useProviderContext } from '../../context/provider.sdkContext';
import { useDaysInfoList } from '../../hooks/useDaysInfoList';
import { Screen } from '../../navigation/providers.navigationTypes';

export const useViewCounselorSettings = () => {
  const context = useProviderContext();
  const { daysInfoList } = useDaysInfoList();
  const {
    scheduleAppointmentInfo,
    setIsAddOrRemoveCounselorEnabled,
    memberAppointmentStatus,
    navigation,
    navigationHandler,
  } = context;
  const memberSlot = scheduleAppointmentInfo?.memberSlot;

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const onPressContinue = () => {
    navigation.navigate(Screen.REQUEST_APPOINTMENT);
  };

  const days = useMemo(() => {
    return daysInfoList.filter((day) => memberSlot?.days?.includes(day.value)).map((dayInfo) => dayInfo.day);
  }, [daysInfoList, memberSlot?.days]);

  const onPressCloseIcon = () => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  };

  const onPressEditCounselor = () => {
    setIsAddOrRemoveCounselorEnabled(true);
    navigation.navigate(Screen.PROVIDER_LIST, { hasEditCounselor: true });
  };

  return {
    onPressContinue,
    days,
    time: memberSlot?.time,
    onPressCloseIcon,
    onPressEditCounselor,
    memberAppointmentStatus,
  };
};
