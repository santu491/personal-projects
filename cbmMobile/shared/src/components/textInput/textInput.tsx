import React from 'react';
import { StyleProp, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';

import { ErrorInfoIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { RNText } from '../text/text';
import { styles } from './textInput.styles';

export interface RNTextInputProps {
  errorMessage?: string;
  inputStyles?: StyleProp<ViewStyle>;
  inputViewStyles?: StyleProp<ViewStyle>;
  isRequired?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  maxLength?: number;
  onBlur?: () => void;
  onChangeText?: (value: string) => void;
  onFocusInput?: () => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  testId?: string;
  value?: string;
}

export const RNTextInput = (props: RNTextInputProps) => {
  const { leftIcon } = props;

  return (
    <>
      <Text style={[styles.label, props.labelStyle]}>
        {props.label}
        {props.isRequired ? <Text style={styles.mandatory}>*</Text> : null}
      </Text>
      <View style={styles.container}>
        <View style={[styles.inputView, props.inputViewStyles]}>
          <View style={styles.inputContainer}>
            {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
            <TextInput
              testID={props.testId ?? 'text-input'}
              value={props.value}
              onChangeText={props.onChangeText}
              style={[styles.input, props.inputStyles]}
              placeholder={props.placeholder}
              placeholderTextColor={appColors.gray}
              onFocus={props.onFocusInput}
              onBlur={props.onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              accessibilityLabel={props.value}
              maxLength={props.maxLength ?? 250}
              onSubmitEditing={props.onSubmitEditing}
            />
          </View>
        </View>
      </View>
      {props.errorMessage ? (
        <View style={styles.errorView}>
          <ErrorInfoIcon />
          <RNText style={styles.errorMessage}>{props.errorMessage}</RNText>
        </View>
      ) : null}
    </>
  );
};
