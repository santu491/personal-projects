import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { styles } from './title.styles';
interface TitleViewProps {
  headerStyle?: StyleProp<TextStyle>;
  headerText?: string;
  subTitle?: string;
  subTitleStyle?: StyleProp<TextStyle>;
  title?: string;
}

export const Title: React.FC<TitleViewProps> = ({ title, subTitle, headerText, subTitleStyle, headerStyle }) => {
  return (
    <>
      {title ? (
        <H1 style={styles.headerStyle} testID="home.header">
          {title}
        </H1>
      ) : null}
      {subTitle ? (
        <H1 style={[styles.headerSubStyle, subTitleStyle]} testID="home.subHeader">
          {subTitle}
        </H1>
      ) : null}
      {headerText ? (
        <H3 style={[styles.headerTextStyle, headerStyle]} testID="home.headerText">
          {headerText}
        </H3>
      ) : null}
    </>
  );
};
