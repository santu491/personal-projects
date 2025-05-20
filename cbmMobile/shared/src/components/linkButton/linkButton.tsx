import React from 'react';
import { GestureResponderEvent, StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';

interface LinkButtonProps {
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
  title: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ onPress, textStyle, title, testID, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      disabled={disabled}
      accessibilityLabel={title}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
