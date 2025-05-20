import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { RNTextInput } from '../textInput/textInput';

describe('RNTextInput', () => {
  const props = {
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    isRequired: true,
    onChangeText: jest.fn(),
    onPressRightIcon: jest.fn(),
    onFocusInput: jest.fn(),
    onBlur: jest.fn(),
    value: 'Test Value',
    testId: 'test-input',
  };
  it('renders correctly', () => {
    const { getByTestId } = render(<RNTextInput {...props} />);
    const input = getByTestId('test-input');
    expect(input).toBeTruthy();
  });

  it('Test input value ', () => {
    const { getByTestId } = render(<RNTextInput {...props} />);
    const input = getByTestId('test-input');
    expect(input.props.value).toBe('Test Value');
  });

  it('Test Placeholdaer', () => {
    const { getByTestId } = render(<RNTextInput {...props} />);
    const input = getByTestId('test-input');
    expect(input.props.placeholder).toBe('Test Placeholder');
  });

  it('Test Onchange Text', () => {
    const { getByTestId } = render(<RNTextInput {...props} />);
    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'New Value');
    expect(input.props.onChangeText).toHaveBeenCalledWith('New Value');
  });

  it('Test onFocusInput', () => {
    const { getByTestId } = render(<RNTextInput {...props} />);
    const input = getByTestId('test-input');
    fireEvent(input, 'focus');
    expect(props.onFocusInput).toHaveBeenCalled();
  });

  it('renders Test onBlur', () => {
    const { getByTestId } = render(<RNTextInput {...props} />);
    const input = getByTestId('test-input');
    fireEvent(input, 'blur');
    expect(input.props.onBlur).toHaveBeenCalled();
  });
});
