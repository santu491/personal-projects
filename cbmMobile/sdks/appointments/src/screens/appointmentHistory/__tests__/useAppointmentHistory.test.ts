import { renderHook } from '@testing-library/react-hooks';

import * as appContext from '../../../../../../src/context/appContext';
import * as appointmentContext from '../../../context/appointments.sdkContext';
import { Screen } from '../../../navigation/appointment.navigationTypes';
import { useAppointmentHistory } from '../useAppointmentHistory';

describe('useAppointmentHistory', () => {
  let mockUseAppointmentContext: jest.Mock;
  let mockUseAppContext: jest.Mock;

  beforeEach(() => {
    mockUseAppointmentContext = jest.fn().mockReturnValue({
      navigation: { navigate: jest.fn() },
      navigationHandler: { linkTo: jest.fn() },
      loggedIn: false,
    });
    mockUseAppContext = jest.fn().mockReturnValue({
      pushNotificationPayload: null,
      setPushNotificationPayload: jest.fn(),
    });

    jest.spyOn(appContext, 'useAppContext').mockImplementation(mockUseAppContext);
    jest.spyOn(appointmentContext, 'useAppointmentContext').mockImplementation(mockUseAppointmentContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return appointment history data with translated labels', () => {
    const { result } = renderHook(() => useAppointmentHistory());
    expect(result.current.appointmentHistoryData).toEqual([
      { label: 'appointments.pendingRequests', action: 'PendingRequests' },
      { label: 'appointments.confirmedRequests', action: 'ConfirmedRequests' },
      { label: 'appointments.inactiveRequests', action: 'InActiveRequests' },
      { label: 'appointments.appointmentDetails', action: 'AppointmentDetails' },
    ]);
  });

  it('should set isShownLoginAlert to true if user is not logged in', () => {
    const { result } = renderHook(() => useAppointmentHistory());
    result.current.handleAppointmentHistoryNavigation(Screen.PENDING_REQUESTS);
    expect(result.current.isShownLoginAlert).toBe(true);
  });

  it('should navigate to the correct screen if user is logged in', () => {
    mockUseAppointmentContext.mockReturnValueOnce({
      ...mockUseAppointmentContext(),
      loggedIn: true,
    });
    const { result } = renderHook(() => useAppointmentHistory());

    result.current.handleAppointmentHistoryNavigation(Screen.PENDING_REQUESTS);
    expect(result.current.isShownLoginAlert).toBe(false);
    expect(mockUseAppointmentContext().navigation.navigate).toHaveBeenCalledWith('PendingRequests');
  });

  it('should call navigationHandler.linkTo with login action on handle sign in', () => {
    const { result } = renderHook(() => useAppointmentHistory());
    result.current.onHandleSignIn();
    expect(result.current.isShownLoginAlert).toBe(false);
    expect(mockUseAppointmentContext().navigationHandler.linkTo).toHaveBeenCalledWith({ action: '/login' });
  });

  it('should set isShownLoginAlert to false when onCloseAlert is called', () => {
    const { result } = renderHook(() => useAppointmentHistory());
    result.current.onCloseAlert();
    expect(result.current.isShownLoginAlert).toBe(false);
  });
});
