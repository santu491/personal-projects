import React from 'react';

import { AuthSDK } from '../../sdks/auth/src/auth.sdk';

export const AuthContext = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  return <AuthSDK children={children} />;
};
