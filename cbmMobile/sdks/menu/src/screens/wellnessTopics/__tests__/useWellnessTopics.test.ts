import { act, renderHook } from '@testing-library/react-hooks';

import { API_ENDPOINTS } from '../../../../../../src/config';
import { usePushNotification } from '../../../../../../src/hooks/usePushNotification';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { useMenuContext } from '../../../context/menu.sdkContext';
import { useWellnessTopics } from '../useWellnessTopics';

jest.mock('../../../context/menu.sdkContext');
jest.mock('../../../../../../src/config');
jest.mock('../../../../../../src/hooks/usePushNotification');

describe('useWellnessTopics', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const mockServiceProvider = { callService: jest.fn() };
  const mockNavigationHandler = { requestHideTabBar: jest.fn() };

  beforeEach(() => {
    (useMenuContext as jest.Mock).mockReturnValue({
      navigation: mockNavigation,
      serviceProvider: mockServiceProvider,
      navigationHandler: mockNavigationHandler,
    });
    (usePushNotification as jest.Mock).mockReturnValue({
      getRNPermissions: jest.fn().mockResolvedValue(true),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWellnessTopics());

    expect(result.current.modelVisible).toBe(false);
    expect(result.current.selectedTopicsList).toEqual([]);
    expect(result.current.searchedTopic).toBe('');
    expect(result.current.filteredTopics).toEqual([]);
    expect(result.current.successAlertData).toBeUndefined();
  });

  it('should fetch wellness topics on mount', async () => {
    const mockTopicsResponse = {
      data: {
        results: [{ title: 'Topic 1' }, { title: 'Topic 2' }],
      },
    };
    mockServiceProvider.callService.mockResolvedValue(mockTopicsResponse);

    const { result, waitForNextUpdate } = renderHook(() => useWellnessTopics());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.selectedTopicsList).toEqual([]);
    expect(result.current.filteredTopics).toEqual([]);
  });

  it('should handle search topic change', async () => {
    const { result } = renderHook(() => useWellnessTopics());

    act(() => {
      result.current.onChangeTopic('Topic 1');
    });

    expect(result.current.searchedTopic).toBe('Topic 1');
  });

  it('should handle dropdown item press', async () => {
    const { result } = renderHook(() => useWellnessTopics());

    const item = { id: '1', title: 'Topic 1' };

    await act(async () => {
      await result.current.onPressDropDownItem(item);
    });

    expect(result.current.selectedTopicsList).toEqual([{ id: '1', title: 'Topic 1', isSelected: true }]);
    expect(result.current.searchedTopic).toBe('');
  });

  it('should handle cancel button press', async () => {
    const { result } = renderHook(() => useWellnessTopics());

    act(() => {
      result.current.handleCancelButton();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should handle continue button press', async () => {
    const { result } = renderHook(() => useWellnessTopics());

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(mockServiceProvider.callService).toHaveBeenCalledWith(
      expect.stringContaining(API_ENDPOINTS.WELLNESS_TOPICS_LIST),
      RequestMethod.GET,
      expect.any(Object)
    );
  });

  it('should handle continue button press with pushNotifications topics data', async () => {
    const mockTopicsResponse = {
      data: {
        results: [{ title: 'topic 1' }, { title: 'topic 2' }],
        pushNotifications: {
          topics: [{ title: 'topic 1' }, { title: 'topic 2' }],
        },
      },
    };
    mockServiceProvider.callService.mockResolvedValue(mockTopicsResponse);
    const { result } = renderHook(() => useWellnessTopics());

    await act(async () => {
      result.current.handleContinueButton();
    });
    result.current.onChangeTopic('topic 1');

    expect(mockServiceProvider.callService).toHaveBeenCalledWith(
      expect.stringContaining(API_ENDPOINTS.WELLNESS_TOPICS_LIST),
      RequestMethod.GET,
      expect.any(Object)
    );
  });

  it('should handle continue button press with empty onChangeTopic', async () => {
    const mockTopicsResponse = {
      data: {
        results: [{ title: 'topic 1' }, { title: 'topic 2' }],
        pushNotifications: {
          topics: [{ title: 'topic 1' }, { title: 'topic 2' }],
        },
      },
    };
    mockServiceProvider.callService.mockResolvedValue(mockTopicsResponse);
    const { result } = renderHook(() => useWellnessTopics());

    await act(async () => {
      result.current.handleContinueButton();
    });
    result.current.onChangeTopic('');

    expect(mockServiceProvider.callService).toHaveBeenCalledWith(
      expect.stringContaining(API_ENDPOINTS.WELLNESS_TOPICS_LIST),
      RequestMethod.GET,
      expect.any(Object)
    );
  });

  it('should remove topic selection', () => {
    const { result } = renderHook(() => useWellnessTopics());

    act(() => {
      result.current.onPressDropDownItem({ id: '1', title: 'Topic 1' });
    });

    act(() => {
      result.current.removeTopicSelection('Topic 1');
    });

    expect(result.current.selectedTopicsList).toEqual([]);
  });
});
