import { renderHook } from '@testing-library/react-hooks';

import { useDaysInfoList } from '../../../../../providers/src/hooks/useDaysInfoList';
import { useAppointmentContext } from '../../../context/appointments.sdkContext';
import { useProposedDaysAndTime } from '../useProposedDaysAndTime';

jest.mock('../../../../../providers/src/hooks/useDaysInfoList');
jest.mock('../../../context/appointments.sdkContext');

describe('useProposedDaysAndTime', () => {
  beforeEach(() => {
    (useDaysInfoList as jest.Mock).mockReturnValue({
      daysInfoList: [
        { value: 'monday', day: 'Monday' },
        { value: 'tuesday', day: 'Tuesday' },
      ],
    });

    (useAppointmentContext as jest.Mock).mockReturnValue({
      selectedProviders: [
        {
          memberPrefferedSlot: {
            days: ['monday', 'tuesday'],
            time: '10:00 AM',
          },
          clinicalQuestions: {
            questionnaire: [{ question: 'Do you have any allergies?', answer: 'No' }],
          },
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct days and time', () => {
    const { result } = renderHook(() => useProposedDaysAndTime());

    expect(result.current.days).toEqual(['Monday', 'Tuesday']);
    expect(result.current.time).toBe('10:00 AM');
  });

  it('should return the correct clinicalInfo', () => {
    const { result } = renderHook(() => useProposedDaysAndTime());

    expect(result.current.clinicalInfo).toEqual({
      question: 'Do you have any allergies?',
      answer: 'No',
    });
  });

  it('should return empty days if memberSlot days are not available', () => {
    (useAppointmentContext as jest.Mock).mockReturnValue({
      selectedProviders: [
        {
          memberPrefferedSlot: {
            days: [],
            time: '10:00 AM',
          },
          clinicalQuestions: {
            questionnaire: [{ question: 'Do you have any allergies?', answer: 'No' }],
          },
        },
      ],
    });

    const { result } = renderHook(() => useProposedDaysAndTime());

    expect(result.current.days).toEqual([]);
  });

  it('should return undefined time if memberSlot time is not available', () => {
    (useAppointmentContext as jest.Mock).mockReturnValue({
      selectedProviders: [
        {
          memberPrefferedSlot: {
            days: ['monday', 'tuesday'],
            time: undefined,
          },
          clinicalQuestions: {
            questionnaire: [{ question: 'Do you have any allergies?', answer: 'No' }],
          },
        },
      ],
    });

    const { result } = renderHook(() => useProposedDaysAndTime());

    expect(result.current.time).toBeUndefined();
  });

  it('should return undefined clinicalInfo if clinicalQuestions are not available', () => {
    (useAppointmentContext as jest.Mock).mockReturnValue({
      selectedProviders: [
        {
          memberPrefferedSlot: {
            days: ['monday', 'tuesday'],
            time: '10:00 AM',
          },
          clinicalQuestions: {
            questionnaire: [],
          },
        },
      ],
    });

    const { result } = renderHook(() => useProposedDaysAndTime());

    expect(result.current.clinicalInfo).toBeUndefined();
  });
});
