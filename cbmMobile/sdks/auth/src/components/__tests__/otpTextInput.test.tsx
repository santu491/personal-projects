import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TextInput } from 'react-native';

import { isIOS } from '../../../../../src/util/commonUtils';
import { OtpTextInput } from '../otpCodeInput/otpTextInput';

jest.mock('../../../../../src/util/commonUtils', () => ({
  isIOS: jest.fn(),
}));

describe('OtpTextInput', () => {
  const mockHandleOTPChange = jest.fn();
  const handleKeyPress = jest.fn();
  const inputRefs = [
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
  ];
  const otp = ['', '', '', ''];
  const isEditableText = true;

  const renderOTPTextComponent = () => {
    return render(
      <OtpTextInput
        handleOTPChange={mockHandleOTPChange}
        inputAccessoryViewID="testID"
        inputRefs={inputRefs}
        otp={otp}
        isEditableText={isEditableText}
        handleKeyPress={handleKeyPress}
      />
    );
  };

  it('renders correctly', () => {
    const { getAllByTestId } = renderOTPTextComponent();

    const inputs = getAllByTestId('code-input');
    expect(inputs).toHaveLength(otp.length);
  });

  it('calls handleOTPChange with correct arguments on text change', () => {
    const { getAllByTestId } = renderOTPTextComponent();

    const inputs = getAllByTestId('code-input');
    fireEvent.changeText(inputs[0], '1');
    expect(mockHandleOTPChange).toHaveBeenCalledWith('1', 0);
  });
  it('handles key press', () => {
    const { getAllByTestId } = renderOTPTextComponent();

    const inputs = getAllByTestId('code-input');
    fireEvent(inputs[0], 'onKeyPress', { nativeEvent: { key: 'Backspace' } });
    expect(handleKeyPress).toHaveBeenCalledWith(expect.any(Object), 0);
  });

  it('handles Done button press', () => {
    (isIOS as jest.Mock).mockReturnValue(true);

    const { getByText } = renderOTPTextComponent();

    const doneButton = getByText('Done');
    fireEvent.press(doneButton);
  });
});
