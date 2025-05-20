import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { styles } from './floatingButton.styles';

interface FloatingButtonProps {
  icon?: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ icon, onPress, style, textStyle, title, testID }) => {
  return (
    <TouchableOpacity style={[styles.topToBottom, style]} onPress={onPress} testID={testID} accessibilityRole="button">
      <Text style={[styles.topToBottomText, textStyle]}>{title}</Text>
      {icon}
    </TouchableOpacity>
  );
};
