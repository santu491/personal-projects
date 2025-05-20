import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { AppointmentContextType } from '../context/appointments.sdkContext';

export function getMockAppoinmentContext(): Readonly<AppointmentContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
    selectedProviders: undefined,
    setSelectedProviders: jest.fn(),
  };
}
