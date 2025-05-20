import { render } from '@testing-library/react-native';
import React from 'react';
import { Keyboard } from 'react-native';
import WebView from 'react-native-webview';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { ChatMockContextWrapper } from '../../../__mocks__/chatMockContextWrapper';
import { Chat } from '../chat';
import { useChat } from '../useChat';

jest.mock('../useChat');
jest.mock('react-native-webview', () => jest.fn());
jest.mock('../../../../../../shared/src/components/progressLoader');
jest.mock('../../../../../../src/util/commonUtils');

const chatConfig = {
  key: '0_9475082298114406_1730828124823_3152',
  environment: 'usw2',
  url: 'https%3A%2F%2Fapps.usw2.pure.cloud%2Fgenesys-bootstrap%2Fgenesys.min.js',
  deploymentId: 'd3930802-0428-4e82-b813-ee7ef8393fbc',
};

describe('Chat', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders correctly', () => {
    (useChat as jest.Mock).mockReturnValue({
      setLoading: jest.fn(),
      loading: false,
      chatConfig,
    });

    render(
      <ChatMockContextWrapper>
        <Chat />
      </ChatMockContextWrapper>
    );

    expect(WebView).toHaveBeenCalledWith(
      expect.objectContaining({
        originWhitelist: ['*'],
        source: {
          uri: '/chat.html?deploymentId=d3930802-0428-4e82-b813-ee7ef8393fbc&sessionId=0_9475082298114406_1730828124823_3152&env=usw2&libUrl=https%253A%252F%252Fapps.usw2.pure.cloud%252Fgenesys-bootstrap%252Fgenesys.min.js',
        },
        javaScriptEnabled: true,
        scalesPageToFit: true,
        cacheEnabled: false,
      }),
      {}
    );
  });
});

it('injects JavaScript when keyboard hides', () => {
  const mockInjectJavaScript = jest.fn();
  const mockWebViewRef = { current: { injectJavaScript: mockInjectJavaScript } };

  (useChat as jest.Mock).mockReturnValue({
    setLoading: jest.fn(),
    loading: false,
    chatConfig,
    handleMessage: jest.fn(),
    navigateBack: jest.fn(),
    webViewRef: mockWebViewRef,
    injectedJavaScript: '',
  });

  render(
    <ChatMockContextWrapper>
      <Chat />
    </ChatMockContextWrapper>
  );

  // Simulate keyboard hide event
  Keyboard.addListener('keyboardDidHide', () => {
    expect(mockInjectJavaScript).toHaveBeenCalledWith('document.activeElement.blur();');
  });

  // Trigger the keyboardDidHide event
  Keyboard.dismiss();
});

it('renders null when chatConfig is undefined', () => {
  (useChat as jest.Mock).mockReturnValue({
    setLoading: jest.fn(),
    loading: false,
    chatConfig: undefined,
    handleMessage: jest.fn(),
    navigateBack: jest.fn(),
    webViewRef: { current: null },
    injectedJavaScript: '',
  });

  const { queryByTestId } = render(
    <ChatMockContextWrapper>
      <Chat />
    </ChatMockContextWrapper>
  );

  expect(queryByTestId('webview')).toBeNull();
});
