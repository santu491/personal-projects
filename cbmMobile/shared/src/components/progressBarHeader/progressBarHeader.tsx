import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import { appColors } from '../../context/appColors';
import { CloseView } from '../closeView';
import { HeaderLeftView } from '../headerLeftView';
import { styles } from './progressBarHeader.styles';
import { ProgressBarList } from './progressBarList';

interface ProgressHeaderProps {
  leftArrow: boolean;
  onPressCloseIcon?: () => void;
  onPressLeftArrow?: () => void;
  progressStepsCount: number;
  totalStepsCount: number;
}

export const ProgressBarHeader = ({
  leftArrow = true,
  progressStepsCount,
  totalStepsCount,
  onPressCloseIcon,
  onPressLeftArrow,
}: ProgressHeaderProps) => {
  const navigation = useNavigation();

  const headerTitle = useCallback(() => {
    return (
      <ProgressBarList
        totalStepsCount={totalStepsCount}
        testID={'test-id-progress-header'}
        backgroundColor={(index) => {
          return index < progressStepsCount ? appColors.lightPurple : appColors.mediumLightPurple;
        }}
      />
    );
  }, [progressStepsCount, totalStepsCount]);

  const headerLeft = useCallback(() => {
    return leftArrow ? <HeaderLeftView onPressLeftArrow={onPressLeftArrow} /> : null;
  }, [leftArrow, onPressLeftArrow]);

  const headerRight = useCallback(() => {
    return leftArrow ? <CloseView onPressCloseIcon={onPressCloseIcon} /> : null;
  }, [leftArrow, onPressCloseIcon]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft,

      headerTitle,

      headerRight,
    });
  }, [headerLeft, headerRight, headerTitle, leftArrow, navigation, progressStepsCount, totalStepsCount]);

  return <View style={styles.headerMainView} />;
};
