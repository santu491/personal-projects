import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import NetworkLogger from 'react-native-network-logger';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H1 } from '../../../../../shared/src/components/text/text';
import { networkWatchLoggerStyles } from './networkWatchLogger.styles';
import { useNetworkWatchLogger } from './useNetworkWatchLogger';

export const NetworkWatchLogger = () => {
  const { onPressLeftArrow } = useNetworkWatchLogger();

  const { t } = useTranslation();

  return (
    <>
      <MainHeaderComponent onPressLeftArrow={onPressLeftArrow} isImmediateAssistanceVisible={false} hideLogin={true} />
      <View style={networkWatchLoggerStyles.container}>
        <H1 style={networkWatchLoggerStyles.title} testID="menu.networkLogger">
          {t('menu.networkLogger')}
        </H1>
        <NetworkLogger />
      </View>
    </>
  );
};
