/* eslint-disable react/no-multi-comp */
import React, { ReactNode } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { styles } from './text.styles';

interface CustomTextProps extends TextProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export const RNText = (props: CustomTextProps) => {
  const { style, testID, ...textProps } = props;
  return (
    <Text style={[styles.rnText, style]} testID={testID ?? ''} {...textProps}>
      {props.children}
    </Text>
  );
};

export const H1 = (props: CustomTextProps) => {
  const { style, testID, ...textProps } = props;
  return (
    <Text style={[styles.h1, style]} testID={testID ?? ''} {...textProps}>
      {props.children}
    </Text>
  );
};

export const H2 = (props: CustomTextProps) => {
  const { style, testID, ...textProps } = props;
  return (
    <Text style={[styles.h2, style]} testID={testID ?? ''} {...textProps}>
      {props.children}
    </Text>
  );
};

export const H3 = (props: CustomTextProps) => {
  const { style, testID, ...textProps } = props;
  return (
    <Text style={[styles.h3, style]} testID={testID ?? ''} {...textProps}>
      {props.children}
    </Text>
  );
};

export const H4 = (props: CustomTextProps) => {
  const { style, testID, ...textProps } = props;
  return (
    <Text style={[styles.h4, style]} testID={testID ?? ''} {...textProps}>
      {props.children}
    </Text>
  );
};
