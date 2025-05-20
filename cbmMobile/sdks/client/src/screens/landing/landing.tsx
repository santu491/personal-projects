import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ActionButton, Footer } from '../../../../../shared/src/components';
import { H1 } from '../../../../../shared/src/components/text/text';
import { SplashHeaderIcon } from '../../assets/icons/icons';
import { styles } from './landing.styles';
import { useLanding } from './useLanding';

export const LandingScreen = () => {
  const { t } = useTranslation();
  const { navigateEapBenefits } = useLanding();

  return (
    <View style={styles.splashParentContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <SplashHeaderIcon />
        </View>
        <H1 style={styles.splashText} testID={'splash.title'}>
          {t('splash.title')}
        </H1>
        <ActionButton
          onPress={navigateEapBenefits}
          title={t('splash.getStarted')}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          testID={'splash.redirect.organization.search'}
        />
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
};
