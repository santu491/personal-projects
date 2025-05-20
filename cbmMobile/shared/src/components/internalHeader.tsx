import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { appColors } from '../context/appColors';
import { H1 } from './text/text';

interface InternalHeaderProps {
  leftIcon?: React.ReactNode;
  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
  rightIcon?: React.ReactNode;
  title: string;
}

export const InternalHeader = ({
  rightIcon,
  leftIcon,
  title,
  onPressLeftIcon,
  onPressRightIcon,
}: InternalHeaderProps) => {
  const navigation = useNavigation();

  const headerTitle = useCallback(() => {
    return <H1>{title}</H1>;
  }, [title]);

  const headerLeft = useCallback(() => {
    return leftIcon ? (
      <TouchableOpacity onPress={onPressLeftIcon} accessibilityRole="button" testID={'header-left-button'}>
        {leftIcon}
      </TouchableOpacity>
    ) : null;
  }, [leftIcon, onPressLeftIcon]);

  const headerRight = useCallback(() => {
    return rightIcon ? (
      <TouchableOpacity onPress={onPressRightIcon} accessibilityRole="button" testID={'header-right-button'}>
        {rightIcon}
      </TouchableOpacity>
    ) : null;
  }, [rightIcon, onPressRightIcon]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerTitle,
      headerRight,
      headerTitleAlign: 'center',
    });
  }, [headerLeft, headerRight, headerTitle, navigation]);

  return <View style={styles.headerMainView} />;
};

export const styles = StyleSheet.create({
  headerMainView: {
    backgroundColor: appColors.white,
    marginBottom: 2,
    shadowColor: appColors.backgroundGray,
    shadowRadius: 0.5,
    elevation: 5,
  },
});
