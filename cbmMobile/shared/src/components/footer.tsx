import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import { ScreenNames } from '../../../src/config';
import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

type FooterProps = {
  footerStyle?: TextStyle;
};
export const Footer: React.FC<FooterProps> = ({ footerStyle }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const navigateToPrivacyPolicyScreen = () => {
    navigation.navigate(ScreenNames.PRIVACY_POLICY as never);
  };

  const navigateToTermsOfUseScreen = () => {
    navigation.navigate(ScreenNames.TERMS_OF_USE as never);
  };

  return (
    <View style={styles.footerContainer}>
      <Text style={footerStyle ? footerStyle : styles.footerText} testID="footer-text">
        {t('footer.copyRight') + ' |  '}
      </Text>
      <Text testID={'PrivacyPolicy'} style={[styles.footerText, styles.link]} onPress={navigateToPrivacyPolicyScreen}>
        {t('footer.privacy')}
      </Text>
      <Text style={styles.footerText}>{' |  '}</Text>
      <Text testID={'TermsOfUse'} style={[styles.footerText, styles.link]} onPress={navigateToTermsOfUseScreen}>
        {t('footer.terms')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: appColors.white,
    fontFamily: appFonts.regular,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
