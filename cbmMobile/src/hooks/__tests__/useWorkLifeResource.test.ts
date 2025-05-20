import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { useHomeContext } from '../../../sdks/home/src/context/home.sdkContext';
import { API_ENDPOINTS_JSON } from '../../config';
import { RedirectURLApiType } from '../../constants/constants';
import { RequestMethod } from '../../models/adapters';
import { useWorkLifeResource } from '../useWorkLifeResource';

// Mock useHomeContext
jest.mock('../../../sdks/home/src/context/home.sdkContext', () => ({
  useHomeContext: jest.fn(),
}));

describe('useWorkLifeResource', () => {
  const mockCallService = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    const mockHomeContext = {
      serviceProvider: {
        callService: mockCallService,
      },
      navigation: {
        navigate: mockNavigate,
      },
    };

    (useHomeContext as jest.Mock).mockReturnValue(mockHomeContext);
  });

  it('should call serviceProvider.callService with correct arguments', async () => {
    const { result } = renderHook(() => useWorkLifeResource());
    const path = '/test-path';

    mockCallService.mockResolvedValueOnce({
      data: {
        page: {
          cards: {
            banner: {
              buttons: {},
            },
          },
        },
      },
    });

    await act(async () => {
      await result.current.getWorkLifeResourceLibrary(path);
    });

    expect(mockCallService).toHaveBeenCalledWith(API_ENDPOINTS_JSON.TELEHEALTH.endpoint, RequestMethod.POST, { path });
  });

  it('should navigate to RESOURCE_LIBRARY if learnMoreButton is found', async () => {
    const { result } = renderHook(() => useWorkLifeResource());
    const path = '/test-path';

    mockCallService.mockResolvedValueOnce({
      data: {
        page: {
          cards: {
            banner: {
              buttons: {
                button1: {
                  redirectUrl: `page:${RedirectURLApiType.WORK_LIFE_RESOURCE_LIBRARY}`,
                  page: { id: 'test-page' },
                },
              },
            },
          },
        },
      },
    });

    await act(async () => {
      await result.current.getWorkLifeResourceLibrary(path);
    });

    expect(mockNavigate).toHaveBeenCalledWith('ResourceLibrary', {
      resourceLibraryData: { id: 'test-page' },
    });
  });

  it('should throw an error if buttons are not found', async () => {
    const { result } = renderHook(() => useWorkLifeResource());
    const path = '/test-path';

    mockCallService.mockResolvedValueOnce({
      data: {
        page: {
          cards: {
            banner: {},
          },
        },
      },
    });

    await expect(result.current.getWorkLifeResourceLibrary(path)).rejects.toThrow(
      'An error occurred while fetching the Work Life Resource Library.'
    );
  });

  it('should throw an error if serviceProvider.callService fails', async () => {
    const { result } = renderHook(() => useWorkLifeResource());
    const path = '/test-path';

    mockCallService.mockRejectedValueOnce(new Error('Service call failed'));

    await expect(result.current.getWorkLifeResourceLibrary(path)).rejects.toThrow(
      'An error occurred while fetching the Work Life Resource Library.'
    );
  });
});
