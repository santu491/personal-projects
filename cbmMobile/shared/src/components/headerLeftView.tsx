import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { BackArrow } from '../assets/icons/icons';
import { appColors } from '../context/appColors';

export interface HeaderLeftViewProps {
  backArrowStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  onPressLeftArrow?: () => void;
}

export const HeaderLeftView = ({ onPressLeftArrow, backArrowStyle, icon }: HeaderLeftViewProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const onPressButton = () => {
    if (onPressLeftArrow) {
      onPressLeftArrow();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  return (
    <TouchableOpacity
      onPress={onPressButton}
      accessibilityLabel={t('client.goBackText')}
      accessibilityRole="button"
      testID={'left-arrow-button'}
    >
      <View style={[styles.arrowBadgeStyle, backArrowStyle]}>{icon ?? <BackArrow />}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowBadgeStyle: {
    borderRadius: 28,
    backgroundColor: appColors.paleGray,
    zIndex: 1,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 19,
  },
});
