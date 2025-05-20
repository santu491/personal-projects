import { renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { Screen } from '../../../navigation/providers.navigationTypes';
import { useReviewDetails } from '../useReviewDetails';

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

describe('useReviewDetails', () => {
  const mockNavigate = jest.fn();
  const mockLinkTo = jest.fn();
  const mockRequestHideTabBar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return review details with translated questions and clinical info answers', () => {
    const clinicalQuestions = {
      presentingProblem: 'Problem',
      answer: 'Description',
      lessProductivedays: '5',
      jobMissedDays: '2',
    };

    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {
        clinicalQuestions: {
          questionnaire: [clinicalQuestions],
        },
      },
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: mockRequestHideTabBar },
    });

    const { result } = renderHook(() => useReviewDetails());

    expect(result.current.reviewDetails).toEqual([
      {
        question: 'appointment.clinicalQuestionnaire.problem',
        answer: 'Problem',
      },
      {
        question: 'appointment.clinicalQuestionnaire.problemDescription',
        answer: 'Description',
      },
      {
        question: 'appointment.clinicalQuestionnaire.lessProductive',
        answer: '5',
      },
      {
        question: 'appointment.clinicalQuestionnaire.jobMissedDays',
        answer: '2',
      },
    ]);
  });

  it('should navigate to VIEW_COUNSELOR_SETTINGS on onPressContinue', () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {},
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: mockRequestHideTabBar },
    });

    const { result } = renderHook(() => useReviewDetails());

    result.current.onPressContinue();

    expect(mockNavigate).toHaveBeenCalledWith(Screen.VIEW_COUNSELOR_SETTINGS);
  });

  it('should link to HOME on onPressCloseIcon', () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {},
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: mockRequestHideTabBar },
    });

    const { result } = renderHook(() => useReviewDetails());

    result.current.onPressCloseIcon();

    expect(mockLinkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });

  it('should hide tab bar on mount', () => {
    const mockRequestHideTabBar = jest.fn();

    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {},
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: mockRequestHideTabBar },
    });

    renderHook(() => useReviewDetails());

    expect(mockRequestHideTabBar).toHaveBeenCalledWith({ navigate: mockNavigate });
  });

  it('should handle missing clinical info gracefully', () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      scheduleAppointmentInfo: {},
      navigation: { navigate: mockNavigate },
      navigationHandler: { linkTo: mockLinkTo, requestHideTabBar: mockRequestHideTabBar },
    });

    const { result } = renderHook(() => useReviewDetails());

    expect(result.current.reviewDetails).toEqual([
      {
        question: 'appointment.clinicalQuestionnaire.problem',
        answer: undefined,
      },
      {
        question: 'appointment.clinicalQuestionnaire.problemDescription',
        answer: undefined,
      },
      {
        question: 'appointment.clinicalQuestionnaire.lessProductive',
        answer: undefined,
      },
      {
        question: 'appointment.clinicalQuestionnaire.jobMissedDays',
        answer: undefined,
      },
    ]);
  });
});
