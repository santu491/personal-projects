import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { APP_CONTENT } from '../../../../src/config';
import { CloudErrorIcon } from '../../assets/icons/icons';
import { callNumber } from '../../utils/utils';
import { ActionButton } from '../actionButton';
import { H1, H3 } from '../text/text';
import { styles } from './fullScreenError.styles';

interface FullScreenErrorProps {
  buttonTitle?: string;
  description?: string;
  onPressTryAgain?: () => void;
  title?: string;
}

export const FullScreenError: React.FC<FullScreenErrorProps> = ({
  title,
  description,
  buttonTitle,
  onPressTryAgain,
}) => {
  const { t } = useTranslation();

  const phoneNumberTapped = (mobileNumber: string) => {
    callNumber(mobileNumber);
  };

  return (
    <View style={styles.container}>
      <H3 style={styles.title}>{title || t('errors.fullScreenError.title')}</H3>

      <View style={styles.searchIconView}>
        <CloudErrorIcon />
      </View>

      <H1 style={styles.description}>
        {description || t('errors.fullScreenError.description')}
        {t('common.space')}
        <H3
          style={styles.assistancePhoneTextStyle}
          onPress={() => phoneNumberTapped(APP_CONTENT.MENU.CONTACT_US_PHONE_NO)}
        >
          {t('credibleMind.immediateAssistance.phoneNumber')}
        </H3>
      </H1>

      <ActionButton
        onPress={() => onPressTryAgain?.()}
        title={buttonTitle || t('errors.fullScreenError.primaryButton')}
        style={styles.actionButton}
        textStyle={styles.actionButtonText}
        testID={'appointments.find.button'}
      />
    </View>
  );
};
