import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { TimeRange } from '../../../config/constants/constants';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { Screen } from '../../../navigation/providers.navigationTypes';
import { useSelectTimeRange } from '../useSelectTimeRange';

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

describe('useSelectTimeRange', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  const mockNavigationHandler = {
    linkTo: jest.fn(),
    requestHideTabBar: jest.fn(),
  };
  const mockSetScheduleAppointmentInfo = jest.fn();

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {},
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      appointmentAssessmentStatus: false,
      navigation: mockNavigation,
      navigationHandler: mockNavigationHandler,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSelectTimeRange());

    expect(result.current.selectedTimeRange).toBeUndefined();
    expect(result.current.timeRange).toHaveLength(5);
  });

  it('should set selectedTimeRange when scheduleAppointmentInfo has memberSlot time', () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: { memberSlot: { time: TimeRange.MORNING } },
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      appointmentAssessmentStatus: false,
      navigation: mockNavigation,
      navigationHandler: mockNavigationHandler,
    });

    const { result } = renderHook(() => useSelectTimeRange());

    expect(result.current.selectedTimeRange).toBe(TimeRange.MORNING);
  });

  it('should update selectedTimeRange on onChangeTimeRange', () => {
    const { result } = renderHook(() => useSelectTimeRange());

    act(() => {
      result.current.onChangeTimeRange(TimeRange.AFTERNOON);
    });

    expect(result.current.selectedTimeRange).toBe(TimeRange.AFTERNOON);
  });

  it('should navigate to the correct screen on onPressContinue', () => {
    const { result } = renderHook(() => useSelectTimeRange());

    act(() => {
      result.current.onPressContinue();
    });

    expect(mockSetScheduleAppointmentInfo).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.VIEW_COUNSELOR_SETTINGS);
  });

  it('should navigate to home on onPressCloseIcon', () => {
    const { result } = renderHook(() => useSelectTimeRange());

    act(() => {
      result.current.onPressCloseIcon();
    });

    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });
});
