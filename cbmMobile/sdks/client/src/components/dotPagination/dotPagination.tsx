import React from 'react';
import { View } from 'react-native';

import { styles } from './dotPagination.styles';

interface DotPaginationProps {
  backgroundColor: (index: number) => string;
  testID?: string;
  totalStepsCount: number;
}

export const DotPagination = ({ totalStepsCount, backgroundColor, testID }: DotPaginationProps) => {
  return (
    <View testID={testID} style={styles.dotViewStyle}>
      {Array.from({ length: totalStepsCount }, (_, i) => (
        <View
          key={i}
          testID={`dot-item`}
          style={[
            styles.itemStyle,
            {
              backgroundColor: backgroundColor(i),
            },
          ]}
        />
      ))}
    </View>
  );
};
