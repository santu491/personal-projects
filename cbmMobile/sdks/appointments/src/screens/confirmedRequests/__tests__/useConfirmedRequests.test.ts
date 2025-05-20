import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { mockSelectedProvidersData, mockSelectedProvidersListData } from '../../../__mocks__/appointments';
import { useAppointmentContext } from '../../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../../hooks/useGetRequestDetails';
import { RequestCurrentStatus, RequestHistoryApi } from '../../../models/appointments';
import { Screen } from '../../../navigation/appointment.navigationTypes';
import { useConfirmedRequests } from '../useConfirmedRequests';

jest.mock('../../../context/appointments.sdkContext');
jest.mock('../../../hooks/useGetRequestDetails');

describe('useConfirmedRequests', () => {
  const mockAppointmentContext = {
    serviceProvider: {
      callService: jest.fn(),
    },
    selectedProviders: mockSelectedProvidersData,
    setSelectedProviders: jest.fn(),
    navigation: {
      navigate: jest.fn(),
    },
  };

  const mockGetRequestDetails = {
    getRequestDateAndTime: jest.fn().mockReturnValue('2023-01-02 10:00 AM'),
  };

  beforeEach(() => {
    (useAppointmentContext as jest.Mock).mockReturnValue(mockAppointmentContext);
    (useGetRequestDetails as jest.Mock).mockReturnValue(mockGetRequestDetails);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch confirmed requests list on mount', async () => {
    const mockResponse = {
      data: [
        {
          id: '123',
          selectedProviders: mockSelectedProvidersListData,
        },
      ],
    };

    mockAppointmentContext.serviceProvider.callService.mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useConfirmedRequests());

    await waitForNextUpdate();

    expect(mockAppointmentContext.serviceProvider.callService).toHaveBeenCalledWith(
      `${API_ENDPOINTS.APPOINTMENT_REQUESTS}?status=${RequestHistoryApi.CONFIRMED}`,
      RequestMethod.GET,
      null,
      { isSecureToken: true }
    );

    expect(result.current.confirmedRequestsList).toEqual([
      {
        listData: expect.any(Array),
        title: 'John Doe, Dr.',
        status: RequestCurrentStatus.APPROVED,
        dateOfInitiation: '',
        providerId: '1',
      },
    ]);
  });

  it('should handle server error when fetching confirmed requests', async () => {
    mockAppointmentContext.serviceProvider.callService.mockRejectedValue(new Error('Server Error'));

    const { result, waitForNextUpdate } = renderHook(() => useConfirmedRequests());

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(true);
    expect(result.current.confirmedRequestsList).toEqual([]);
  });

  it('should handle cancel request', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleCancelRequest('1');
    });

    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe('Cancel');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.cancelAlertDescription'
    );
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.cancelAlertTitle');

    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelAlertPrimaryButton');

    expect(result.current.secondaryButtonTitle()).toBe(
      'appointments.appointmentDetailsContent.cancelAlertSecondaryButton'
    );
  });

  it('should handle alert primary button press for cancel request', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleCancelRequest('1');
    });

    mockAppointmentContext.serviceProvider.callService.mockResolvedValue({});

    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
    });

    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.cancelRequestType).toBe('RequestCanceled');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestCanceledDescription'
    );
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.requestCanceledTitle');

    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');

    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle alert secondary button press', () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onAlertSecondaryButtonPress();
    });

    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.isRequestCanceled).toBe(false);
  });

  it('should handle try again button press', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onPressTryAgain();
    });

    expect(result.current.isServerError).toBe(false);
    expect(mockAppointmentContext.serviceProvider.callService).toHaveBeenCalled();
  });

  it('should navigate to other requests screen on handle view other requests', () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleViewOtherRequests();
    });

    expect(mockAppointmentContext.navigation.navigate).toHaveBeenCalledWith(
      Screen.VIEW_OTHER_REQUESTS,
      expect.objectContaining({
        otherRequestList: undefined,
        dateOfInitiation: '',
      })
    );
  });

  it('should handle alert primary button press for server error', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleCancelRequest('1');
    });

    mockAppointmentContext.serviceProvider.callService.mockRejectedValue(new Error('Server Error'));

    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
    });

    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.cancelRequestType).toBe('ServerError');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle alert primary button press for request canceled', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleCancelRequest('1');
    });

    mockAppointmentContext.serviceProvider.callService.mockResolvedValue({});

    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
    });

    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.cancelRequestType).toBe('RequestCanceled');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestCanceledDescription'
    );
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.requestCanceledTitle');
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should set loading to true when fetching confirmed requests', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.getConfirmedRequestsListApi();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });

  it('should set loading to false and handle error when fetching confirmed requests fails', async () => {
    mockAppointmentContext.serviceProvider.callService.mockRejectedValue(new Error('Server Error'));

    const { result, waitForNextUpdate } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.getConfirmedRequestsListApi();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.isServerError).toBe(true);
    expect(result.current.confirmedRequestsList).toEqual([]);
  });

  it('should set loading to true when canceling a request', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleCancelRequest('1');
    });

    mockAppointmentContext.serviceProvider.callService.mockResolvedValue({});

    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isRequestCanceled).toBe(true);
  });

  it('should handle server error when canceling a request', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onHandleCancelRequest('1');
    });

    mockAppointmentContext.serviceProvider.callService.mockRejectedValue(new Error('Server Error'));

    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.cancelRequestType).toBe('ServerError');
  });

  it('should handle try again button press and reset server error', async () => {
    const { result } = renderHook(() => useConfirmedRequests());

    act(() => {
      result.current.onPressTryAgain();
    });

    expect(result.current.isServerError).toBe(false);
    expect(mockAppointmentContext.serviceProvider.callService).toHaveBeenCalled();
  });
});
