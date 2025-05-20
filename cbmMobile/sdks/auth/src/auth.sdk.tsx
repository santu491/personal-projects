import React, { useMemo, useState } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { UserContext, UserContextType } from './context/auth.sdkContext';
import { MfaData } from './models/mfa';
import { MhsudSignUpData, SignUpData } from './models/signUp';

export const AuthSDK = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSignUpData, setUserSignUpData] = useState<SignUpData | undefined>();
  const [mfaData, setMfaData] = useState<MfaData | undefined>();
  const [forgotSecretCookie, setForgotSecretCookie] = useState<string | undefined>();
  const [mhsudUserSignUpData, setMhsudUserSignUpData] = useState<MhsudSignUpData | undefined>();

  const appContext = useAppContext();

  const context: UserContextType = useMemo(() => {
    return {
      isLoggedIn,
      setIsLoggedIn,
      userSignUpData,
      setUserSignUpData,
      mfaData,
      setMfaData,
      forgotSecretCookie,
      setForgotSecretCookie,
      mhsudUserSignUpData,
      setMhsudUserSignUpData,
      ...appContext,
    };
  }, [isLoggedIn, userSignUpData, mfaData, forgotSecretCookie, mhsudUserSignUpData, appContext]);

  return (
    <>
      <UserContext.Provider value={context}>{children}</UserContext.Provider>
    </>
  );
};
