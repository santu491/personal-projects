import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

interface CardComponentProps {
  cardItems?: Array<string>;
  mainViewStyle?: StyleProp<ViewStyle>;
  subViewStyle?: StyleProp<ViewStyle>;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  cardItems,
  mainViewStyle,
  subViewStyle,
  textStyle,
  testID,
}) => {
  return (
    <View style={mainViewStyle} testID={testID}>
      {cardItems?.map((item) => (
        <View key={item} style={subViewStyle}>
          <Text style={textStyle}>{item}</Text>
        </View>
      ))}
    </View>
  );
};
