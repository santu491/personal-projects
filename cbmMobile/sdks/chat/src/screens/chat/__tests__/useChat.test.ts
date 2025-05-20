import { StackActions } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';
import { BackHandler } from 'react-native';

import { useChatContext } from '../../../context/chat.sdkContext';
import { useChat } from '../useChat';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'), // Keep other exports intact
  // eslint-disable-next-line @typescript-eslint/naming-convention
  StackActions: {
    popToTop: jest.fn(),
  },
}));
jest.mock('../../../context/chat.sdkContext');
jest.mock('../../../../../../src/util/commonUtils', () => ({
  isIOS: () => true,
  isAndroid: () => true,
}));

const mockNavigation = {
  goBack: jest.fn(),
  dispatch: jest.fn(),
};

const mockChatContext = {
  chatConfig: {
    key: '0_9475082298114406_1730828124823_3152',
    environment: 'usw2',
    url: 'https%3A%2F%2Fapps.usw2.pure.cloud%2Fgenesys-bootstrap%2Fgenesys.min.js',
    deploymentId: 'd3930802-0428-4e82-b813-ee7ef8393fbc',
  },
  navigation: mockNavigation,
  loggedIn: true,
};

(useChatContext as jest.Mock).mockReturnValue(mockChatContext);

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading set to false', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.loading).toBe(false);
  });

  it('should set loading to true', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should set loading to false', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.setLoading(true);
    });

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should return chatConfig from context', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.chatConfig).toEqual({
      key: '0_9475082298114406_1730828124823_3152',
      environment: 'usw2',
      url: 'https%3A%2F%2Fapps.usw2.pure.cloud%2Fgenesys-bootstrap%2Fgenesys.min.js',
      deploymentId: 'd3930802-0428-4e82-b813-ee7ef8393fbc',
    });
  });

  it('should not call navigateBack when handleMessage receives other event', () => {
    const { result } = renderHook(() => useChat());
    const navigateBackSpy = jest.spyOn(result.current, 'navigateBack');

    act(() => {
      result.current.handleMessage({ nativeEvent: { data: 'other' } });
    });

    expect(navigateBackSpy).not.toHaveBeenCalled();
  });

  it('should set up back handler on mount and clean up on unmount', () => {
    const addEventListenerSpy = jest.spyOn(BackHandler, 'addEventListener');

    const { unmount } = renderHook(() => useChat());

    expect(addEventListenerSpy).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function));
    unmount();
  });

  it('should return correct injectedJavaScript for iOS', () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.injectedJavaScript).toContain('window.addEventListener');
  });

  it('should return correct injectedJavaScript for non-iOS', () => {
    const { result } = renderHook(() => useChat());

    const response = `
    window.addEventListener('message', function(event) {
      if (event.data === 'clearMsg') {
        Genesys(\"command\", \"Messenger.clear\", () => {
          console.log('Chat cleared');
        });
      }
    });
  `;

    expect(result.current.injectedJavaScript).toContain(response);
  });

  it('should not call webViewRef.current.postMessage when navigateBack is called and webViewRef is not set', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.navigateBack();
    });

    expect(result.current.webViewRef.current).toBeNull();
  });

  it('should call navigation.goBack when navigateBack is called and loggedIn is true', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.navigateBack();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should call navigation.dispatch twice with StackActions.popToTop when navigateBack is called and loggedIn is false', () => {
    (useChatContext as jest.Mock).mockReturnValue({
      ...mockChatContext,
      loggedIn: false,
    });

    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.navigateBack();
    });

    expect(mockNavigation.dispatch).toHaveBeenCalledTimes(2);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith(StackActions.popToTop());
  });
});
