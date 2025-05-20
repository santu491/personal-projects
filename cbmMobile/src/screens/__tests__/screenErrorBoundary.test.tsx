/* eslint-disable @typescript-eslint/naming-convention */
import { useNetInfo } from '@react-native-community/netinfo';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { ScreenErrorBoundary } from '../errorBoundary/screenErrorBoundary';

describe('ScreenErrorBoundary', () => {
  const mockUseNetInfo = useNetInfo as jest.Mock;

  beforeEach(() => {
    mockUseNetInfo.mockReturnValue({
      isConnected: true,
      isInternetReachable: true,
    });
  });

  it('renders children when no error occurs', () => {
    const { getByText } = render(
      <ScreenErrorBoundary>
        <Text>Child Component</Text>
      </ScreenErrorBoundary>
    );

    expect(getByText('Child Component')).toBeTruthy();
  });

  it('renders fallback UI when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <ScreenErrorBoundary>
        <ThrowError />
      </ScreenErrorBoundary>
    );

    expect(getByText('errorScreen.title')).toBeTruthy();
    expect(getByText('errorScreen.message')).toBeTruthy();
  });

  it('renders offline error UI when not connected to the internet', () => {
    mockUseNetInfo.mockReturnValueOnce({
      isConnected: false,
      isInternetReachable: false,
    });

    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <ScreenErrorBoundary>
        <ThrowError />
      </ScreenErrorBoundary>
    );

    expect(getByText('offlineError.header')).toBeTruthy();
    expect(getByText('offlineError.body')).toBeTruthy();
  });

  it('calls onReset when retry button is pressed', () => {
    const onResetMock = jest.fn();

    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByTestId } = render(
      <ScreenErrorBoundary onReset={onResetMock}>
        <ThrowError />
      </ScreenErrorBoundary>
    );

    fireEvent.press(getByTestId('screenError.retry'));

    expect(onResetMock).toHaveBeenCalled();
  });
});
