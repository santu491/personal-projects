import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components/actionButton';
import { styles } from './authProfileTitle.styles';

interface AuthFooterButtonsProps {
  disabled?: boolean;
  footerViewStyle?: StyleProp<ViewStyle>;
  onPressContinueButton: () => void;
  onPressPreviousButton?: () => void;
  primaryButtonTitle?: string;
  secondaryButtonTitle?: string;
  showPreviousButton?: boolean;
}

export const AuthFooterButtons: React.FC<AuthFooterButtonsProps> = ({
  disabled = false,
  onPressContinueButton,
  onPressPreviousButton,
  showPreviousButton,
  footerViewStyle,
  primaryButtonTitle,
  secondaryButtonTitle: secondaryButtonTitle,
}) => {
  return (
    <View style={[styles.buttonsViewStyle, footerViewStyle]}>
      {showPreviousButton && primaryButtonTitle ? (
        <ActionButton
          onPress={() => onPressPreviousButton?.()}
          title={primaryButtonTitle}
          style={styles.previousButton}
          textStyle={styles.previousButtonText}
          testID={'authentication.button.previous'}
        />
      ) : null}

      {secondaryButtonTitle ? (
        <ActionButton
          onPress={onPressContinueButton}
          title={secondaryButtonTitle}
          style={[styles.actionButton, disabled && styles.buttonDisable]}
          textStyle={styles.actionButtonText}
          testID={'authentication.button.continue'}
          disabled={disabled}
        />
      ) : null}
    </View>
  );
};
