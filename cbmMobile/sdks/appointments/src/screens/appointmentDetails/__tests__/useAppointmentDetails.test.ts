import { act, renderHook } from '@testing-library/react-hooks';

import { mockSelectedProvidersData } from '../../../__mocks__/appointments';
import { useAppointmentContext } from '../../../context/appointments.sdkContext';
import { Screen } from '../../../navigation/appointment.navigationTypes';
import { useAppointmentDetails } from '../useAppointmentDetails';

jest.mock('../../../context/appointments.sdkContext');

const mockAppointmentContext = {
  navigation: { navigate: jest.fn() },
  serviceProvider: { callService: jest.fn() },
  setSelectedProviders: jest.fn(),
};

describe('useAppointmentDetails', () => {
  beforeEach(() => {
    (useAppointmentContext as jest.Mock).mockReturnValue(mockAppointmentContext);
  });

  it('should fetch appointment details on mount', async () => {
    const appointmentData = {
      isApproved: true,
      selectedProviders: mockSelectedProvidersData,
      memberPrefferedSlot: '2023-10-10T10:00:00Z',
      clinicalQuestions: [],
      id: 'appointment-123',
    };
    mockAppointmentContext.serviceProvider.callService.mockResolvedValue({ data: appointmentData });

    const { result, waitForNextUpdate } = renderHook(() => useAppointmentDetails());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.appointmentDetailsList).toHaveLength(3);
    expect(mockAppointmentContext.setSelectedProviders).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should handle server error', async () => {
    mockAppointmentContext.serviceProvider.callService.mockRejectedValue(new Error('Server error'));

    const { result, waitForNextUpdate } = renderHook(() => useAppointmentDetails());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.isServerError).toBe(true);
  });

  it('should handle navigation correctly', () => {
    const { result } = renderHook(() => useAppointmentDetails());

    act(() => {
      result.current.handleNavigation(Screen.APPOINTMENT_DETAILS_REQUESTS);
    });

    expect(mockAppointmentContext.navigation.navigate).toHaveBeenCalledWith(Screen.APPOINTMENT_DETAILS_REQUESTS, {
      screenType: 'APPOINTMENT_DETAIL_REQUEST',
      appointmentCurrentStatus: undefined,
    });
  });

  it('should retry fetching appointment details on try again', async () => {
    mockAppointmentContext.serviceProvider.callService.mockRejectedValueOnce(new Error('Server error'));
    mockAppointmentContext.serviceProvider.callService.mockResolvedValueOnce({ data: {} });

    const { result, waitForNextUpdate } = renderHook(() => useAppointmentDetails());

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(true);

    act(() => {
      result.current.onPressTryAgain();
    });

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(false);
  });
});
