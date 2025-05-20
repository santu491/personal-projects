import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useDaysInfoList } from '../../../hooks/useDaysInfoList';
import { Screen } from '../../../navigation/providers.navigationTypes';
import { useViewCounselorSettings } from '../useViewCounselorSettings';

jest.mock('../../../context/provider.sdkContext');
jest.mock('../../../hooks/useDaysInfoList');

describe('useViewCounselorSettings', () => {
  const mockNavigate = jest.fn();
  const mockLinkTo = jest.fn();
  const mockSetIsAddOrRemoveCounselorEnabled = jest.fn();

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: { memberSlot: { days: ['monday'], time: '10:00 AM' } },
      setIsAddOrRemoveCounselorEnabled: mockSetIsAddOrRemoveCounselorEnabled,
      memberAppointmentStatus: 'active',
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: jest.fn() },
    });

    (useDaysInfoList as jest.Mock).mockReturnValue({
      daysInfoList: [
        { value: 'monday', day: 'Monday' },
        { value: 'tuesday', day: 'Tuesday' },
      ],
    });
  });

  it('should return correct days', () => {
    const { result } = renderHook(() => useViewCounselorSettings());
    expect(result.current.days).toEqual(['Monday']);
  });

  it('should return correct time', () => {
    const { result } = renderHook(() => useViewCounselorSettings());
    expect(result.current.time).toBe('10:00 AM');
  });

  it('should navigate to REQUEST_APPOINTMENT on onPressContinue', () => {
    const { result } = renderHook(() => useViewCounselorSettings());
    act(() => {
      result.current.onPressContinue();
    });
    expect(mockNavigate).toHaveBeenCalledWith(Screen.REQUEST_APPOINTMENT);
  });

  it('should link to HOME on onPressCloseIcon', () => {
    const { result } = renderHook(() => useViewCounselorSettings());
    act(() => {
      result.current.onPressCloseIcon();
    });
    expect(mockLinkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });

  it('should enable add or remove counselor and navigate to PROVIDER_LIST on onPressEditCounselor', () => {
    const { result } = renderHook(() => useViewCounselorSettings());
    act(() => {
      result.current.onPressEditCounselor();
    });
    expect(mockSetIsAddOrRemoveCounselorEnabled).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith(Screen.PROVIDER_LIST, { hasEditCounselor: true });
  });

  it('should return correct memberAppointmentStatus', () => {
    const { result } = renderHook(() => useViewCounselorSettings());
    expect(result.current.memberAppointmentStatus).toBe('active');
  });
});
