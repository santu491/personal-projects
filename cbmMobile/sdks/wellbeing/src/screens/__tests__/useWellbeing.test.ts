import { act, renderHook } from '@testing-library/react-hooks';

import { useWellbeingContext } from '../../context/wellbeing.sdkContext';
import { useWellbeingInfo } from '../../hooks/useWellbeingInfo';
import { Screen } from '../../navigation/wellbeing.navigationTypes';
import { useWellbeing } from '../useWellbeing';

jest.mock('../../context/wellbeing.sdkContext', () => ({
  useWellbeingContext: jest.fn(),
}));

jest.mock('../../hooks/useWellbeingInfo', () => ({
  useWellbeingInfo: jest.fn(),
}));

describe('useWellbeing', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useWellbeingContext as jest.Mock).mockReturnValue({
      navigation: { navigate: mockNavigate },
    });

    (useWellbeingInfo as jest.Mock).mockReturnValue({
      welllbeingData: { someData: 'test' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return wellbeing data', () => {
    const { result } = renderHook(() => useWellbeing());
    expect(result.current.welllbeingData).toEqual({ someData: 'test' });
  });

  it('should navigate to wellbeing pages with URL', () => {
    const { result } = renderHook(() => useWellbeing());
    act(() => {
      result.current.navigateToWellbeingPages('http://example.com');
    });
    expect(mockNavigate).toHaveBeenCalledWith(Screen.CREDIBLEMIND, { url: 'http://example.com' });
  });

  it('should not navigate to wellbeing pages without URL', () => {
    const { result } = renderHook(() => useWellbeing());
    act(() => {
      result.current.navigateToWellbeingPages();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
