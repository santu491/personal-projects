import React from 'react';
import {
  Button,
  InputAccessoryView,
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

import { isIOS } from '../../../../../src/util/commonUtils';
import { styles } from './otpTextInput.styles';

interface OtpTextInputProps {
  handleKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => void;
  handleOTPChange: (text: string, index: number) => void;
  inputAccessoryViewID: string;
  inputRefs: React.RefObject<TextInput>[];
  isEditableText: boolean;
  otp: string[];
}

export const OtpTextInput: React.FC<OtpTextInputProps> = ({
  handleOTPChange,
  inputAccessoryViewID,
  inputRefs,
  otp,
  isEditableText,
  handleKeyPress,
}) => {
  return (
    <View style={styles.codeInputContainer}>
      {otp.map((digit, index) => (
        <TextInput
          accessible={true}
          key={index}
          style={styles.codeInput}
          value={digit}
          onChangeText={(text) => handleOTPChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          maxLength={1}
          keyboardType="numeric"
          ref={inputRefs[index]}
          editable={isEditableText}
          accessibilityHint={`Enter OTP digit ${index + 1}`}
          accessibilityLabel={`OTP digit ${index + 1}`}
          testID={'code-input'}
        />
      ))}
      {isIOS() && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessory}>
            <Button title="Done" onPress={() => Keyboard.dismiss()} />
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
};
