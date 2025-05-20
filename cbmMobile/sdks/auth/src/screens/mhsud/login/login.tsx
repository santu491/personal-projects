import { TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { ActionButton } from '../../../../../../shared/src/components';
import { CreateAccountDrawer } from '../../../../../../shared/src/components/createAccountDrawer/createAccountDrawer';
import { LinkButton } from '../../../../../../shared/src/components/linkButton/linkButton';
import { MainHeaderComponent } from '../../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { TitleHeader } from '../../../../../../shared/src/components/titleHeader/titleHeader';
import { loginMhsudStyles } from './login.styles';
import { useLogin } from './useLogin';

export const LoginMhsud = () => {
  const { t } = useTranslation();
  const styles = useMemo(() => loginMhsudStyles(), []);
  const {
    handleLogin,
    handleCreateAccount,
    onChangeText,
    value,
    isCreateAccountDrawerEnabled,
    onCloseCreateAccountDrawer,
    navigateToCreateAccount,
  } = useLogin();
  return (
    <>
      <MainHeaderComponent leftArrow={false} isImmediateAssistanceVisible={false} />
      <ScrollView keyboardShouldPersistTaps="always" style={styles.scrollView}>
        <TitleHeader title={t('mhsud.login.login')} />
        <View style={styles.container}>
          <Text style={styles.description}>{t('mhsud.login.description')}</Text>
          <View style={styles.labelView}>
            <Text>
              {t('mhsud.login.inputLabel')}
              <Text style={styles.required}>{t('common.space')}*</Text>
            </Text>
            <Text style={styles.forgotEmail}>{t('mhsud.login.forgotEmail')}</Text>
          </View>
          <TextInput styles={styles.textInput} value={value} onChangeText={onChangeText} />
          <ActionButton
            title={t('mhsud.login.continue')}
            onPress={handleLogin}
            style={[styles.actionButton, !value && styles.buttonDisable]}
            disabled={!value}
            textStyle={[styles.actionButtonText, !value && styles.buttonTextDisable]}
          />

          <LinkButton title={t('mhsud.login.createAccount')} onPress={handleCreateAccount} textStyle={styles.link} />
        </View>
        {isCreateAccountDrawerEnabled ? (
          <CreateAccountDrawer
            isDrawerEnabled={isCreateAccountDrawerEnabled}
            onCloseDrawer={onCloseCreateAccountDrawer}
            onPressPrimaryButton={navigateToCreateAccount}
          />
        ) : null}
      </ScrollView>
    </>
  );
};
