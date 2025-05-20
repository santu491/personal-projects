import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { H3 } from '../../../../../shared/src/components/text/text';
import { styles } from './pill.styles';

interface PillProps {
  buttonStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export const Pill = ({ label, icon, labelStyle, buttonStyle, onPress }: PillProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, buttonStyle]}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      testID={`pill-${label}`}
    >
      {icon}
      <H3 style={[styles.label, labelStyle]}>{label}</H3>
    </TouchableOpacity>
  );
};
