import { useCallback, useEffect, useState } from 'react';

import { AppUrl } from '../../../../../shared/src/models';
import { useProviderContext } from '../../context/provider.sdkContext';
import { useDaysInfoList } from '../../hooks/useDaysInfoList';
import { Screen } from '../../navigation/providers.navigationTypes';

export const useSelectedDays = () => {
  const { scheduleAppointmentInfo, setScheduleAppointmentInfo, navigation, navigationHandler } = useProviderContext();
  const { daysInfoList } = useDaysInfoList();
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState(false);
  const [daysInfo, setDaysInfo] = useState(daysInfoList);

  useEffect(() => {
    const isEnabled = daysInfo.some((item) => item.isSelected);
    setIsContinueButtonEnabled(isEnabled);
  }, [daysInfo]);

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  useEffect(() => {
    if (scheduleAppointmentInfo?.memberSlot?.days && scheduleAppointmentInfo.memberSlot.days.length > 0) {
      const updatedDaysInfo = [...daysInfoList].map((item) => {
        return {
          ...item,
          isSelected: scheduleAppointmentInfo.memberSlot?.days?.includes(item.value) ?? false,
        };
      });
      setDaysInfo(updatedDaysInfo);
    }
  }, [daysInfoList, scheduleAppointmentInfo?.memberSlot?.days]);

  const onPressContinue = useCallback(() => {
    const selectedDays = daysInfo.filter((item) => item.isSelected).map((item) => item.value);
    setScheduleAppointmentInfo({
      ...scheduleAppointmentInfo,
      memberSlot: {
        ...scheduleAppointmentInfo?.memberSlot,
        days: selectedDays,
      },
    });
    navigation.navigate(Screen.SELECT_TIME_RANGE);
  }, [daysInfo, navigation, scheduleAppointmentInfo, setScheduleAppointmentInfo]);

  const onPressCloseIcon = useCallback(() => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  }, [navigationHandler]);

  const onPressDay = (day: string) => {
    const updatedDaysInfo = [...daysInfo].map((item) => {
      return {
        ...item,
        isSelected: item.value === day ? !item.isSelected : item.isSelected,
      };
    });
    setDaysInfo(updatedDaysInfo);
  };

  return { daysInfo, isContinueButtonEnabled, onPressCloseIcon, onPressContinue, onPressDay };
};
