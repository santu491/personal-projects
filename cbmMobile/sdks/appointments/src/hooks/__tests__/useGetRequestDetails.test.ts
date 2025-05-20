import { renderHook } from '@testing-library/react-hooks';

import { SelectedProvider } from '../../models/appointmentContextInfo';
import { useGetRequestDetails } from '../useGetRequestDetails';

jest.mock('../../../../../shared/src/utils/utils', () => ({
  formatProviderDate: jest.fn((date) => `formatted-${date}`),
  formatTime: jest.fn((time) => `formatted-${time}`),
}));

describe('useGetRequestDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted provider preferred date and time', () => {
    const request: SelectedProvider = {
      appointmentId: '1',
      currentStatus: 'pending',
      distance: 0,
      firstName: 'John',
      lastName: 'Doe',
      providerId: 'provider-1',
      providerPrefferedDateAndTime: '2023-10-01T10:00:00Z',
      memberPrefferedSlot: { days: [], time: '' },
      providerType: 'Doctor',
      isNewTimeProposed: false,
      memberApprovedTimeForEmail: '',
      name: '',
      title: '',
    };

    const { result } = renderHook(() => useGetRequestDetails());
    const { getRequestDateAndTime } = result.current;

    expect(getRequestDateAndTime(request)).toBe('formatted-2023-10-01T10:00:00Z//formatted-2023-10-01T10:00:00Z');
  });

  it('should return formatted member preferred slot', () => {
    const request: SelectedProvider = {
      providerPrefferedDateAndTime: '',
      memberPrefferedSlot: { days: ['Monday', 'Wednesday'], time: '10:00 AM' },
      appointmentId: '',
      currentStatus: '',
      distance: 0,
      firstName: '',
      isNewTimeProposed: false,
      lastName: '',
      memberApprovedTimeForEmail: '',
      name: '',
      providerId: '',
      providerType: '',
      title: '',
    };

    const { result } = renderHook(() => useGetRequestDetails());
    const { getRequestDateAndTime } = result.current;

    expect(getRequestDateAndTime(request)).toBe('Monday, Wednesday//10:00 AM');
  });
});
