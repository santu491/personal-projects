import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../../__mocks__/authMockContextWrapper';
import { LoginMhsud } from '../login';
import { useLogin } from '../useLogin';

jest.mock('../useLogin', () => ({
  useLogin: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('LoginMhsud Component', () => {
  const mockUseLogin = {
    handleLogin: jest.fn(),
    handleCreateAccount: jest.fn(),
    onChangeText: jest.fn(),
    value: '',
    isCreateAccountDrawerEnabled: false,
    onCloseCreateAccountDrawer: jest.fn(),
    navigateToCreateAccount: jest.fn(),
  };

  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue(mockUseLogin);
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <AuthMockContextWrapper>
        <LoginMhsud />
      </AuthMockContextWrapper>
    );
    expect(getByText('mhsud.login.login')).toBeTruthy();
    expect(getByText('mhsud.login.description')).toBeTruthy();
    expect(getByText('mhsud.login.forgotEmail')).toBeTruthy();
    expect(getByText('mhsud.login.continue')).toBeTruthy();
    expect(getByText('mhsud.login.createAccount')).toBeTruthy();
  });

  it('should call handleLogin when continue button is pressed', () => {
    (useLogin as jest.Mock).mockReturnValue({ ...mockUseLogin, value: 'test' });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <LoginMhsud />
      </AuthMockContextWrapper>
    );
    const continueButton = getByText('mhsud.login.continue');
    fireEvent.press(continueButton);
    expect(mockUseLogin.handleLogin).toHaveBeenCalled();
  });

  it('should call handleCreateAccount when create account link is pressed', () => {
    const { getByText } = render(
      <AuthMockContextWrapper>
        <LoginMhsud />
      </AuthMockContextWrapper>
    );
    const createAccountLink = getByText('mhsud.login.createAccount');
    fireEvent.press(createAccountLink);
    expect(mockUseLogin.handleCreateAccount).toHaveBeenCalled();
  });

  it('should render CreateAccountDrawer when isCreateAccountDrawerEnabled is true', () => {
    (useLogin as jest.Mock).mockReturnValue({ ...mockUseLogin, isCreateAccountDrawerEnabled: true });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <LoginMhsud />
      </AuthMockContextWrapper>
    );
    expect(getByText('mhsud.login.createAccount')).toBeTruthy();
  });
});
