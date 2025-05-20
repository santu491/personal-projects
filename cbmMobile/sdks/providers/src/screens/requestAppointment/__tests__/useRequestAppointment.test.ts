import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useRequestAppointment } from '../useRequestAppointment';

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

describe('useRequestAppointment', () => {
  const mockNavigate = jest.fn();
  const mockLinkTo = jest.fn();
  const mockGoBack = jest.fn();
  const mockCallService = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {
        memberSlot: { days: null, time: null },
        clinicalQuestions: '',
      },
      selectedProviders: [],
      setScheduleAppointmentInfo: jest.fn(),
      setSelectedProviders: jest.fn(),
      navigation: { navigate: mockNavigate, goBack: mockGoBack },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: jest.fn() },
      userProfileData: {
        iamguid: '123',
        firstName: 'John',
        lastName: 'Doe',
        dob: '1990-01-01',
        gender: 'male',
        emailAddress: 'john.doe@example.com',
        communication: { mobileNumber: '1234567890' },
        address: '123 Main St',
        employerType: 'Employer',
        clientGroupId: 'groupId',
        clientName: 'ClientName',
      },
      serviceProvider: { callService: mockCallService },
    });
  });

  it('should submit appointment and set success state', async () => {
    mockCallService.mockResolvedValueOnce({});

    const { result, waitForNextUpdate } = renderHook(() => useRequestAppointment());

    act(() => {
      result.current.onPressContinue();
    });

    await waitForNextUpdate();

    expect(mockCallService).toHaveBeenCalledWith(
      API_ENDPOINTS.SUBMIT_APPOINTMENT,
      RequestMethod.POST,
      expect.any(Object),
      { isSecureToken: true }
    );
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isShownAlert).toBe(true);
  });

  it('should handle appointment submission failure', async () => {
    mockCallService.mockRejectedValueOnce(new Error('Submission failed'));

    const { result, waitForNextUpdate } = renderHook(() => useRequestAppointment());

    act(() => {
      result.current.onPressContinue();
    });

    await waitForNextUpdate();

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isShownAlert).toBe(true);
  });

  it('should navigate back on onPressPreviousButton', () => {
    const { result } = renderHook(() => useRequestAppointment());

    act(() => {
      result.current.onPressPreviousButton();
    });

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should hide alert on onAlertButtonPress when not successful', () => {
    (useProviderContext as jest.Mock).mockReturnValueOnce({
      ...useProviderContext(),
      isSuccess: false,
    });

    const { result } = renderHook(() => useRequestAppointment());

    act(() => {
      result.current.onAlertButtonPress();
    });

    expect(result.current.isShownAlert).toBe(false);
  });
});
