import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, StyleProp, Text, View, ViewStyle } from 'react-native';

import { styles } from './disclaimer.styles';

interface DisclaimerComponentProps {
  learnMoreLinkClicked: (event: GestureResponderEvent) => void;
  viewStyle: StyleProp<ViewStyle>;
}

export const DisclaimerView: React.FC<DisclaimerComponentProps> = ({ viewStyle, learnMoreLinkClicked }) => {
  const { t } = useTranslation();
  return (
    <View style={viewStyle}>
      <Text
        style={styles.descriptionStyle}
        testID={'Copy-rights-component'}
        accessible={true}
        accessibilityLabel={`${t('providers.providerDescription')} ${t('providers.learnMore')}`}
        accessibilityRole="link"
      >
        {t('providers.providerDescription')}
        {t('common.space')}
        <Text style={styles.learnLinkStyle} onPress={learnMoreLinkClicked}>
          {t('providers.learnMore')}
        </Text>
      </Text>
    </View>
  );
};
