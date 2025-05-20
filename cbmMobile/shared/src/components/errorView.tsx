import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { ErrorIndicatorIcon } from '../assets/icons/icons';
import { appStyles } from '../context/appStyles';

interface ErrorViewProps {
  textStyle?: StyleProp<TextStyle>;
  title: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ title, viewStyle, textStyle }) => {
  return (
    <View style={viewStyle}>
      <ErrorIndicatorIcon />
      <Text testID="errorText" style={[appStyles.errorText, textStyle]}>
        {title}
      </Text>
    </View>
  );
};
