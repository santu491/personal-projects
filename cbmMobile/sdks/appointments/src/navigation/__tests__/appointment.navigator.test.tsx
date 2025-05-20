import { Screen } from '../appointment.navigationTypes';
import { appointmentsNavConfig } from '../appointment.navigator';

describe('AppointmentsNavigator', () => {
  it('matches navigation config', () => {
    expect(appointmentsNavConfig.screens?.[Screen.APPOINTMENTS_HISTORY]).toBe('/appointments/history');
    expect(appointmentsNavConfig.screens?.[Screen.PENDING_REQUESTS]).toBe('/appointments/pending-requests');
    expect(appointmentsNavConfig.screens?.[Screen.INACTIVE_REQUESTS]).toBe('/appointments/inactive-requests');
    expect(appointmentsNavConfig.screens?.[Screen.CONFIRMED_REQUESTS]).toBe('/appointments/confirmed-requests');
  });
});
