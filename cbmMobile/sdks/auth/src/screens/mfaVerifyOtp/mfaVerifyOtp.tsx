import { CheckBox } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { ErrorMessage } from '../../../../../shared/src/components/errorMessage/errorMessage';
import { LinkButton } from '../../../../../shared/src/components/linkButton/linkButton';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RNText } from '../../../../../shared/src/components/text/text';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { OtpTextInput } from '../../components/otpCodeInput/otpTextInput';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { FlowName } from '../../config/constants/auth';
import { otpStyles } from './mfaVerifyOtp.styles';
import { useVerifyOTPScreen } from './useMfaVerifyOtp';

export const MFAVerifyOTP = () => {
  const { t } = useTranslation();
  const {
    handleContinueButton,
    handlePreviousButton,
    handleResendCode,
    modelVisible,
    onPressSuccessAlertButton,
    progressStepsCount,
    loading,
    isContinueButtonEnabled,
    errorMessage,
    handleOTPChange,
    handleKeyPress,
    inputAccessoryViewID,
    inputRefs,
    otp,
    isEditableText,
    otpDescription,
    control,
    successAlertData,
    mfaData,
    isServerError,
  } = useVerifyOTPScreen();

  const styles = useMemo(() => otpStyles(), []);

  return (
    <>
      <ProgressHeader leftArrow={true} totalStepsCount={2} progressStepsCount={progressStepsCount} />

      <View style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        <AuthProfileTitle
          title={t('authentication.verificationTitle')}
          subTitle={otpDescription}
          testID={'auth.mfa.verify.otp.title'}
        />
        <OtpTextInput
          handleOTPChange={handleOTPChange}
          handleKeyPress={handleKeyPress}
          inputAccessoryViewID={inputAccessoryViewID}
          inputRefs={inputRefs}
          otp={otp}
          isEditableText={isEditableText}
        />

        <LinkButton
          onPress={handleResendCode}
          title={t('authentication.resendCode')}
          textStyle={styles.linkButtonStyle}
          testID={'auth.mfa.resend.code'}
        />

        {errorMessage ? (
          <ErrorMessage
            containerStyles={styles.errorViewContainer}
            labelStyles={styles.errorViewLabel}
            title={errorMessage}
            testId={'auth.mfa.verify.otp.error'}
          />
        ) : null}

        <AuthFooterButtons
          primaryButtonTitle={t('authentication.previous')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressPreviousButton={handlePreviousButton}
          onPressContinueButton={handleContinueButton}
          showPreviousButton={true}
          disabled={!isContinueButtonEnabled}
        />

        {mfaData?.flowName === FlowName.LOGIN && (
          <Controller
            control={control}
            name={'rememberDevice'}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => onChange(!value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: value }}
                accessibilityLabel={t('authentication.rememberDevice')}
              >
                <CheckBox
                  checked={value}
                  onPress={() => onChange(!value)}
                  styles={styles.checkbox}
                  testID="authentication.rememberDevice.checkbox"
                />
                <View style={styles.textContainerStyle}>
                  <RNText style={styles.textStyle}>{t('authentication.rememberDevice')}</RNText>
                  <RNText>{`(${t('authentication.rememberDeviceInfo')})`}</RNText>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {modelVisible && successAlertData ? (
          <AlertModel
            modalVisible={modelVisible}
            isError={isServerError}
            onHandlePrimaryButton={onPressSuccessAlertButton}
            title={successAlertData.title}
            subTitle={successAlertData.description}
            primaryButtonTitle={!isServerError ? t('authentication.continue') : t('authErrors.tryAgainButton')}
          />
        ) : null}
      </View>
    </>
  );
};
