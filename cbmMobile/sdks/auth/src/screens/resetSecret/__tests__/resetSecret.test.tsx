import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { ResetSecretScreen } from '../resetSecret';

describe('ResetSecretScreen', () => {
  const resetSecreteWrapper = (
    <AuthMockContextWrapper>
      <ResetSecretScreen />
    </AuthMockContextWrapper>
  );
  it('renders the component without errors', () => {
    render(resetSecreteWrapper);
    // Add your assertion here
  });

  it('displays the correct title and subtitle', () => {
    const phoneNumber = render(resetSecreteWrapper);
    expect(phoneNumber.getByText('profile.accountSecret.title')).toBeTruthy();
    expect(phoneNumber.getByText('profile.accountSecret.enterNewSecret')).toBeTruthy();
  });

  it('triggers the continue button handler when pressed', () => {
    const { getByTestId } = render(resetSecreteWrapper);
    const continueButton = getByTestId('authentication.button.continue');
    fireEvent.press(continueButton);
    // Add your assertion here
  });

  it('triggers the previous button handler when pressed', () => {
    const { getByTestId } = render(resetSecreteWrapper);
    const previousButton = getByTestId('authentication.button.previous');
    fireEvent.press(previousButton);
    // Add your assertion here
  });
});
