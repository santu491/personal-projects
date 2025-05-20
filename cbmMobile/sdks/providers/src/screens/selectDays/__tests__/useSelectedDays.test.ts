import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useDaysInfoList } from '../../../hooks/useDaysInfoList';
import { useSelectedDays } from '../useSelectedDays';

jest.mock('../../../context/provider.sdkContext');
jest.mock('../../../hooks/useDaysInfoList');

describe('useSelectedDays', () => {
  const mockSetScheduleAppointmentInfo = jest.fn();
  const mockSetIsBottomTabBarDisabled = jest.fn();

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: { memberSlot: { days: ['monday'] } },
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      setIsBottomTabBarDisabled: mockSetIsBottomTabBarDisabled,
      navigationHandler: { linkTo: jest.fn(), requestHideTabBar: jest.fn() },
    });
    (useDaysInfoList as jest.Mock).mockReturnValue({
      daysInfoList: [
        { value: 'monday', isSelected: false },
        { value: 'tuesday', isSelected: false },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useSelectedDays());
    expect(result.current.daysInfo).toEqual([
      { value: 'monday', isSelected: true },
      { value: 'tuesday', isSelected: false },
    ]);
    expect(result.current.isContinueButtonEnabled).toBe(true);
  });

  it('should enable continue button when a day is selected', () => {
    const { result } = renderHook(() => useSelectedDays());
    act(() => {
      result.current.onPressDay('tuesday');
    });
    expect(result.current.isContinueButtonEnabled).toBe(true);
  });

  it('should update daysInfo when scheduleAppointmentInfo changes', () => {
    const { result, rerender } = renderHook(() => useSelectedDays());
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: { memberSlot: { days: ['tuesday'] } },
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      setIsBottomTabBarDisabled: mockSetIsBottomTabBarDisabled,
      navigationHandler: { linkTo: jest.fn(), requestHideTabBar: jest.fn() },
    });
    rerender();
    expect(result.current.daysInfo).toEqual([
      { value: 'monday', isSelected: false },
      { value: 'tuesday', isSelected: true },
    ]);
  });

  it('should navigate and update state on pressing continue', () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: { memberSlot: { days: ['monday'] } },
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      setIsBottomTabBarDisabled: mockSetIsBottomTabBarDisabled,
      navigation: { navigate: jest.fn() },
      navigationHandler: { linkTo: jest.fn(), requestHideTabBar: jest.fn() },
    });
    const { result } = renderHook(() => useSelectedDays());
    act(() => {
      result.current.onPressContinue();
    });
    expect(mockSetScheduleAppointmentInfo).toHaveBeenCalledWith({
      memberSlot: { days: ['monday'] },
    });
  });

  it('should navigate and update state on pressing close icon', () => {
    const { result } = renderHook(() => useSelectedDays());
    act(() => {
      result.current.onPressCloseIcon();
    });
    const linkToSpy = jest.spyOn(useProviderContext().navigationHandler, 'linkTo');

    expect(linkToSpy).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });

  it('should update daysInfo on pressing a day', () => {
    const { result } = renderHook(() => useSelectedDays());
    act(() => {
      result.current.onPressDay('tuesday');
    });
    expect(result.current.daysInfo).toEqual([
      { value: 'monday', isSelected: true },
      { value: 'tuesday', isSelected: true },
    ]);
  });
});
