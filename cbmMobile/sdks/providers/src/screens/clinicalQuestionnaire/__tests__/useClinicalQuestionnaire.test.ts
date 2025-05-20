import { useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { useGetMdLiveData } from '../../../../../../src/hooks/useGetMdLiveData';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { Screen } from '../../../navigation/providers.navigationTypes';
import { useClinicalQuestionnaire } from '../useClinicalQuestionnaire';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

jest.mock('../../../../../../src/hooks/useGetMdLiveData', () => ({
  useGetMdLiveData: jest.fn(),
}));

describe('useClinicalQuestionnaire', () => {
  const mockNavigation = { navigate: jest.fn(), canGoBack: jest.fn(), goBack: jest.fn() };
  const mockServiceProvider = { callService: jest.fn() };
  const mockSetScheduleAppointmentInfo = jest.fn();
  const mockNavigationHandler = { linkTo: jest.fn(), requestHideTabBar: jest.fn() };
  const mockSetShowError = jest.fn();
  const mockGetMdLiveData = jest.fn();

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue({
      serviceProvider: mockServiceProvider,
      scheduleAppointmentInfo: { clinicalQuestions: { questionnaire: [{}] } },
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      navigation: mockNavigation,
      navigationHandler: mockNavigationHandler,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: { appointmentFlowStatus: true },
    });

    (useGetMdLiveData as jest.Mock).mockReturnValue({
      getMdLiveData: mockGetMdLiveData,
      setShowError: mockSetShowError,
      showError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useClinicalQuestionnaire());
    expect(result.current.problemInfo).toBeUndefined();
  });

  it('should handle onPressCloseIcon correctly', () => {
    const { result } = renderHook(() => useClinicalQuestionnaire());
    act(() => {
      result.current.onPressCloseIcon();
    });
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });

  it('should handle onChangeValue correctly', () => {
    const { result } = renderHook(() => useClinicalQuestionnaire());
    act(() => {
      result.current.onChangeValue();
    });
  });

  it('should handle onPressContinue correctly', () => {
    const { result } = renderHook(() => useClinicalQuestionnaire());
    act(() => {
      result.current.onPressContinue();
    });

    expect(mockGetMdLiveData).toHaveBeenCalled();
  });

  it('should handle onPressContinue correctly if appointmentFlowStatus as false', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { appointmentFlowStatus: false },
    });

    const { result } = renderHook(() => useClinicalQuestionnaire());
    act(() => {
      result.current.onPressContinue();
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.COUNSELOR_SETTINGS);
  });

  it('should handle handleTryAgain correctly', () => {
    const { result } = renderHook(() => useClinicalQuestionnaire());
    act(() => {
      result.current.handleTryAgain();
    });
    expect(mockSetShowError).toHaveBeenCalledWith(false);
  });

  it('should hide tab bar on mount', () => {
    renderHook(() => useClinicalQuestionnaire());
    expect(mockNavigationHandler.requestHideTabBar).toHaveBeenCalledWith(mockNavigation);
  });
});
