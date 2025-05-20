import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { LoginScreen } from '../login';

describe('Login Screen', () => {
  it('Display Login', async () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <LoginScreen />
      </AuthMockContextWrapper>
    );
    expect(await getByTestId('auth.login.title')).toBeTruthy();
  });

  it('navigates to SignUp screen', () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <LoginScreen />
      </AuthMockContextWrapper>
    );
    const createLink = getByTestId('auth.login.redirect.signUp');
    expect(createLink).toBeTruthy();
    fireEvent.press(createLink);
  });

  it('navigates to forgot Password screen', () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <LoginScreen />
      </AuthMockContextWrapper>
    );
    const createLink = getByTestId('auth.login.forgot.password');
    expect(createLink).toBeTruthy();
    fireEvent.press(createLink);
  });

  it('navigates to Forgot username screen', () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <LoginScreen />
      </AuthMockContextWrapper>
    );
    const createLink = getByTestId('auth.login.forgot.username');
    expect(createLink).toBeTruthy();
    fireEvent.press(createLink);
  });
});
