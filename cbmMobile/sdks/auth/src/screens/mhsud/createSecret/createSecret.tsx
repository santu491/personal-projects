import { Field, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';

import { HidableTextInput } from '../../../../../../shared/src/components/hidableTextInput/hidableTextInput';
import { MainHeaderComponent } from '../../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { RequiredView } from '../../../../../../shared/src/components/requiredView';
import { TitleHeader } from '../../../../../../shared/src/components/titleHeader/titleHeader';
import { fieldStyles } from '../../../../../../shared/src/overrideStyles/field.styles';
import { PasswordFields, PasswordFieldsData } from '../../../components/passwordFields';
import { AccountSetUpFieldNames } from '../../../models/signUp';
import { PASSWORD_VALIDATION_MESSAGES } from '../../../utils/passwordValidationSchema';
import { createSecreteStyles } from './createSecrete.styles';
import { useCreateSecret } from './useCreateSecret';

export const CreateSecreteMhsud = () => {
  const { t } = useTranslation();
  const styles = useMemo(() => createSecreteStyles(), []);
  const { control, formState, getValues, trigger, validationItems, passwordValidationDropdownItems } =
    useCreateSecret();

  return (
    <>
      <MainHeaderComponent leftArrow={false} isImmediateAssistanceVisible={false} />
      <ScrollView keyboardShouldPersistTaps="always" style={styles.scrollView}>
        <TitleHeader title={'Create Password'} />
        <View style={styles.mainContainer}>
          <Controller
            control={control}
            name={AccountSetUpFieldNames.SECRET}
            render={({ field: { onChange, onBlur, value } }) => (
              <Field
                // errorMessage={passwordError}
                label={'Create password'}
                styles={fieldStyles.field}
                accessoryEnd={<RequiredView />}
                validationDropdown={{ inputEmpty: !value, items: passwordValidationDropdownItems }}
              >
                <HidableTextInput
                  //   accessibilityLabelHide={content.accessibilityHidePassword}
                  //   accessibilityLabelShow={content.accessibilityShowPassword}
                  //   autoComplete={'password-new'}
                  //   placeholder={content.passwordPlaceholder}
                  autoCorrect={false}
                  onBlur={() => {
                    onBlur();
                    // onPasswordFocusedChanged(false);
                  }}
                  onChangeText={(newText) => {
                    onChange(newText);
                    trigger();
                  }}
                  //   onFocus={() => onPasswordFocusedChanged(true)}
                  //   testID={`${testIdPrefix}.password`}
                  textContentType="none"
                  value={value}
                />
              </Field>
            )}
          />
          {/* {validationItems.map((item) => (
            <Text key={item.message} style={{ color: item.valid ? 'green' : 'red' }}>
              {item.message}
            </Text>
          ))} */}
          <Controller
            control={control}
            name={AccountSetUpFieldNames.RE_ENTER_SECRET}
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Field
                styles={fieldStyles.field}
                errorMessage={isTouched ? error?.message : undefined}
                label={'Confirm password'}
                accessoryEnd={<RequiredView />}
              >
                <HidableTextInput
                  //   accessibilityLabelHide={content.accessibilityHidePassword}
                  //   accessibilityLabelShow={content.accessibilityShowPassword}
                  //   placeholder={content.reEnterPasswordPlaceholder}
                  autoComplete={'password-new'}
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  //   testID={`${testIdPrefix}.confirmPassword`}
                  textContentType="none"
                  value={value}
                />
              </Field>
            )}
          />
        </View>
      </ScrollView>
    </>
  );
};
