import { Field } from '@sydney/motif-components';
import React from 'react';
import { Controller } from 'react-hook-form';

import { HidableTextInput } from '../../../../../shared/src/components/hidableTextInput/hidableTextInput';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { AccountSetUpFieldNames } from '../../models/signUp';
import { PasswordFieldsProps, usePasswordFields } from './usePasswordFields';

export const PasswordFields = (props: PasswordFieldsProps): JSX.Element => {
  const { passwordError, passwordValidationDropdownItems, onPasswordFocusedChanged } = usePasswordFields(props);
  const { content, control, testIdPrefix, trigger } = props;

  return (
    <>
      <Controller
        control={control}
        name={AccountSetUpFieldNames.SECRET}
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            errorMessage={passwordError}
            label={content.passwordLabel}
            styles={fieldStyles.field}
            accessoryEnd={<RequiredView />}
            validationDropdown={{ inputEmpty: !value, items: passwordValidationDropdownItems }}
          >
            <HidableTextInput
              accessibilityLabelHide={content.accessibilityHidePassword}
              accessibilityLabelShow={content.accessibilityShowPassword}
              autoComplete={'password-new'}
              placeholder={content.passwordPlaceholder}
              autoCorrect={false}
              onBlur={() => {
                onBlur();
                onPasswordFocusedChanged(false);
              }}
              onChangeText={(newText) => {
                onChange(newText);
                trigger();
              }}
              onFocus={() => onPasswordFocusedChanged(true)}
              testID={`${testIdPrefix}.password`}
              textContentType="none"
              value={value}
            />
          </Field>
        )}
      />
      <Controller
        control={control}
        name={AccountSetUpFieldNames.RE_ENTER_SECRET}
        render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
          <Field
            styles={fieldStyles.field}
            errorMessage={isTouched ? error?.message : undefined}
            label={content.reEnterPasswordLabel}
            accessoryEnd={<RequiredView />}
          >
            <HidableTextInput
              accessibilityLabelHide={content.accessibilityHidePassword}
              accessibilityLabelShow={content.accessibilityShowPassword}
              placeholder={content.reEnterPasswordPlaceholder}
              autoComplete={'password-new'}
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              testID={`${testIdPrefix}.confirmPassword`}
              textContentType="none"
              value={value}
            />
          </Field>
        )}
      />
    </>
  );
};
