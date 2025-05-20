import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { AppointmentContext, AppointmentContextType } from '../context/appointments.sdkContext';
import { getMockAppoinmentContext } from './appointmentContext';

export const AppointmentMockContextWrapper = ({
  children,
  appoinmentContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  appoinmentContextProps?: AppointmentContextType;
  children: React.ReactNode;
}) => {
  let appointmentProps = getMockAppoinmentContext();
  if (appoinmentContextProps) {
    appointmentProps = {
      ...appointmentProps,
      ...appoinmentContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <AppointmentContext.Provider value={appointmentProps}>{children}</AppointmentContext.Provider>;
    </AppMockContextWapper>
  );
};
