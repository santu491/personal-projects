import { Field, InputScroll, TextInput } from '@sydney/motif-components';
import deepmerge from 'deepmerge';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { CarelonLogo, CarelonTitleLogo } from '../../../../../shared/src/assets/icons/icons';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { HeaderLeftView } from '../../../../../shared/src/components/headerLeftView';
import { HidableTextInput } from '../../../../../shared/src/components/hidableTextInput/hidableTextInput';
import { LinkButton } from '../../../../../shared/src/components/linkButton/linkButton';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../shared/src/context/appColors';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { LoginSetUpFieldNames } from '../../models/signUp';
import { loginStyles, overrideFieldStyles } from './login.styles';
import { useLogin } from './useLogin';

export const LoginScreen = () => {
  const { t } = useTranslation();
  const {
    handleLogin,
    navigateToForgotSecretScreen,
    navigateToForgotUserNameScreen,
    navigateToSignUpScreen,
    secretError,
    loading,
    control,
    isShownErrorAlert,
    formState: { isValid },
    updateSecretError,
    onPressErrorAlert,
    handleBackButton,
  } = useLogin();
  const styles = useMemo(() => deepmerge(loginStyles(), overrideFieldStyles), []);

  return (
    <>
      <View style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        <View style={styles.backButtonStyle}>
          <HeaderLeftView onPressLeftArrow={handleBackButton} />
        </View>
        <InputScroll>
          <View style={styles.titleView}>
            <View style={styles.logoTitleView}>
              <CarelonLogo width={30} height={29} />
              <CarelonTitleLogo />
            </View>
            <H3 testID={'auth.login.title'} style={styles.subTitleView}>
              {t('splash.title')}
            </H3>
          </View>
          <View style={styles.loginInputContainer}>
            <H1 style={{ color: appColors.purple }}>{t('login.title')}</H1>
            <View style={styles.loginLink}>
              <H3 style={styles.textColorStyle} testID={'auth.login.redirect.account'}>
                {t('login.accountLink')}
              </H3>
              <LinkButton
                onPress={navigateToSignUpScreen}
                title={t('login.signUpLink')}
                testID={'auth.login.redirect.signUp'}
                textStyle={styles.linkButtonStyle}
              />
            </View>
            <View style={styles.textInputRow}>
              <Controller
                control={control}
                name={LoginSetUpFieldNames.EMAIL}
                render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
                  <Field
                    label={t('login.userName')}
                    styles={styles.field}
                    errorMessage={isTouched ? error?.message : undefined}
                  >
                    <TextInput
                      styles={styles.textInput}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder={t('login.userNamePlaceHolder')}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoComplete="email"
                    />
                  </Field>
                )}
              />
              <LinkButton
                onPress={navigateToForgotUserNameScreen}
                title={t('login.forgotUserName')}
                testID={'auth.login.forgot.username'}
                textStyle={styles.forgotUserNameStyle}
              />
            </View>

            <View style={styles.textInputRow}>
              <Controller
                control={control}
                name={LoginSetUpFieldNames.SECRET}
                render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
                  <Field
                    styles={styles.field}
                    errorMessage={isTouched ? error?.message || secretError : secretError ? secretError : undefined}
                    label={t('login.secretHint')}
                  >
                    <HidableTextInput
                      accessibilityLabelHide={t('accountSetUp.hidePassword')}
                      accessibilityLabelShow={t('accountSetUp.showPassword')}
                      accessible={true}
                      autoComplete={'password-new'}
                      autoCorrect={false}
                      onBlur={onBlur}
                      onChangeText={(secretValue) => {
                        onChange(secretValue);
                        updateSecretError();
                      }}
                      textContentType="none"
                      value={value}
                      placeholder={t('login.secretHintPlaceHolder')}
                    />
                  </Field>
                )}
              />
              <LinkButton
                onPress={navigateToForgotSecretScreen}
                title={t('login.forgotPassword')}
                testID={'auth.login.forgot.password'}
                textStyle={styles.forgotUserNameStyle}
              />
            </View>
          </View>
        </InputScroll>

        <AuthFooterButtons
          secondaryButtonTitle={t('login.title')}
          onPressContinueButton={handleLogin}
          footerViewStyle={styles.footerButtons}
          disabled={!isValid}
        />
        {isShownErrorAlert ? (
          <AlertModel
            modalVisible={isShownErrorAlert}
            onHandlePrimaryButton={onPressErrorAlert}
            title={t('authErrors.loginErrorTitle')}
            subTitle={t('authErrors.loginUserText')}
            isError={true}
            primaryButtonTitle={t('authErrors.tryAgainButton')}
          />
        ) : null}
      </View>
    </>
  );
};
