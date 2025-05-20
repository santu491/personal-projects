import { act, renderHook } from '@testing-library/react-hooks';

import { SelectCounselorSetting } from '../../../config/constants/constants';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { Screen } from '../../../navigation/providers.navigationTypes';
import { useCounselorSettings } from '../useCounselorSettings';

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

describe('useCounselorSettings', () => {
  const mockNavigate = jest.fn();
  const mockLinkTo = jest.fn();
  const mockSetScheduleAppointmentInfo = jest.fn();
  const mockSetIsAddOrRemoveCounselorEnabled = jest.fn();

  const mockContextValue = {
    scheduleAppointmentInfo: {},
    setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
    appointmentAssessmentStatus: false,
    setIsAddOrRemoveCounselorEnabled: mockSetIsAddOrRemoveCounselorEnabled,
    memberAppointmentStatus: 'status',
    navigation: { navigate: mockNavigate },
    navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: jest.fn() },
  };

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct values', () => {
    const { result } = renderHook(() => useCounselorSettings());

    expect(result.current.selectedValue).toBeUndefined();
    expect(result.current.radioButtons).toEqual([
      { label: 'appointment.counselorSetting.availablePerCounselor', value: SelectCounselorSetting.FIRST_AVAILABLE },
      { label: 'appointment.counselorSetting.choosePreferredDate', value: SelectCounselorSetting.PREFERRED_DATE },
    ]);
  });

  it('should set selectedValue based on scheduleAppointmentInfo', () => {
    const updatedContextValue = {
      ...mockContextValue,
      scheduleAppointmentInfo: { memberSlot: { days: [1, 2, 3] } },
    };
    (useProviderContext as jest.Mock).mockReturnValue(updatedContextValue);

    const { result } = renderHook(() => useCounselorSettings());

    expect(result.current.selectedValue).toBe(SelectCounselorSetting.PREFERRED_DATE);
  });

  it('should handle onChangeSettings', () => {
    const { result } = renderHook(() => useCounselorSettings());

    act(() => {
      result.current.onChangeSettings(SelectCounselorSetting.PREFERRED_DATE);
    });

    expect(result.current.selectedValue).toBe(SelectCounselorSetting.PREFERRED_DATE);
  });

  it('should handle onPressContinue for PREFERRED_DATE', () => {
    const { result } = renderHook(() => useCounselorSettings());

    act(() => {
      result.current.onChangeSettings(SelectCounselorSetting.PREFERRED_DATE);
      result.current.onPressContinue();
    });

    expect(mockNavigate).toHaveBeenCalledWith(Screen.VIEW_COUNSELOR_SETTINGS);
  });

  it('should handle onPressContinue for FIRST_AVAILABLE', () => {
    const { result } = renderHook(() => useCounselorSettings());

    act(() => {
      result.current.onChangeSettings(SelectCounselorSetting.FIRST_AVAILABLE);
      result.current.onPressContinue();
    });

    expect(mockSetScheduleAppointmentInfo).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(Screen.VIEW_COUNSELOR_SETTINGS);
  });

  it('should handle onPressCloseIcon', () => {
    const { result } = renderHook(() => useCounselorSettings());

    act(() => {
      result.current.onPressCloseIcon();
    });

    expect(mockLinkTo).toHaveBeenCalledWith({ action: '/home' });
  });

  it('should handle onPressEditCounselor', () => {
    const { result } = renderHook(() => useCounselorSettings());

    act(() => {
      result.current.onPressEditCounselor();
    });

    expect(mockSetIsAddOrRemoveCounselorEnabled).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith(Screen.PROVIDER_LIST, { hasEditCounselor: true });
  });

  it('should hide tab bar on mount', () => {
    renderHook(() => useCounselorSettings());
    expect(mockContextValue.navigationHandler.requestHideTabBar).toHaveBeenCalledWith(mockContextValue.navigation);
  });
});
