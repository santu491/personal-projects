import { Drawer } from '@sydney/motif-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { ActionButton } from '../actionButton';
import { modelStyles } from './loginDrawerStyles';

interface LoginDrawerProps {
  isDrawerEnabled?: boolean;
  onCloseDrawer: () => void;
  onPressLink?: () => void;
  onPressPrimaryButton: () => void;
  onPressSecondaryButton: () => void;
}

export const LoginDrawer: React.FC<LoginDrawerProps> = ({
  onPressPrimaryButton,
  onPressSecondaryButton,
  onPressLink,
  isDrawerEnabled,
  onCloseDrawer,
}) => {
  const { t } = useTranslation();
  return (
    <Drawer
      //   styles={styles.drawer}
      hideDrawerHeader
      visible={isDrawerEnabled}
      onRequestClose={onCloseDrawer}
      children={
        <>
          <View style={modelStyles.headerContainer}>
            <Text style={modelStyles.bottomSheetTitleStyle} testID={'login.loginOrCreateAccount'}>
              {t('login.loginOrCreateAccount')}
            </Text>
          </View>

          <View style={modelStyles.descriptionContainer}>
            <Text style={modelStyles.message}>To schedule an appointment, please log in or create an account. </Text>
            <ActionButton
              onPress={onPressPrimaryButton}
              title={t('login.login')}
              style={modelStyles.loginButton}
              textStyle={modelStyles.loginButtonText}
              testID={'login.login'}
            />
            <ActionButton
              onPress={onPressSecondaryButton}
              title={t('login.createAccount')}
              style={modelStyles.createAccountButton}
              textStyle={modelStyles.createAccountButtonText}
              testID={'login.createAccount'}
            />
            <Text style={modelStyles.bottomContent}>{t('login.haveAQuestion')}</Text>
            <TouchableOpacity onPress={onPressLink}>
              <Text style={[modelStyles.message, modelStyles.link]}>{t('login.contactAdministrator')}</Text>
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
};
