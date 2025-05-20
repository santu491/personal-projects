import { TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { isIOS } from '../../../../src/util/commonUtils';
import { H3 } from '../text/text';
import { PhoneNumberStyles, phoneNumberStyles } from './phoneNumber.styles';

export interface PhoneNumberProps {
  accessibilityHint: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  testID?: string;
  value: string;
}

export const PhoneNumber = ({ value, onChange, placeholder, accessibilityHint, onBlur, testID }: PhoneNumberProps) => {
  const styles = useMemo(() => phoneNumberStyles(), []);
  return (
    <View>
      <TextInput
        accessoryStart={<Accessory {...styles} />}
        accessibilityHint={accessibilityHint}
        autoComplete="tel" // android
        keyboardType="phone-pad"
        onBlur={onBlur}
        onChangeText={onChange}
        maxLength={10}
        placeholder={placeholder}
        textContentType="telephoneNumber" // ios
        value={value}
        styles={styles.textInput}
        returnKeyType={isIOS() ? 'done' : 'next'}
        testID={testID}
      />
    </View>
  );
};

// eslint-disable-next-line react/no-multi-comp
export const Accessory = (styles: PhoneNumberStyles) => {
  return (
    <View style={styles.textContainer}>
      <H3 style={styles.fontStyle}>+1</H3>
    </View>
  );
};
