import { act, renderHook } from '@testing-library/react-hooks';

import { mockSelectedProvidersData } from '../../../__mocks__/appointments';
import { useAppointmentContext } from '../../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../../hooks/useGetRequestDetails';
import { usePendingRequests } from '../usePendingRequests';

jest.mock('../../../context/appointments.sdkContext');
jest.mock('../../../hooks/useGetRequestDetails');

describe('usePendingRequests', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockServiceProvider = { callService: jest.fn() };
  const mockAppointmentContext = {
    navigation: mockNavigation,
    serviceProvider: mockServiceProvider,
    setSelectedProviders: jest.fn(),
  };

  beforeEach(() => {
    (useAppointmentContext as jest.Mock).mockReturnValue(mockAppointmentContext);
    (useGetRequestDetails as jest.Mock).mockReturnValue({
      getRequestDateAndTime: jest.fn().mockReturnValue('mocked date and time'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePendingRequests());
    expect(result.current.pendingRequestsList).toBeUndefined();
    expect(result.current.loading).toBe(true);
    expect(result.current.isServerError).toBe(false);
  });

  it('should handle server error correctly', async () => {
    mockServiceProvider.callService.mockRejectedValue(new Error('Server error'));

    const { result, waitForNextUpdate } = renderHook(() => usePendingRequests());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.isServerError).toBe(true);
    expect(result.current.pendingRequestsList).toBeUndefined();
  });

  it('should retry fetching data on onPressTryAgain', async () => {
    const mockResponse = {
      data: [
        {
          id: '1',
          selectedProviders: mockSelectedProvidersData,
          clinicalQuestions: { questionnaire: [{ presentingProblem: 'Problem' }] },
          memberPrefferedSlot: '2023-10-10T10:00:00Z',
        },
      ],
    };

    mockServiceProvider.callService.mockRejectedValueOnce(new Error('Server error'));
    mockServiceProvider.callService.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => usePendingRequests());

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(true);

    act(() => {
      result.current.onPressTryAgain();
    });

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(false);
    expect(result.current.pendingRequestsList).toEqual({
      listData: [
        { label: 'appointments.counselor', value: 'John Doe' },
        { label: 'appointments.problem', value: 'Problem' },
        { label: 'appointments.dateTime', value: 'mocked date and time' },
        { label: 'appointments.status', value: 'Approved' },
      ],
      title: 'appointments.pendingRequests',
      status: 'ACCEPTED',
      providerId: '1',
      requestCount: undefined,
    });
  });

  it('should navigate to appointment details on onPressContinueButton', () => {
    const { result } = renderHook(() => usePendingRequests());

    act(() => {
      result.current.onPressContinueButton();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AppointmentDetailsRequests', {
      screenType: 'MULTIPLE_PENDING_REQUESTS',
    });
  });

  it('should navigate to cancel request screen on onPressCancelRequest', () => {
    const { result } = renderHook(() => usePendingRequests());

    act(() => {
      result.current.onPressCancelRequest();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AppointmentDetailsRequests', {
      screenType: 'CANCEL_REQUEST',
    });
  });

  it('should handle empty pending requests response', async () => {
    mockServiceProvider.callService.mockResolvedValueOnce({ data: [] });

    const { result, waitForNextUpdate } = renderHook(() => usePendingRequests());

    await waitForNextUpdate();

    expect(result.current.pendingRequestsList).toBeUndefined();
  });
});
