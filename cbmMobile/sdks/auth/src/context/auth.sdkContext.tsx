import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { MfaData } from '../models/mfa';
import { MhsudSignUpData, SignUpData } from '../models/signUp';
import { AuthNavigationProp } from '../navigation/auth.navigationTypes';

export interface UserContextType extends AppContextType {
  forgotSecretCookie: string | undefined;
  mfaData: MfaData | undefined;
  mhsudUserSignUpData: MhsudSignUpData | undefined;
  setForgotSecretCookie: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMfaData: React.Dispatch<React.SetStateAction<MfaData | undefined>>;
  setMhsudUserSignUpData: React.Dispatch<React.SetStateAction<MhsudSignUpData | undefined>>;
  setUserSignUpData: React.Dispatch<React.SetStateAction<SignUpData | undefined>>;
  userSignUpData: SignUpData | undefined;
}

const UserContext = React.createContext<UserContextType | null>(null);

const useUserContextOnly = (): UserContextType => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export function useUserContext(): WithNavigation<AuthNavigationProp, UserContextType> {
  return useWithNavigation<AuthNavigationProp, UserContextType>(useUserContextOnly());
}

export { UserContext };
