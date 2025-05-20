import { CheckBox, Field, InputScroll, Radio, Select } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { LinkWithText } from '../../../../../shared/src/components/linkWithText/linkWithText';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { EMPLOYEE_STATUS_OPTIONS, JOB_CATEGORY_OPTIONS, SUBSCRIBER_OPTIONS } from '../../constants/constants';
import { ConfirmStatusFieldNames } from '../../models/signUp';
import { confirmStatusStyles } from './confirmStatus.styles';
import { useConfirmStatus } from './useConfirmStatus';

export const ConfirmStatus = () => {
  const { t } = useTranslation();
  const {
    navigateToSignInScreen,
    handleContinueButton,
    handlePreviousButton,
    navigateToPrivacyPolicy,
    navigateToTermsOfUse,
    navigateToStatementOfUnderstanding,
    control,
    formState: { isValid },
    isSuccess,
    onAlertButonPress,
    loading,
    isShownAlert,
    apiErrorMessage,
  } = useConfirmStatus();
  const styles = useMemo(() => confirmStatusStyles(), []);

  return (
    <>
      <ProgressLoader isVisible={loading} />
      <ProgressHeader leftArrow={true} totalStepsCount={3} progressStepsCount={3} />
      <View style={styles.mainContainer}>
        <InputScroll>
          <AuthProfileTitle
            title={t('signUp.title')}
            subTitle={t('confirmStatus.description')}
            testID={'auth.signUp.title'}
            subTitleStyle={styles.subTitleStyle}
          />
          <View style={styles.linkContainer}>
            <LinkWithText
              label={t('signUp.signInLinkText')}
              linkText={t('login.title')}
              onPress={navigateToSignInScreen}
            />
          </View>
          <Controller
            control={control}
            name={ConfirmStatusFieldNames.EMPLOYEE_STATUS}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('confirmStatus.employeeStatus')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <Select
                  accessibilityLabel={value}
                  accessibilityHint={value}
                  testID="confirmStatus.employeeStatus"
                  items={EMPLOYEE_STATUS_OPTIONS}
                  value={value}
                  pickerTitle={t('confirmStatus.employeeStatus')}
                  placeholder={t('confirmStatus.employeeStatusPlaceholder')}
                  onValueChange={(gender) => {
                    onChange(gender);
                  }}
                  doneText={t('signUp.done')}
                  styles={{ input: styles.textInput }}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={ConfirmStatusFieldNames.JOB_CATEGORY}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('confirmStatus.jobCategory')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <Select
                  accessibilityLabel={value}
                  accessibilityHint={value}
                  items={JOB_CATEGORY_OPTIONS}
                  value={value}
                  testID="confirmStatus.jobCategory"
                  pickerTitle={t('confirmStatus.jobCategory')}
                  placeholder={t('confirmStatus.jobCategoryPlaceholder')}
                  onValueChange={(gender) => {
                    onChange(gender);
                  }}
                  doneText={t('signUp.done')}
                  styles={{ input: styles.textInput }}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={ConfirmStatusFieldNames.SUBSCRIBER}
            render={({ field: { onChange, value } }) => (
              <Field label={t('confirmStatus.subscriber')} styles={styles.field} accessoryEnd={<RequiredView />}>
                <Radio
                  items={SUBSCRIBER_OPTIONS}
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
            name={ConfirmStatusFieldNames.PRIVACY_POLICY}
            render={({ field: { onChange, value } }) => (
              <View style={styles.linkContainer}>
                <CheckBox checked={value} onPress={() => onChange(!value)} styles={styles.checkbox} />
                <LinkWithText
                  label={t('confirmStatus.chekboxLabel')}
                  linkText={t('confirmStatus.privacyPolicy')}
                  onPress={navigateToPrivacyPolicy}
                  textStyle={styles.linkLabel}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name={ConfirmStatusFieldNames.TERMS_OF_USE}
            render={({ field: { onChange, value } }) => (
              <View style={styles.linkContainer}>
                <CheckBox checked={value} onPress={() => onChange(!value)} styles={styles.checkbox} />
                <LinkWithText
                  label={t('confirmStatus.chekboxLabel')}
                  linkText={t('confirmStatus.termsOfUse')}
                  onPress={navigateToTermsOfUse}
                  textStyle={styles.linkLabel}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name={ConfirmStatusFieldNames.STATEMENT_OF_UNDERSTANDING}
            render={({ field: { onChange, value } }) => (
              <View style={styles.linkContainer}>
                <CheckBox checked={value} onPress={() => onChange(!value)} styles={styles.checkbox} />
                <LinkWithText
                  label={t('confirmStatus.chekboxLabel')}
                  linkText={t('confirmStatus.statementOfUnderstanding')}
                  onPress={navigateToStatementOfUnderstanding}
                  textStyle={styles.linkLabel}
                />
              </View>
            )}
          />
        </InputScroll>
        <AuthFooterButtons
          disabled={!isValid}
          primaryButtonTitle={t('authentication.previous')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressPreviousButton={handlePreviousButton}
          onPressContinueButton={handleContinueButton}
          footerViewStyle={styles.footerButtons}
          showPreviousButton={true}
        />

        {!loading ? (
          <AlertModel
            modalVisible={isShownAlert}
            onHandlePrimaryButton={onAlertButonPress}
            title={isSuccess ? t('confirmStatus.accountCreated') : t('authErrors.registrationErrorTitle')}
            subTitle={
              isSuccess
                ? t('confirmStatus.accountCreatedDescription')
                : (apiErrorMessage ?? t('authErrors.registrationErrorText'))
            }
            isError={!isSuccess}
            primaryButtonTitle={isSuccess ? t('appointment.continue') : t('authErrors.tryAgainButton')}
          />
        ) : null}
      </View>
    </>
  );
};
