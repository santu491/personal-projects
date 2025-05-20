import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface TitleSubtitleViewProps {
  textStyle: StyleProp<TextStyle>;
  title: string;
}

export const TitleSubtitleView: React.FC<TitleSubtitleViewProps> = ({ title, textStyle }) => {
  return (
    <Text style={textStyle} testID={'title-subtitle-view-title'}>
      {title}
    </Text>
  );
};
