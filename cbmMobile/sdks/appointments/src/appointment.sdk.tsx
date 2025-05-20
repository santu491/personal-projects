import React, { useMemo, useState } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { AppointmentContext, AppointmentContextType } from './context/appointments.sdkContext';
import { ScheduleAppointmentInfo, SelectedProvider } from './models/appointmentContextInfo';
import { AppointmentHistoryList } from './models/appointments';

export const AppointmentSDK = ({ children }: { children: React.ReactNode }) => {
  const [scheduleAppointmentInfo, setScheduleAppointmentInfo] = useState<ScheduleAppointmentInfo | undefined>();
  const [selectedProviders, setSelectedProviders] = useState<SelectedProvider[] | undefined>();
  const [pendingRequestsList, setPendingRequestsList] = useState<AppointmentHistoryList | undefined>();
  const appContext = useAppContext();

  const context: AppointmentContextType = useMemo(() => {
    return {
      scheduleAppointmentInfo,
      setScheduleAppointmentInfo,
      selectedProviders,
      setSelectedProviders,
      pendingRequestsList,
      setPendingRequestsList,
      ...appContext,
    };
  }, [appContext, pendingRequestsList, scheduleAppointmentInfo, selectedProviders]);

  return (
    <>
      <AppointmentContext.Provider value={context}>{children}</AppointmentContext.Provider>
    </>
  );
};
