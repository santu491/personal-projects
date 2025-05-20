import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

interface TextViewProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
}

export const HoursTextView = ({ viewStyle, textStyle, text }: TextViewProps) => (
  <>
    <View style={viewStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  </>
);
