import { render } from '@testing-library/react-native';
import React from 'react';
import { BackHandler } from 'react-native';

import { ContentView } from '../contentView';

describe('ContentView', () => {
  it('renders WebView with correct source', () => {
    const source = 'https://example.com';
    const { getByTestId } = render(<ContentView source={source} testID={'webview'} />);
    const webView = getByTestId('webview');
    expect(webView.props.source.uri).toBe(source);
  });
  it('calls the back button handler when back button is pressed', () => {
    const event = 'hardwareBackPress';
    const mockAddEventListener = jest.spyOn(BackHandler, 'addEventListener');
    mockAddEventListener.mockImplementation((evt, handler) => {
      handler();
      return {
        remove: jest.fn(),
      };
    });

    const source = 'https://example.com';
    render(<ContentView source={source} testID={'webview'} />);

    expect(BackHandler.addEventListener).toHaveBeenCalledWith(event, expect.any(Function));
  });

  it('renders WebView with goBack and navigationCount', () => {
    const source = 'https://example.com';
    const { getByTestId } = render(<ContentView source={source} testID={'webview'} />);
    const webView = getByTestId('webview');
    expect(webView.props.source.uri).toBe(source);
  });

  it('Load Dial phone URL', () => {
    const source = 'tel:8883757767';
    const { getByTestId } = render(<ContentView source={source} testID={'webview'} />);
    const webView = getByTestId('webview');
    webView.props.onShouldStartLoadWithRequest({ url: source });
    expect(webView.props.source.uri).toBe(source);
  });
  it('Load SMS URL', () => {
    const source = 'sms:8883757767';
    const { getByTestId } = render(<ContentView source={source} testID={'webview'} />);
    const webView = getByTestId('webview');
    webView.props.onShouldStartLoadWithRequest({ url: source });
    expect(webView.props.source.uri).toBe(source);
  });
  it('Load mail URL', () => {
    const source = 'mail:8883757767';
    const { getByTestId } = render(<ContentView source={source} testID={'webview'} />);
    const webView = getByTestId('webview');
    webView.props.onShouldStartLoadWithRequest({ url: source });
    expect(webView.props.source.uri).toBe(source);
  });
});
