import { act, renderHook } from '@testing-library/react-hooks';

import { useAppContext } from '../../../context/appContext';
import { useCrisisSupport } from '../useCrisisSupport';

jest.mock('../../../context/appContext');

describe('useCrisisSupport', () => {
  let mockCallService: jest.Mock;

  beforeEach(() => {
    mockCallService = jest.fn();
    (useAppContext as jest.Mock).mockReturnValue({
      serviceProvider: {
        callService: mockCallService,
      },
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCrisisSupport());

    expect(result.current.loading).toBe(true);
    expect(result.current.isServerError).toBe(false);
    expect(result.current.crisisSupportData).toBeUndefined();
  });

  it('should fetch crisis support data successfully', async () => {
    const mockResponse = {
      data: [
        {
          title: 'Section 1',
          list: [
            {
              item: 'Item 1',
              details: [
                {
                  text: 'Detail 1',
                  hours: '24/7',
                },
              ],
            },
          ],
        },
      ],
    };

    mockCallService.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useCrisisSupport());

    act(() => {
      result.current.getCrisisSupportApi();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.isServerError).toBe(true);
    expect(result.current.crisisSupportData).toEqual([
      {
        sectionTitle: 'Section 1',
        crisisSupportDetails: [
          {
            item: { prefixText: 'Item 1', text: undefined, link: undefined, suffixText: undefined },
            details: [
              {
                prefixText: 'Detail 1',
                text: undefined,
                link: undefined,
                suffixText: undefined,
                hours: '24/7',
                id: 'Detail 1',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should handle server error', async () => {
    mockCallService.mockRejectedValueOnce(new Error('Server Error'));

    const { result, waitForNextUpdate } = renderHook(() => useCrisisSupport());

    act(() => {
      result.current.getCrisisSupportApi();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.isServerError).toBe(true);
  });

  it('should retry fetching data on onPressTryAgain', async () => {
    mockCallService.mockRejectedValueOnce(new Error('Server Error'));
    mockCallService.mockResolvedValueOnce({
      data: [
        {
          title: 'Section 1',
          list: [
            {
              item: 'Item 1',
              details: [
                {
                  text: 'Detail 1',
                  hours: '24/7',
                },
              ],
            },
          ],
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(() => useCrisisSupport());

    act(() => {
      result.current.getCrisisSupportApi();
    });

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(true);

    act(() => {
      result.current.onPressTryAgain();
    });

    await waitForNextUpdate();

    expect(result.current.isServerError).toBe(true);
    expect(result.current.crisisSupportData).toEqual([
      {
        sectionTitle: 'Section 1',
        crisisSupportDetails: [
          {
            item: { prefixText: 'Item 1', text: undefined, link: undefined, suffixText: undefined },
            details: [
              {
                prefixText: 'Detail 1',
                text: undefined,
                link: undefined,
                suffixText: undefined,
                hours: '24/7',
                id: 'Detail 1',
              },
            ],
          },
        ],
      },
    ]);
  });
});
