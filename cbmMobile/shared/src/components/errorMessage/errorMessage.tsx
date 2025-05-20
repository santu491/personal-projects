import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { ErrorInfoIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { RNText } from '../text/text';

export interface ErrorMessageProps {
  containerStyles?: StyleProp<ViewStyle>;
  labelStyles?: StyleProp<TextStyle>;
  testId: string;
  title: string;
}

export const ErrorMessage = ({ containerStyles, labelStyles, title, testId }: ErrorMessageProps) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <ErrorInfoIcon height={20} width={20} />
      <RNText style={[styles.label, labelStyles]} testID={testId}>
        {title}
      </RNText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '500',
    paddingLeft: 12,
    flexShrink: 1,
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: appColors.darkRed,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
});
