import { act, renderHook } from '@testing-library/react-hooks';
import { Linking } from 'react-native';

import { useAppContext } from '../../context/appContext';
import { useGetMdLiveData } from '../useGetMdLiveData';

jest.mock('../../context/appContext');

describe('useGetMdLiveData', () => {
  const mockServiceProvider = {
    callService: jest.fn(),
  };

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({ serviceProvider: mockServiceProvider });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set loading to true when getMdLiveData is called', async () => {
    const { result } = renderHook(() => useGetMdLiveData());

    await act(async () => {
      result.current.getMdLiveData([]);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should open URL if surveyResponse contains uri', async () => {
    mockServiceProvider.callService.mockResolvedValue({
      data: { uri: 'http://example.com', serviceToken: 'token' },
    });

    const { result } = renderHook(() => useGetMdLiveData());

    await act(async () => {
      result.current.getMdLiveData([]);
    });

    expect(Linking.openURL).toHaveBeenCalledWith('http://example.com?cw_auth_token=token');
  });

  it('should set showError to true if an error occurs', async () => {
    mockServiceProvider.callService.mockRejectedValue(new Error('test error'));

    const { result } = renderHook(() => useGetMdLiveData());

    await act(async () => {
      result.current.getMdLiveData([]);
    });

    expect(result.current.showError).toBe(true);
  });

  it('should set loading to false after service call', async () => {
    const { result } = renderHook(() => useGetMdLiveData());

    await act(async () => {
      result.current.getMdLiveData([]);
    });

    expect(result.current.loading).toBe(false);
  });
});
