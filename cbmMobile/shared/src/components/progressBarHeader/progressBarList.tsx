import React from 'react';
import { Dimensions, View } from 'react-native';

import { styles } from './progressBarHeader.styles';

interface ProgressBarListProps {
  backgroundColor: (index: number) => string;
  testID?: string;
  totalStepsCount: number;
}

const PADDING_HORIZONTAL = 20;
const LEFT_ARROW_WIDTH = 40;
const MARGIN_HORIZONTAL = 10;

export const ProgressBarList = ({ totalStepsCount, backgroundColor, testID }: ProgressBarListProps) => {
  const screenWidth =
    Dimensions.get('window').width -
    2 * PADDING_HORIZONTAL -
    totalStepsCount * MARGIN_HORIZONTAL -
    2 * LEFT_ARROW_WIDTH -
    2 * PADDING_HORIZONTAL;

  const itemWidth = screenWidth / totalStepsCount;

  return (
    <View testID={testID} style={styles.progressViewStyle}>
      {Array.from({ length: totalStepsCount }, (_, i) => (
        <View
          key={i}
          testID={'progress-item'}
          style={[
            styles.itemStyle,
            {
              width: itemWidth,
              backgroundColor: backgroundColor(i),
            },
          ]}
        />
      ))}
    </View>
  );
};
