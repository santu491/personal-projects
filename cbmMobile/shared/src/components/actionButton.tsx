import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

interface ActionButtonProps {
  disabled?: boolean;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
  title: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  style,
  textStyle,
  title,
  disabled = false,
  testID,
  icon,
}) => {
  const onHandleButton = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        icon ? styles.content : null,
        disabled ? styles.buttonDisable : styles.buttonEnable,
        style,
      ]}
      onPress={onHandleButton}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
    >
      <Text style={[styles.label, textStyle]}>{title}</Text>
      {icon ? <View style={styles.iconStyle}>{icon}</View> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    paddingVertical: 9,
  },
  buttonEnable: {
    backgroundColor: appColors.lightPurple,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    paddingLeft: 8,
  },
  buttonDisable: {
    backgroundColor: appColors.lightGray,
  },
  label: {
    color: appColors.white,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: appFonts.regular,
  },
});
