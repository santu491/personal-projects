import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ErrorInfoIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components/actionButton';
import { RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { styles } from './cancelAllComponent.styles';

interface CancelViewProps {
  onHandleCancelAll: () => void;
}

export const CancelAllComponent: React.FC<CancelViewProps> = ({ onHandleCancelAll }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.cancelViewContainer}>
      <ActionButton
        onPress={() => onHandleCancelAll()}
        title={t('appointments.appointmentDetailsContent.cancelAllAlertTitle')}
        testID={'appointments.appointmentDetails.cancel'}
      />
      <View style={styles.cancelDescriptionView}>
        <ErrorInfoIcon color={appColors.gray} />
        <RNText style={styles.cancelAllDescription} testID={'appointments.pending.cancelDescription'}>
          {t('appointments.appointmentDetailsContent.cancelAllDescription')}
        </RNText>
      </View>
    </View>
  );
};
