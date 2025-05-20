import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { SelectedProvider } from '../models/appointmentContextInfo';
import { AppointmentNavigationProp } from '../navigation/appointment.navigationTypes';

export interface AppointmentContextType extends AppContextType {
  selectedProviders: SelectedProvider[] | undefined;
  setSelectedProviders: React.Dispatch<React.SetStateAction<SelectedProvider[] | undefined>>;
}

const AppointmentContext = React.createContext<AppointmentContextType | null>(null);

const useAppointmentContextOnly = (): AppointmentContextType => {
  const context = React.useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within a appointmentContextProvider');
  }
  return context;
};

export function useAppointmentContext(): WithNavigation<AppointmentNavigationProp, AppointmentContextType> {
  return useWithNavigation<AppointmentNavigationProp, AppointmentContextType>(useAppointmentContextOnly());
}

export { AppointmentContext };
