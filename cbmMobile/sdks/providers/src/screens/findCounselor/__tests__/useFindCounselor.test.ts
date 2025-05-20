import { act, renderHook } from '@testing-library/react-hooks';

import { useProviderContext } from '../../../context/provider.sdkContext';
import { useFindCounselor } from '../useFindCounselor';

jest.mock('../../../context/provider.sdkContext');

describe('useFindCounselor', () => {
  const resetProviderContextInfo = jest.fn();
  const mockCallService = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error

    (useProviderContext as jest.Mock).mockReturnValue({
      resetProviderContextInfo,
      serviceProvider: {
        callService: mockCallService.mockResolvedValue({
          data: {
            disclaimer: '<p>Disclaimer content</p>',
          },
        }),
      },
      client: {
        clientUri: 'company-demo',
        source: 'mhsud',
      },
      loggedIn: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks(); // Restore console.error
  });

  it('should initialize with modelVisible as false', () => {
    const { result } = renderHook(() => useFindCounselor());
    expect(result.current.isDisclaimerVisisble).toBe(false);
  });

  it('should call resetProviderContextInfo on mount', () => {
    renderHook(() => useFindCounselor());
    expect(resetProviderContextInfo).toHaveBeenCalled();
  });

  it('should set modelVisible to true when handleDisclaimerClick is called', () => {
    const { result } = renderHook(() => useFindCounselor());
    act(() => {
      result.current.handleDisclaimerClick();
    });
    expect(result.current.isDisclaimerVisisble).toBe(true);
  });

  it('should fetch and set disclaimer content for MHSUD source', async () => {
    const { result } = renderHook(() => useFindCounselor());

    await act(async () => {
      await mockCallService();
    });

    expect(result.current.disclaimerContent).toEqual({
      html: '<p>Disclaimer content</p>',
    });
  });
});
