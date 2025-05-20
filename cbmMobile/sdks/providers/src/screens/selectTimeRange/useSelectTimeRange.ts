import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../../shared/src/models';
import { TimeRange } from '../../config/constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';
import { Screen } from '../../navigation/providers.navigationTypes';

export const useSelectTimeRange = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | undefined>();
  const {
    scheduleAppointmentInfo,
    setScheduleAppointmentInfo,
    appointmentAssessmentStatus,
    navigation,
    navigationHandler,
  } = useProviderContext();
  const { t } = useTranslation();

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const timeRange = useMemo(
    () => [
      {
        label: t('appointment.selectTimeRange.timeRange.6am-9am'),
        value: TimeRange.EARLY_MORNING,
      },
      {
        label: t('appointment.selectTimeRange.timeRange.9am-12pm'),
        value: TimeRange.MORNING,
      },
      {
        label: t('appointment.selectTimeRange.timeRange.12pm-3pm'),
        value: TimeRange.AFTERNOON,
      },
      {
        label: t('appointment.selectTimeRange.timeRange.3pm-6pm'),
        value: TimeRange.EVENING,
      },
      {
        label: t('appointment.selectTimeRange.timeRange.6pm-9pm'),
        value: TimeRange.NIGHT,
      },
    ],
    [t]
  );
  useEffect(() => {
    if (scheduleAppointmentInfo?.memberSlot?.time) {
      setSelectedTimeRange(scheduleAppointmentInfo.memberSlot.time);
    }
  }, [scheduleAppointmentInfo?.memberSlot?.time]);

  const onPressCloseIcon = () => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  };

  const onChangeTimeRange = (value: string | undefined) => {
    setSelectedTimeRange(value ?? '');
  };

  const onPressContinue = () => {
    setScheduleAppointmentInfo({
      ...scheduleAppointmentInfo,
      memberSlot: {
        ...scheduleAppointmentInfo?.memberSlot,
        time: selectedTimeRange,
      },
    });
    if (appointmentAssessmentStatus) {
      navigation.navigate(Screen.REVIEW_DETAILS);
    } else {
      navigation.navigate(Screen.VIEW_COUNSELOR_SETTINGS);
    }
  };

  return {
    selectedTimeRange,
    timeRange,
    onPressContinue,
    onChangeTimeRange,
    onPressCloseIcon,
  };
};
