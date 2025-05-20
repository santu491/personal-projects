/* eslint-disable @typescript-eslint/naming-convention */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ErrorBoundary, FallbackProps } from '../errorBoundary/errorBoundary';

describe('ErrorBoundary', () => {
  const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => (
    <View>
      <Text>{error.message}</Text>
      <TouchableOpacity onPress={resetErrorBoundary}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary renderFallback={FallbackComponent}>
        <Text>Child Component</Text>
      </ErrorBoundary>
    );
    expect(getByText('Child Component')).toBeTruthy();
  });

  it('renders fallback component when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    const { getByText } = render(
      <ErrorBoundary renderFallback={FallbackComponent}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Test Error')).toBeTruthy();
  });

  it('calls onError when an error is caught', () => {
    const onError = jest.fn();
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary renderFallback={FallbackComponent} onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('resets error boundary when reset button is clicked', () => {
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    const { getByText, rerender } = render(
      <ErrorBoundary renderFallback={FallbackComponent}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Test Error')).toBeTruthy();

    rerender(
      <ErrorBoundary renderFallback={FallbackComponent}>
        <Text>Child Component</Text>
      </ErrorBoundary>
    );
    fireEvent.press(getByText('Reset'));

    expect(getByText('Child Component')).toBeTruthy();
  });
});
