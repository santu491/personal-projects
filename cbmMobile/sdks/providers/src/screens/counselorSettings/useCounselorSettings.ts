import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../../shared/src/models';
import { SelectCounselorSetting } from '../../config/constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';
import { Screen } from '../../navigation/providers.navigationTypes';

export const useCounselorSettings = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const {
    scheduleAppointmentInfo,
    setScheduleAppointmentInfo,
    appointmentAssessmentStatus,
    setIsAddOrRemoveCounselorEnabled,
    memberAppointmentStatus,
    navigation,
    navigationHandler,
  } = useProviderContext();
  const { t } = useTranslation();

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const radioButtons = useMemo(
    () => [
      { label: t('appointment.counselorSetting.availablePerCounselor'), value: SelectCounselorSetting.FIRST_AVAILABLE },
      { label: t('appointment.counselorSetting.choosePreferredDate'), value: SelectCounselorSetting.PREFERRED_DATE },
    ],
    [t]
  );

  useEffect(() => {
    if (scheduleAppointmentInfo?.memberSlot && scheduleAppointmentInfo.memberSlot.days === undefined) {
      setSelectedValue(SelectCounselorSetting.FIRST_AVAILABLE);
    } else if (scheduleAppointmentInfo?.memberSlot?.days && scheduleAppointmentInfo.memberSlot.days.length > 0) {
      setSelectedValue(SelectCounselorSetting.PREFERRED_DATE);
    }
  }, [scheduleAppointmentInfo?.memberSlot, scheduleAppointmentInfo?.memberSlot?.days]);

  const onChangeSettings = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const onPressContinue = useCallback(() => {
    if (selectedValue === SelectCounselorSetting.PREFERRED_DATE) {
      navigation.navigate(Screen.SELECT_DAYS);
    } else {
      setScheduleAppointmentInfo((prev) => ({
        ...prev,
        memberSlot: {
          days: undefined,
          time: undefined,
        },
      }));
      if (appointmentAssessmentStatus) {
        navigation.navigate(Screen.REVIEW_DETAILS);
      } else {
        navigation.navigate(Screen.VIEW_COUNSELOR_SETTINGS);
      }
    }
  }, [navigation, selectedValue, setScheduleAppointmentInfo, appointmentAssessmentStatus]);

  const onPressCloseIcon = useCallback(() => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  }, [navigationHandler]);

  const onPressEditCounselor = useCallback(() => {
    setIsAddOrRemoveCounselorEnabled(true);
    navigation.navigate(Screen.PROVIDER_LIST, { hasEditCounselor: true });
  }, [navigation, setIsAddOrRemoveCounselorEnabled]);

  return {
    memberAppointmentStatus,
    radioButtons,
    selectedValue,
    onPressContinue,
    onChangeSettings,
    onPressCloseIcon,
    onPressEditCounselor,
  };
};
