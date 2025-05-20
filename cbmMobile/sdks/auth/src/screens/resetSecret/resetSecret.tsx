import { InputScroll } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { PasswordFields } from '../../components/passwordFields/passwordFields';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { PASSWORD_VALIDATION_MESSAGES } from '../../utils/passwordValidationSchema';
import { resetSecretStyles } from './resetSecret.styles';
import { useResetSecret } from './useResetSecret';

export const ResetSecretScreen = () => {
  const {
    loading,
    handleContinueButton,
    handlePreviousButton,
    control,
    getValues,
    trigger,
    formState,
    formState: { isValid },
    userContext,
    modelVisible,
    onPressSuccessAlertButton,
  } = useResetSecret();
  const styles = useMemo(() => resetSecretStyles(), []);

  const { t } = useTranslation();

  return (
    <>
      <ProgressHeader
        leftArrow={true}
        totalStepsCount={3}
        progressStepsCount={3}
        onPressLeftArrow={handlePreviousButton}
      />
      <View style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        <View style={styles.screenContainer}>
          <InputScroll>
            <AuthProfileTitle
              title={t('profile.accountSecret.title')}
              subTitle={t('profile.accountSecret.enterNewSecret')}
              testID={'auth.account.secret.title'}
              subTitleStyle={styles.subTitleStyle}
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
              control={control}
              password={getValues().secret}
              passwordErrorMessage={formState.errors.secret?.message}
              testIdPrefix="auth.accountSetUp"
              trigger={trigger}
              userName={userContext.mfaData?.userName ?? ''}
            />
          </InputScroll>
        </View>

        {modelVisible ? (
          <AlertModel
            modalVisible={modelVisible}
            onHandlePrimaryButton={onPressSuccessAlertButton}
            title={t('profile.accountSecret.successTitle')}
            subTitle={t('profile.accountSecret.successMessage')}
            primaryButtonTitle={t('authentication.continue')}
          />
        ) : null}

        <AuthFooterButtons
          primaryButtonTitle={t('authentication.previous')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressContinueButton={handleContinueButton}
          footerViewStyle={styles.footerButtons}
          showPreviousButton={true}
          onPressPreviousButton={handlePreviousButton}
          disabled={!isValid}
        />
      </View>
    </>
  );
};
