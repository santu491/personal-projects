import { PathConfig } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { styles } from '../../../../shared/src/components/progressBarHeader/progressBarHeader.styles';
import { AppUrl } from '../../../../shared/src/models';
import { AccountRecovery } from '../screens/accountRecovery/accountRecovery';
import { AccountSetUp } from '../screens/accountSetUp/accountSetUp';
import { ConfirmStatus } from '../screens/confirmStatus/confirmStatus';
import { LoginScreen } from '../screens/login/login';
import { MFASecurityCode } from '../screens/mfaSecurityCode/mfaSecurityCode';
import { MFAVerifyOTP } from '../screens/mfaVerifyOtp/mfaVerifyOtp';
import { CreateAccountMhsud } from '../screens/mhsud/createAccount/createAccount';
import { LoginMhsud } from '../screens/mhsud/login/login';
import { PersonalDetails } from '../screens/personalDetails/personalDetails';
import { ResetSecretScreen } from '../screens/resetSecret/resetSecret';
import { UpdatePhoneNumber } from '../screens/updatePhoneNumber/updatePhoneNumber';
import { VerifyPersonalDetails } from '../screens/verifyPersonalDetails/verifyPersonalDetails';
import { NavStackParams, Screen } from './auth.navigationTypes';

const Stack = createStackNavigator<NavStackParams>();

const navConfig = {
  screens: {
    [Screen.LOGIN]: AppUrl.LOGIN,
    [Screen.LOGIN_MHSUD]: AppUrl.LOGIN_MHSUD,
    [Screen.UPDATE_PHONE_NUMBER]: AppUrl.UPDATE_PHONE_NUMBER,
    [Screen.PERSONAL_DETAILS]: AppUrl.PERSONAL_DETAILS,
    [Screen.CREATE_ACCOUNT_MHSUD]: AppUrl.CREATE_ACCOUNT_MHSUD,
  },
};
export const authNavConfig: PathConfig<NavStackParams> = navConfig;

export const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Screen.LOGIN} screenOptions={{ headerStyle: styles.authHeader }}>
      <Stack.Screen component={PersonalDetails} name={Screen.PERSONAL_DETAILS} options={{ headerShown: true }} />
      <Stack.Screen component={CreateAccountMhsud} name={Screen.CREATE_ACCOUNT_MHSUD} options={{ headerShown: true }} />
      <Stack.Screen component={AccountSetUp} name={Screen.ACCOUNT_SETUP} options={{ headerShown: true }} />
      <Stack.Screen component={ConfirmStatus} name={Screen.CONFIRM_STATUS} options={{ headerShown: true }} />
      <Stack.Screen component={LoginScreen} name={Screen.LOGIN} options={{ headerShown: false }} />
      <Stack.Screen component={LoginMhsud} name={Screen.LOGIN_MHSUD} />
      <Stack.Screen component={UpdatePhoneNumber} name={Screen.UPDATE_PHONE_NUMBER} options={{ headerShown: true }} />
      <Stack.Screen component={MFASecurityCode} name={Screen.SELECT_MFA_OPTIONS} options={{ headerShown: true }} />
      <Stack.Screen component={MFAVerifyOTP} name={Screen.VERTIFY_OTP} options={{ headerShown: true }} />
      <Stack.Screen component={AccountRecovery} name={Screen.ACCOUNT_RECOVERY} options={{ headerShown: true }} />
      <Stack.Screen component={ResetSecretScreen} name={Screen.RESET_SECRET} options={{ headerShown: true }} />
      <Stack.Screen
        component={VerifyPersonalDetails}
        name={Screen.VERIFY_PERSONAL_DETAILS}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
