import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export enum Screen {
  ACCOUNT_RECOVERY = 'ACCOUNT_RECOVERY',
  ACCOUNT_SETUP = 'ACCOUNT_SETUP',
  CONFIRM_STATUS = 'CONFIRM_STATUS',
  CREATE_ACCOUNT_MHSUD = 'CREATE_ACCOUNT_MHSUD',
  CREATE_SECRET_MHSUD = 'CREATE_SECRET_MHSUD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  LOGIN = 'LOGIN',
  LOGIN_MHSUD = 'LOGIN_MHSUD',

  PERSONAL_DETAILS = 'PERSONAL_DETAILS',
  RESET_SECRET = 'RESET_SECRET',
  SELECT_MFA_OPTIONS = 'SELECT_MFA_OPTIONS',
  UPDATE_PHONE_NUMBER = 'UPDATE_PHONE_NUMBER',
  USER_AGREEMENT_MHSUD = 'USER_AGREEMENT',
  VERIFY_PERSONAL_DETAILS = 'VERIFY_PERSONAL_DETAILS',
  VERTIFY_OTP = 'VERTIFY_OTP',
}

export type NavStackParams = {
  [Screen.ACCOUNT_RECOVERY]: undefined;
  [Screen.ACCOUNT_SETUP]: undefined;
  [Screen.CONFIRM_STATUS]: undefined;
  [Screen.CONFIRM_STATUS]: undefined;
  [Screen.DELETE_ACCOUNT]: undefined;
  [Screen.LOGIN]: undefined;
  [Screen.LOGIN_MHSUD]: undefined;
  [Screen.PERSONAL_DETAILS]: undefined;
  [Screen.RESET_SECRET]: undefined;
  [Screen.SELECT_MFA_OPTIONS]: undefined;
  [Screen.UPDATE_PHONE_NUMBER]: undefined;
  [Screen.VERIFY_PERSONAL_DETAILS]: undefined;
  [Screen.VERTIFY_OTP]: {
    channelName?: string;
    otpDescription?: string;
  };
  [Screen.CREATE_ACCOUNT_MHSUD]: undefined;
  [Screen.CREATE_SECRET_MHSUD]: undefined;
};

export type AuthNavigationProp = StackNavigationProp<NavStackParams>;
export type LoginScreenProps = StackScreenProps<NavStackParams, Screen.LOGIN>;
export type LoginMhsudScreenProps = StackScreenProps<NavStackParams, Screen.LOGIN_MHSUD>;
export type PersonalDetailsScreenProps = StackScreenProps<NavStackParams, Screen.PERSONAL_DETAILS>;
export type CreateAccountMhsudScreenProps = StackScreenProps<NavStackParams, Screen.CREATE_ACCOUNT_MHSUD>;

export type AccountSetupScreenProps = StackScreenProps<NavStackParams, Screen.ACCOUNT_SETUP>;
export type ConfirmStatusScreenProps = StackScreenProps<NavStackParams, Screen.CONFIRM_STATUS>;
export type UpdatePhoneNumberScreenProps = StackScreenProps<NavStackParams, Screen.UPDATE_PHONE_NUMBER>;
export type SelectMfaOptionsScreenProps = StackScreenProps<NavStackParams, Screen.SELECT_MFA_OPTIONS>;
export type MfaVerifyOtpScreenProps = StackScreenProps<NavStackParams, Screen.VERTIFY_OTP>;
export type AccountRecoveryScreenProps = StackScreenProps<NavStackParams, Screen.ACCOUNT_RECOVERY>;
export type ResetSecretScreenProps = StackScreenProps<NavStackParams, Screen.RESET_SECRET>;
export type VerifyPersonalDetailsScreenProps = StackScreenProps<NavStackParams, Screen.VERIFY_PERSONAL_DETAILS>;
export type DeleteAccountScreenProps = StackScreenProps<NavStackParams, Screen.DELETE_ACCOUNT>;
export type CreateSecretMhsudScreenProps = StackScreenProps<NavStackParams, Screen.CREATE_SECRET_MHSUD>;
