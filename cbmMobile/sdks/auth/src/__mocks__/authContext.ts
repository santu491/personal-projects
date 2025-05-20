import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { UserContextType } from '../context/auth.sdkContext';

export function getMockAuthContext(): Readonly<UserContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
    forgotSecretCookie: '',
    mfaData: undefined,
    setForgotSecretCookie: jest.fn(),
    setMfaData: jest.fn(),
    setUserProfileData: jest.fn(),
    setUserSignUpData: jest.fn(),
    userProfileData: undefined,
    userSignUpData: undefined,
    mhsudUserSignUpData: undefined,
    setMhsudUserSignUpData: jest.fn(),
  };
}
