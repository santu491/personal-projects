import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { Pill } from '../pill';

describe('Pill', () => {
  it('renders the label', () => {
    const { getByText } = render(<Pill label="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<Pill label="Test" onPress={onPress} />);
    fireEvent.press(getByTestId('pill-Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
