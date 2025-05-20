import { render } from '@testing-library/react-native';
import React from 'react';

import { H1, H2, H3, H4, RNText } from '../text/text';

describe('Text components', () => {
  test('RNText renders correctly', () => {
    const { getByTestId } = render(<RNText testID="rnText">Test</RNText>);
    expect(getByTestId('rnText').props.children).toBe('Test');
  });

  test('H1 renders correctly', () => {
    const { getByTestId } = render(<H1 testID="h1">Test</H1>);
    expect(getByTestId('h1').props.children).toBe('Test');
  });

  test('H2 renders correctly', () => {
    const { getByTestId } = render(<H2 testID="h2">Test</H2>);
    expect(getByTestId('h2').props.children).toBe('Test');
  });

  test('H3 renders correctly', () => {
    const { getByTestId } = render(<H3 testID="h3">Test</H3>);
    expect(getByTestId('h3').props.children).toBe('Test');
  });

  test('H4 renders correctly', () => {
    const { getByTestId } = render(<H4 testID="h4">Test</H4>);
    expect(getByTestId('h4').props.children).toBe('Test');
  });
});
