import { useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';

import { usePushNotification } from '../../../../../../src/hooks/usePushNotification';
import { useMenuContext } from '../../../context/menu.sdkContext';
import { useViewTopics } from '../useViewTopics';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../../context/menu.sdkContext', () => ({
  useMenuContext: jest.fn(),
}));

jest.mock('../../../../../../src/hooks/usePushNotification', () => ({
  usePushNotification: jest.fn(),
}));

jest.mock('../../../../../../src/config', () => ({
  API_ENDPOINTS: {
    SAVE_MEMBER_PREFERENCES: 'saveMemberPreferences',
    GET_MEMBER_PREFERENCES: 'getMemberPreferences',
  },
  appColors: {
    lightDarkGray: '#A9A9A9',
  },
}));

describe('useViewTopics', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockMenuContext = {
    navigationHandler: {
      requestHideTabBar: jest.fn(),
    },
    serviceProvider: {
      callService: jest.fn(),
    },
  };

  const mockGetRNPermissions = jest.fn();

  const mockTopicList = [
    {
      id: '123123',
      isSelected: true,
      title: 'topic 1',
    },
    {
      id: '5652346',
      isSelected: false,
      title: 'topic 2',
    },
  ];

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        selectedTopicsList: [],
        topicsList: mockTopicList,
      },
    });

    mockMenuContext.serviceProvider.callService.mockResolvedValue({
      data: {
        pushNotifications: {
          enabled: true,
          topics: ['topic1'],
        },
      },
    });

    (useMenuContext as jest.Mock).mockReturnValue({
      navigationHandler: mockMenuContext.navigationHandler,
      navigation: mockNavigation,
      serviceProvider: mockMenuContext.serviceProvider,
    });

    (usePushNotification as jest.Mock).mockReturnValue({
      getRNPermissions: mockGetRNPermissions,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useViewTopics());

    expect(result.current.modelVisible).toBe(false);
    expect(result.current.showTopicsPage).toBe(true);
    expect(result.current.successAlertData).toBeUndefined();
  });

  it('should handle checkbox change correctly', async () => {
    const { result } = renderHook(() => useViewTopics());

    act(() => {
      result.current.onChangeCheckBox('topic1');
    });

    expect(result.current.topicsList).toEqual([
      {
        id: '0topic 1',
        isSelected: false,
        title: 'topic 1',
      },
      {
        id: '1topic 2',
        isSelected: false,
        title: 'topic 2',
      },
    ]);
  });

  it('should handle continue button correctly', async () => {
    mockGetRNPermissions.mockResolvedValue(true);
    mockMenuContext.serviceProvider.callService.mockResolvedValue({});

    const { result, waitForNextUpdate } = renderHook(() => useViewTopics());

    act(() => {
      result.current.handleContinueButton();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(true);
  });

  it('should handle continue button throw error', async () => {
    mockGetRNPermissions.mockResolvedValue(true);
    mockMenuContext.serviceProvider.callService.mockRejectedValue('error');

    const { result, waitForNextUpdate } = renderHook(() => useViewTopics());

    act(() => {
      result.current.handleContinueButton();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(true);
  });

  it('should handle cancel button correctly', () => {
    const { result } = renderHook(() => useViewTopics());

    act(() => {
      result.current.handleCancelButton();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should handle allow button correctly', () => {
    const { result } = renderHook(() => useViewTopics());

    expect(result.current.modelVisible).toBe(false);
    expect(result.current.successAlertData).toBeUndefined();
  });

  it('should handle onCloseModal', () => {
    const { result } = renderHook(() => useViewTopics());
    result.current.onCloseModal();
    expect(result.current.showTopicsPage).toBe(false);
  });
});
