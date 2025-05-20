import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';

import { InfoIcon, RightCloseIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { styles } from './popup.styles';

interface PopupProps {
  description: string;
  icon?: React.ReactNode;
  isVisible?: boolean;
  linkText?: string;
  onPressCloseIcon: () => void;
  onPressLink?: () => void;
  onPressPrimaryButton?: () => void;
  primaryButtonText?: string;
  title: string;
}

export const Popup = ({
  description,
  linkText,
  onPressCloseIcon,
  onPressLink,
  title,
  isVisible,
  icon,
  primaryButtonText,
  onPressPrimaryButton,
}: PopupProps) => {
  return (
    <RNModal isVisible={isVisible} testID="alert-back-drop">
      <View style={styles.container}>
        <View style={styles.iconView}>
          {icon ?? <InfoIcon />}
          <TouchableOpacity onPress={onPressCloseIcon} accessibilityRole="button" accessibilityLabel="close">
            <RightCloseIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {primaryButtonText && onPressPrimaryButton ? (
          <ActionButton title={primaryButtonText} onPress={onPressPrimaryButton} />
        ) : null}

        {linkText ? (
          <TouchableOpacity onPress={onPressLink} accessibilityRole="button" accessibilityLabel="link">
            <Text style={styles.link}>{linkText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </RNModal>
  );
};
