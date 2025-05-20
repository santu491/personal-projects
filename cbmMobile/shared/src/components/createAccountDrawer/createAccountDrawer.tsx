import { Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { CreateAccountLogo } from '../../assets/icons/icons';
import { ActionButton } from '../actionButton';
import { modelStyles } from './createAccountDrawer.styles';

interface CreateAccountDrawerProps {
  isDrawerEnabled: boolean;
  onCloseDrawer: () => void;
  onPressPrimaryButton: () => void;
}

export const CreateAccountDrawer: React.FC<CreateAccountDrawerProps> = ({
  onPressPrimaryButton,
  isDrawerEnabled,
  onCloseDrawer,
}) => {
  const { t } = useTranslation();

  const data = useMemo(
    () => [
      t('mhsud.createAccount.drawer.info1'),
      t('mhsud.createAccount.drawer.info2'),
      t('mhsud.createAccount.drawer.info3'),
    ],
    [t]
  );
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
              {t('mhsud.createAccount.drawer.title')}
            </Text>
          </View>
          <CreateAccountLogo />

          <View style={modelStyles.contentView}>
            {data.map((item) => (
              <View style={modelStyles.content} key={item}>
                <View style={modelStyles.circle} />
                <Text style={modelStyles.bottomContent}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={modelStyles.descriptionContainer}>
            <ActionButton
              onPress={onPressPrimaryButton}
              title={t('mhsud.createAccount.drawer.createAccountButton')}
              style={modelStyles.loginButton}
              textStyle={modelStyles.loginButtonText}
              testID={'login.login'}
            />
          </View>
        </>
      }
    />
  );
};
