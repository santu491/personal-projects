import { useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';

import { mockSelectedProvidersData } from '../../../__mocks__/appointments';
import { CancelRequestType, CancelScreenType } from '../../../constants/constants';
import { useAppointmentContext } from '../../../context/appointments.sdkContext';
import { RequestCurrentStatus } from '../../../models/appointments';
import { useAppointmentCancel } from '../useAppointmentCancel';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../../context/appointments.sdkContext', () => ({
  useAppointmentContext: jest.fn(),
}));

jest.mock('../../../hooks/useGetRequestDetails', () => ({
  useGetRequestDetails: jest.fn().mockReturnValue({
    getRequestDateAndTime: jest.fn(),
  }),
}));

describe('useAppointmentCancel', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const mockServiceProvider = { callService: jest.fn() };
  const mockSelectedProviders = mockSelectedProvidersData;

  beforeEach(() => {
    (useAppointmentContext as jest.Mock).mockReturnValue({
      navigation: mockNavigation,
      serviceProvider: mockServiceProvider,
      selectedProviders: mockSelectedProviders,
      setSelectedProviders: jest.fn(),
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        screenType: CancelScreenType.APPOINTMENT_DETAIL_REQUEST,
        appointmentCurrentStatus: RequestCurrentStatus.ACCEPTED,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useAppointmentCancel());
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.isRequestCanceled).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.providerDetails).toHaveLength(1);
  });

  it('should handle cancel request', () => {
    const { result } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.CANCEL);
    expect(result.current.selectedProvider?.providerId).toBe('1');

    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.cancelAlertTitle');

    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.cancelAlertDescription'
    );

    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelAlertPrimaryButton');

    expect(result.current.secondaryButtonTitle()).toBe(
      'appointments.appointmentDetailsContent.cancelAlertSecondaryButton'
    );
  });

  it('should handle cancel all requests', () => {
    const { result } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.CANCEL_ALL);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.cancelAllAlertTitle');

    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.cancelAllAlertDescription'
    );

    expect(result.current.primaryButtonTitle()).toBe(
      'appointments.appointmentDetailsContent.cancelAllAlertPrimaryButton'
    );

    expect(result.current.secondaryButtonTitle()).toBe(
      'appointments.appointmentDetailsContent.cancelAllAlertSecondaryButton'
    );
  });

  it('should handle confirm request', () => {
    const { result } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleConfirmRequest('1');
    });
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.CONFIRM);
    expect(result.current.selectedProvider?.providerId).toBe('1');
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.confirmRequest');

    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.confirmRequestDescription'
    );

    expect(result.current.primaryButtonTitle()).toBe(
      'appointments.appointmentDetailsContent.confirmAlertPrimaryButton'
    );

    expect(result.current.secondaryButtonTitle()).toBe('appointments.appointmentDetailsContent.previousButton');
  });

  it('should handle alert primary button press for cancel', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');

    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');

    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');

    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle alert secondary button press', () => {
    const { result } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    act(() => {
      result.current.onAlertSecondaryButtonPress();
    });
    expect(result.current.isCancelAlert).toBe(false);
  });

  it('should handle server error during cancel request', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during confirm request', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleConfirmRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during cancel all requests', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle request canceled scenario', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUEST_CANCELED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.requestCanceledTitle');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestCanceledDescription'
    );
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');
  });

  it('should handle requests canceled scenario', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUESTS_CANCELED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.allRequestCanceledTitle');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.allRequestCanceledDescription'
    );
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');

    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle request confirmed scenario', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleConfirmRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUEST_CONFIRMED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.confirmRequestButton');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestConfirmedDescription'
    );
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');

    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle request confirmed scenario with multiple providers', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleConfirmRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUEST_CONFIRMED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.confirmRequestButton');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestConfirmedDescription'
    );
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle request canceled scenario with multiple providers', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUEST_CANCELED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.requestCanceledTitle');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestCanceledDescription'
    );
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle requests canceled scenario with multiple providers', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUESTS_CANCELED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.allRequestCanceledTitle');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.allRequestCanceledDescription'
    );
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during cancel request with multiple providers', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during confirm request with multiple providers', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleConfirmRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during cancel all requests with multiple providers', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle request canceled scenario with single provider', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(false);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUEST_CANCELED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.requestCanceledTitle');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.requestCanceledDescription'
    );
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle requests canceled scenario with single provider', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    (mockServiceProvider.callService as jest.Mock).mockResolvedValueOnce({ data: true });
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.REQUESTS_CANCELED);
    expect(result.current.cancelAlertTitle()).toBe('appointments.appointmentDetailsContent.allRequestCanceledTitle');
    expect(result.current.cancelAlertDescription()).toBe(
      'appointments.appointmentDetailsContent.allRequestCanceledDescription'
    );
    expect(result.current.primaryButtonTitle()).toBe('appointments.appointmentDetailsContent.cancelSuccessButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during cancel request with single provider', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during confirm request with single provider', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleConfirmRequest('1');
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');
    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });

  it('should handle server error during cancel all requests with single provider', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAppointmentCancel());
    act(() => {
      result.current.onHandleCancelAll();
    });
    (mockServiceProvider.callService as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
    await act(async () => {
      result.current.onAlertPrimaryButtonPress();
      await waitForNextUpdate();
    });
    expect(result.current.isRequestCanceled).toBe(true);
    expect(result.current.isCancelAlert).toBe(true);
    expect(result.current.cancelRequestType).toBe(CancelRequestType.SERVER_ERROR);
    expect(result.current.cancelAlertTitle()).toBe('appointments.errors.title');
    expect(result.current.cancelAlertDescription()).toBe('appointments.errors.description');
    expect(result.current.primaryButtonTitle()).toBe('appointments.errors.tryAgainButton');

    expect(result.current.secondaryButtonTitle()).toBe(undefined);
  });
});
