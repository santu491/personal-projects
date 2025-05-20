import { act, renderHook } from '@testing-library/react-hooks';

import { callNumber } from '../../../../../../shared/src/utils/utils';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { Screen } from '../../../navigation/providers.navigationTypes';
import { useScheduleAppointment } from '../useScheduleAppointment';

jest.mock('../../../context/provider.sdkContext');
jest.mock('../../../../../../src/util/commonUtils');

jest.mock('../../../../../../shared/src/utils/utils');

describe('useScheduleAppointment', () => {
  const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() };
  const mockNavigationHandler = { requestHideTabBar: jest.fn(), linkTo: jest.fn() };
  const mockServiceProvider = { callService: jest.fn() };
  const mockContextValue = {
    serviceProvider: mockServiceProvider,
    appointmentAssessmentStatus: false,
    scheduleAppointmentInfo: {},
    setAppointmentAssessmentStatus: jest.fn(),
    setScheduleAppointmentInfo: jest.fn(),
    isAddOrRemoveCounselorEnabled: false,
    setSelectedProviders: jest.fn(),

    memberAppointmentStatus: { data: [{ firstName: 'John', lastName: 'Doe' }], isContinue: false },
    navigation: mockNavigation,
    navigationHandler: mockNavigationHandler,
    client: { supportNumber: '1234567890' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProviderContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it('should fetch client support number on mount', async () => {
    const { result } = renderHook(() => useScheduleAppointment());
    expect(result.current.clientSupportNumber).toBe('1234567890');
  });

  it('should hide tab bar on mount', () => {
    renderHook(() => useScheduleAppointment());
    expect(mockNavigationHandler.requestHideTabBar).toHaveBeenCalledWith(mockNavigation);
  });

  it('should check assessment status on mount', async () => {
    (mockServiceProvider.callService as jest.Mock).mockResolvedValue({ data: true });
    await act(async () => {
      renderHook(() => useScheduleAppointment());
    });
    expect(mockContextValue.setAppointmentAssessmentStatus).toHaveBeenCalled();
  });

  it('should handle onPressLeftArrow', () => {
    const { result } = renderHook(() => useScheduleAppointment());
    act(() => {
      result.current.onPressLeftArrow();
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should handle onPressContinue', () => {
    const { result } = renderHook(() => useScheduleAppointment());
    act(() => {
      result.current.onPressContinue();
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.COUNSELOR_SETTINGS);
  });

  it('should handle onPressContinue with appointmentFlowStatus as false', () => {
    const updateMockContextValue = {
      ...mockContextValue,
      appointmentAssessmentStatus: true,
    };
    (useProviderContext as jest.Mock).mockReturnValue(updateMockContextValue);
    const { result } = renderHook(() => useScheduleAppointment());
    act(() => {
      result.current.onPressContinue();
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.CLINICAL_QUESTIONNAIRE, {
      appointmentFlowStatus: false,
    });
  });

  it('should handle onPressContact', () => {
    const { result } = renderHook(() => useScheduleAppointment());
    act(() => {
      result.current.onPressContact();
    });
    expect(callNumber).toHaveBeenCalledWith(result.current.clientSupportNumber);
  });
});
