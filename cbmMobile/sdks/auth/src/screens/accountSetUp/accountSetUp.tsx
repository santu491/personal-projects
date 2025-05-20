import { Field, InputScroll, Radio, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LinkWithText } from '../../../../../shared/src/components/linkWithText/linkWithText';
import { PhoneNumber } from '../../../../../shared/src/components/phoneNumber/phoneNumber';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { PasswordFields, PasswordFieldsData } from '../../components/passwordFields';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { VOICE_MAIL_OPTIONS } from '../../constants/constants';
import { AccountSetUpFieldNames } from '../../models/signUp';
import { PASSWORD_VALIDATION_MESSAGES } from '../../utils/passwordValidationSchema';
import { accountSetUpStyles } from './accountSetUp.styles';
import { useAccountSetUp } from './useAccountSetUp';

export const AccountSetUp = () => {
  const { t } = useTranslation();
  const {
    navigateToSignUpScreen,
    handleContinueButton,
    handlePreviousButton,
    control,
    formState: { isValid },
    formState,
    trigger,
    getValues,
    isEmailExist,
    setEmail,
    loading,
    isMemberDisabled,
  } = useAccountSetUp();
  const styles = useMemo(() => accountSetUpStyles(), []);

  return (
    <>
      <ProgressLoader isVisible={loading} />
      <ProgressHeader leftArrow={true} totalStepsCount={3} progressStepsCount={2} />
      <View style={styles.mainContainer}>
        <InputScroll>
          <AuthProfileTitle
            title={t('signUp.title')}
            subTitle={t('accountSetUp.description')}
            testID={'auth.signUp.title'}
            subTitleStyle={styles.subTitleStyle}
          />
          <View style={styles.loginLink}>
            <LinkWithText
              label={t('signUp.signInLinkText')}
              linkText={t('login.title')}
              onPress={navigateToSignUpScreen}
            />
          </View>
          <Controller
            control={control}
            name={AccountSetUpFieldNames.PHONE_NUMBER}
            render={({ field: { onChange, value, onBlur }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('accountSetUp.phoneNumber')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <PhoneNumber
                  placeholder={t('accountSetUp.phoneNumberPlaceholder')}
                  onChange={onChange}
                  value={value}
                  accessibilityHint="phone number"
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={AccountSetUpFieldNames.VOICE_EMAIL}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('accountSetUp.voiceMailDescription')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <Radio
                  items={VOICE_MAIL_OPTIONS}
                  onValueChange={onChange}
                  value={value}
                  reverse
                  noLineBreak
                  styles={styles.radio}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={AccountSetUpFieldNames.EMAIL}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error, invalid } }) => (
              <Field
                label={t('accountSetUp.email')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={
                  isEmailExist
                    ? isMemberDisabled
                      ? t('accountSetUp.memberDisabled')
                      : t('accountSetUp.emailExist')
                    : isTouched
                      ? error?.message
                      : undefined
                }
              >
                <TextInput
                  styles={styles.textInput}
                  value={value}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                    setEmail(value, invalid);
                  }}
                  onChangeText={onChange}
                  placeholder={t('accountSetUp.emailPlaceholder')}
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

          <PasswordFields
            content={{
              accessibilityShowReEnterPassword: t('accountSetUp.showReEnterPassword'),
              accessibilityShowPassword: t('accountSetUp.showPassword'),
              accessibilityHideReEnterPassword: t('accountSetUp.hidePassword'),
              accessibilityHidePassword: t('accountSetUp.reEnterPassword'),
              reEnterPasswordLabel: t('accountSetUp.reEnterPassword'),
              passwordLabel: t('accountSetUp.password'),
              passwordValidation: PASSWORD_VALIDATION_MESSAGES,
              requiredLabel: t('accountSetUp.required'),
              passwordPlaceholder: t('accountSetUp.passwordPlaceholder'),
              reEnterPasswordPlaceholder: t('accountSetUp.reEnterPasswordPlaceholder'),
            }}
            control={control as unknown as Control<PasswordFieldsData>}
            password={getValues().secret}
            passwordErrorMessage={formState.errors.secret?.message}
            testIdPrefix="auth.accountSetUp"
            trigger={trigger}
            userName={getValues().email}
          />
        </InputScroll>
        <AuthFooterButtons
          disabled={!isValid || isEmailExist}
          primaryButtonTitle={t('authentication.previous')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressPreviousButton={handlePreviousButton}
          onPressContinueButton={handleContinueButton}
          footerViewStyle={styles.footerButtons}
          showPreviousButton={true}
        />
      </View>
    </>
  );
};
