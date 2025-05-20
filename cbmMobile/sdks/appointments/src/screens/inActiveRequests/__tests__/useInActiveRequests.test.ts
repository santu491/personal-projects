import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { mockSelectedProvidersData } from '../../../__mocks__/appointments';
import { useAppointmentContext } from '../../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../../hooks/useGetRequestDetails';
import { RequestHistoryApi } from '../../../models/appointments';
import { useInActiveRequests } from '../useInActiveRequests';

jest.mock('../../../context/appointments.sdkContext');
jest.mock('../../../hooks/useGetRequestDetails');

const mockServiceProvider = {
  callService: jest.fn(),
};

const mockAppointmentContext = {
  serviceProvider: mockServiceProvider,
};

const mockGetRequestDateAndTime = jest.fn();

describe('useInActiveRequests', () => {
  beforeEach(() => {
    (useAppointmentContext as jest.Mock).mockReturnValue(mockAppointmentContext);
    (useGetRequestDetails as jest.Mock).mockReturnValue({ getRequestDateAndTime: mockGetRequestDateAndTime });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useInActiveRequests());
    expect(result.current.loading).toBe(true);
    expect(result.current.isServerError).toBe(false);
    expect(result.current.inActiveRequestsList).toEqual([]);
  });

  it('should fetch inactive requests and update state', async () => {
    const mockResponse = {
      data: [
        {
          id: '1',
          selectedProviders: mockSelectedProvidersData,
          clinicalQuestions: { questionnaire: [{ presentingProblem: 'Problem1' }] },
          memberPrefferedSlot: '2023-10-10T10:00:00Z',
        },
      ],
    };

    mockServiceProvider.callService.mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useInActiveRequests());

    act(() => {
      result.current.getInActiveRequestsListApi();
    });

    await waitForNextUpdate();

    expect(mockServiceProvider.callService).toHaveBeenCalledWith(
      `${API_ENDPOINTS.APPOINTMENT_REQUESTS}?status=${RequestHistoryApi.CANCELED}`,
      RequestMethod.GET,
      null,
      { isSecureToken: true }
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.inActiveRequestsList.length).toBe(2);
    expect(result.current.isServerError).toBe(false);
  });

  it('should handle server error', async () => {
    mockServiceProvider.callService.mockRejectedValue(new Error('Server Error'));

    const { result, waitForNextUpdate } = renderHook(() => useInActiveRequests());

    act(() => {
      result.current.getInActiveRequestsListApi();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.inActiveRequestsList).toEqual([]);
    expect(result.current.isServerError).toBe(true);
  });

  it('should retry fetching inactive requests on try again', async () => {
    mockServiceProvider.callService.mockRejectedValueOnce(new Error('Server Error'));
    mockServiceProvider.callService.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          selectedProviders: mockSelectedProvidersData,
          clinicalQuestions: { questionnaire: [{ presentingProblem: 'Problem1' }] },
          memberPrefferedSlot: '2023-10-10T10:00:00Z',
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(() => useInActiveRequests());

    act(() => {
      result.current.getInActiveRequestsListApi();
    });

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(true);

    act(() => {
      result.current.onPressTryAgain();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.inActiveRequestsList.length).toBe(0);
    expect(result.current.isServerError).toBe(true);
  });

  it('should handle empty active requests response', async () => {
    mockServiceProvider.callService.mockResolvedValueOnce({ data: [] });

    const { result, waitForNextUpdate } = renderHook(() => useInActiveRequests());

    await waitForNextUpdate();

    expect(result.current.inActiveRequestsList).toEqual([]);
  });
});
