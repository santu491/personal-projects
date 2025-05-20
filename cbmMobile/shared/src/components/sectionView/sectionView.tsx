import React from 'react';
import { View } from 'react-native';

import { H3, RNText } from '../text/text';
import { styles } from './sectionView.styles';

interface SectionViewProps {
  children?: React.ReactNode;
  headerTitle: string;
  subTitle?: string;
}

export const SectionView: React.FC<SectionViewProps> = ({ headerTitle, subTitle, children }) => {
  // Pass children as a parameter
  return (
    <View style={styles.sectionViewStyle}>
      <View style={styles.headerContainer}>
        <H3 testID={'section-header-title'} style={styles.headerTitleStyle}>
          {headerTitle}
        </H3>
        {subTitle ? (
          <RNText testID={'section-sub-title'} style={styles.subTitleStyle}>
            {subTitle}
          </RNText>
        ) : null}
      </View>
      <View style={styles.lineViewStyle} />

      <View style={styles.innerContainer}>{children}</View>
    </View>
  );
};
