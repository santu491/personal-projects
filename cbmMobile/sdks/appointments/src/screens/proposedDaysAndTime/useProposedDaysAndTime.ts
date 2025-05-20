import { useMemo } from 'react';

import { useDaysInfoList } from '../../../../providers/src/hooks/useDaysInfoList';
import { useAppointmentContext } from '../../context/appointments.sdkContext';

export const useProposedDaysAndTime = () => {
  const { daysInfoList } = useDaysInfoList();
  const appointmentContext = useAppointmentContext();
  const { selectedProviders } = appointmentContext;
  const memberSlot = selectedProviders?.[0]?.memberPrefferedSlot;
  const clinicalInfo = selectedProviders?.[0]?.clinicalQuestions?.questionnaire[0];

  const days = useMemo(() => {
    return daysInfoList.filter((day) => memberSlot?.days?.includes(day.value)).map((dayInfo) => dayInfo.day);
  }, [daysInfoList, memberSlot?.days]);

  return {
    days,
    time: memberSlot?.time,
    clinicalInfo,
  };
};
