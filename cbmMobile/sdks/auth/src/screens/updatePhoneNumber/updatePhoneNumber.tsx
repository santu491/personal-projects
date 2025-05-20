import { Field } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { PhoneNumber } from '../../../../../shared/src/components/phoneNumber/phoneNumber';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AccountSetUpFieldNames } from '../../models/signUp';
import { phoneNumberStyles } from './updatePhoneNumber.styles';
import { useUpdatePhoneNumber } from './useUpdatePhoneNumber';

export const UpdatePhoneNumber = () => {
  const {
    loading,
    handleContinueButton,
    handlePreviousButton,
    updatePhoneNumberError,
    control,
    modelVisible,
    formState: { isValid },
    onPressSuccessAlertButton,
    phoneNumberUpdateError,
  } = useUpdatePhoneNumber();
  const styles = useMemo(() => phoneNumberStyles(), []);
  const { t } = useTranslation();

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        <MemberProfileHeader title={t('profile.editPhoneNumber')} />
        <View style={styles.screenContainer}>
          <Controller
            control={control}
            name={AccountSetUpFieldNames.PHONE_NUMBER}
            render={({ field: { onChange, value, onBlur }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('accountSetUp.phoneNumber')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : phoneNumberUpdateError ? phoneNumberUpdateError : undefined}
              >
                <PhoneNumber
                  testID={'menu.profile.editPhonenumber'}
                  placeholder={t('accountSetUp.phoneNumberPlaceholder')}
                  value={value}
                  accessibilityHint={t('accountSetUp.phoneNumber')}
                  onChange={(phoneNumber) => {
                    onChange(phoneNumber);
                    updatePhoneNumberError();
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                />
              </Field>
            )}
          />
        </View>

        {modelVisible ? (
          <AlertModel
            modalVisible={modelVisible}
            onHandlePrimaryButton={onPressSuccessAlertButton}
            title={t('profile.phoneNumberSuccessMessage.title')}
            subTitle={t('profile.phoneNumberSuccessMessage.message')}
            primaryButtonTitle={t('authentication.continue')}
          />
        ) : null}

        <AuthFooterButtons
          primaryButtonTitle={t('authentication.cancel')}
          secondaryButtonTitle={t('authentication.save')}
          onPressContinueButton={handleContinueButton}
          onPressPreviousButton={handlePreviousButton}
          footerViewStyle={styles.footerButtons}
          showPreviousButton={true}
          disabled={!isValid}
        />
      </View>
    </>
  );
};
