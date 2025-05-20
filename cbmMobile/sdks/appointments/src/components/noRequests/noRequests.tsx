import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components/actionButton';
import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { AppUrl } from '../../../../../shared/src/models';
import { ClinicalSearchIcon } from '../../assets/icons/icons';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import { styles } from './noRequests.styles';

interface SectionViewProps {
  onPressGetStarted?: () => void;
}

export const NoRequests: React.FC<SectionViewProps> = ({ onPressGetStarted }) => {
  const { t } = useTranslation();
  const { navigationHandler } = useAppointmentContext();

  const naviagteToFindCounsoler = () => {
    navigationHandler.linkTo({ action: AppUrl.FIND_COUNSELOR });
    onPressGetStarted?.();
  };

  return (
    <View style={styles.container}>
      <H3 style={styles.title}>{t('appointments.noRequests.title')}</H3>

      <View style={styles.searchIconView}>
        <ClinicalSearchIcon />
      </View>

      <H1 style={styles.description}>{t('appointments.noRequests.description')}</H1>

      <ActionButton
        onPress={naviagteToFindCounsoler}
        title={t('appointments.noRequests.getStartedText')}
        style={styles.actionButton}
        textStyle={styles.actionButtonText}
        testID={'appointments.find.button'}
      />
    </View>
  );
};
