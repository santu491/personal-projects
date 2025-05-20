import { useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-hooks';

import { useViewOtherRequests } from '../useViewOtherRequests';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

describe('useViewOtherRequests', () => {
  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        otherRequestList: [
          { id: 1, request: 'Request 1' },
          { id: 2, request: 'Request 2' },
        ],
        dateOfInitiation: '2023-10-01',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct otherRequestList and dateOfInitiation', () => {
    const { result } = renderHook(() => useViewOtherRequests());

    expect(result.current.otherRequestList).toEqual([
      { id: 1, request: 'Request 1' },
      { id: 2, request: 'Request 2' },
    ]);
    expect(result.current.dateOfInitiation).toBe('2023-10-01');
  });

  it('should return an empty otherRequestList if no requests are available', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        otherRequestList: [],
        dateOfInitiation: '2023-10-01',
      },
    });

    const { result } = renderHook(() => useViewOtherRequests());

    expect(result.current.otherRequestList).toEqual([]);
  });

  it('should return undefined dateOfInitiation if date is not available', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        otherRequestList: [
          { id: 1, request: 'Request 1' },
          { id: 2, request: 'Request 2' },
        ],
        dateOfInitiation: undefined,
      },
    });

    const { result } = renderHook(() => useViewOtherRequests());

    expect(result.current.dateOfInitiation).toBeUndefined();
  });
});
