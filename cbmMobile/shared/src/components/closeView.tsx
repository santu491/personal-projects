import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { RightCloseIcon } from '../assets/icons/icons';
import { appColors } from '../context/appColors';

export interface CloseViewProps {
  onPressCloseIcon?: () => void;
}

export const CloseView: React.FC<CloseViewProps> = ({ onPressCloseIcon }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onPressButton = () => {
    if (onPressCloseIcon) {
      onPressCloseIcon();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressButton}
      testID={'auth.header.close.button'}
      accessibilityRole="button"
      accessibilityLabel={t('common.close')}
    >
      <View style={styles.arrowBadgeStyle}>
        <RightCloseIcon />
      </View>
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
    marginRight: 20,
  },
});
