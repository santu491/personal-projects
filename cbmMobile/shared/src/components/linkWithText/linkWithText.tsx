import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { H3 } from '../text/text';
import { linkWithTextStyles } from './linkWithText.style';

export interface LinkWithTextProps {
  label: string;
  linkStyles?: StyleProp<TextStyle>;
  linkText: string;
  onPress: () => void;
  testId?: string;
  textStyle?: StyleProp<TextStyle>;
}

export const LinkWithText = ({ onPress, label, linkText, testId, textStyle, linkStyles }: LinkWithTextProps) => {
  return (
    <H3 style={[linkWithTextStyles.textColorStyle, textStyle]}>
      {label}{' '}
      <H3 style={[linkWithTextStyles.linkButtonStyle, linkStyles]} onPress={onPress} testID={testId}>
        {linkText}
      </H3>
    </H3>
  );
};
