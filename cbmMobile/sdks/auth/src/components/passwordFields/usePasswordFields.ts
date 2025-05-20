import { useMemo, useState } from 'react';
import { Control } from 'react-hook-form';

import { getPasswordValidationItems, PasswordValidationMessages } from '../../utils/passwordValidationSchema';

interface PasswordFieldsContent {
  accessibilityHidePassword: string;
  accessibilityHideReEnterPassword: string;
  accessibilityShowPassword: string;
  accessibilityShowReEnterPassword: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordValidation: PasswordValidationMessages;
  reEnterPasswordLabel: string;
  reEnterPasswordPlaceholder: string;
  requiredLabel: string;
}
export interface PasswordFieldsData {
  reEnterSecret: string;
  secret: string;
}

export interface PasswordFieldsProps {
  content: PasswordFieldsContent;
  control: Control<PasswordFieldsData>;
  password: string;
  passwordErrorMessage: string | undefined;
  testIdPrefix: string;
  trigger: () => void;
  userName: string;
}

export const usePasswordFields = ({ content, password, passwordErrorMessage, userName }: PasswordFieldsProps) => {
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validationItems = useMemo(() => {
    return getPasswordValidationItems(content.passwordValidation, password, userName);
  }, [content, password, userName]);

  const onPasswordFocusedChanged = (isFocused: boolean) => {
    setPasswordTouched(true);
    setPasswordFocused(isFocused);
  };

  const passwordFieldAccessibilityLabel = useMemo(() => {
    return `${content.passwordLabel} ${content.requiredLabel}`;
  }, [content.passwordLabel, content.requiredLabel]);

  const passwordValidationDropdownItems = useMemo(() => {
    return validationItems;
  }, [validationItems]);

  const passwordError = useMemo(() => {
    if (!passwordTouched || passwordFocused) {
      return undefined;
    }
    return passwordErrorMessage;
  }, [passwordTouched, passwordFocused, passwordErrorMessage]);

  return { passwordError, passwordValidationDropdownItems, onPasswordFocusedChanged, passwordFieldAccessibilityLabel };
};
