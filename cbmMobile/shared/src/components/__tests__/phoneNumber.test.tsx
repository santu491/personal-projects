import { render } from '@testing-library/react-native';
import React from 'react';
import { TextStyle } from 'react-native';

import { Accessory, PhoneNumber, PhoneNumberProps } from '../phoneNumber/phoneNumber';
import { PhoneNumberStyles } from '../phoneNumber/phoneNumber.styles';

describe('Accessory', () => {
  it('should render correctly', () => {
    const styles: PhoneNumberStyles = {
      textContainer: { padding: 10 },
      accessory: { margin: 5 },
      textInput: {},
      fontStyle: { fontSize: 16 } as TextStyle,
    };
    const { getByText } = render(<Accessory {...styles} />);
    expect(getByText('+1')).toBeTruthy();
  });
});

describe('PhoneNumber', () => {
  const defaultProps: PhoneNumberProps = {
    onBlur: jest.fn(),
    onChange: jest.fn(),
    value: '',
    accessibilityHint: 'Enter phone number',
  };

  it('renders placeholder text correctly', () => {
    const placeholderText = 'Enter phone number';
    const { getByPlaceholderText } = render(<PhoneNumber {...defaultProps} placeholder={placeholderText} />);
    const textInput = getByPlaceholderText(placeholderText);
    expect(textInput).toBeTruthy();
  });

  it('renders value correctly', () => {
    const value = '1234567890';
    const { getByDisplayValue } = render(<PhoneNumber {...defaultProps} value={value} />);
    const textInput = getByDisplayValue(value);
    expect(textInput).toBeTruthy();
  });
});
