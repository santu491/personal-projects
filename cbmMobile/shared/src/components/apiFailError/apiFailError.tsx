import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ProcessIcon } from '../../assets/icons/icons';
import { H2, RNText } from '../text/text';
import { styles } from './apiFailError.styles';

interface ApiFailErrorProps {
  onPressContact?: () => void;
  supportNo?: string;
}

export const ApiFailError = ({ supportNo, onPressContact }: ApiFailErrorProps) => {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.icon}>
        <ProcessIcon />
      </View>
      <H2 style={styles.title}>{t('errors.appUnavailable.title')}</H2>
      <RNText style={styles.description}>
        {t('errors.appUnavailable.description')}
        {supportNo ? (
          <RNText style={styles.contactNo} onPress={onPressContact} testID={'apiFailError.contactNo'}>
            {supportNo}.
          </RNText>
        ) : null}
      </RNText>
    </>
  );
};
