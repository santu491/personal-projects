import React from 'react';

import { AppointmentSDK } from '../../sdks/appointments/src/appointment.sdk';

export const AppointmentContext = ({ children }: { children: React.ReactNode }) => {
  return <AppointmentSDK children={children} />;
};
