import React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

import { H1 } from '../../../../../shared/src/components/text/text';
import { styles } from './authProfileTitle.styles';

interface AuthProfileTitleProps {
  subTitle?: string;
  subTitleStyle?: StyleProp<TextStyle>;
  testID?: string;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const AuthProfileTitle: React.FC<AuthProfileTitleProps> = ({
  subTitle,
  testID,
  title,
  subTitleStyle,
  titleStyle,
}) => {
  return (
    <View>
      <H1 testID={testID} style={[styles.titleStyle, titleStyle]}>
        {title}
      </H1>
      {subTitle ? <Text style={[styles.subTitleStyle, subTitleStyle]}>{subTitle}</Text> : null}
    </View>
  );
};
