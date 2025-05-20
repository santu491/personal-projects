import React from 'react';

import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { useUserContext } from '../../context/auth.sdkContext';
import { Screen } from '../../navigation/auth.navigationTypes';

interface ProgressHeaderProps {
  leftArrow: boolean;
  onPressLeftArrow?: () => void;
  progressStepsCount: number;
  totalStepsCount: number;
}

export const ProgressHeader = ({
  leftArrow = true,
  progressStepsCount,
  totalStepsCount,
  onPressLeftArrow,
}: ProgressHeaderProps) => {
  const { navigation } = useUserContext();

  const onPressCloseIcon = () => {
    navigation.navigate(Screen.LOGIN);
  };

  return (
    <ProgressBarHeader
      leftArrow={leftArrow}
      progressStepsCount={progressStepsCount}
      totalStepsCount={totalStepsCount}
      onPressCloseIcon={onPressCloseIcon}
      onPressLeftArrow={onPressLeftArrow}
    />
  );
};
