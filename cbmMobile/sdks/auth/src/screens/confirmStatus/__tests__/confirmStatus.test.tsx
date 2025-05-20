import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { ConfirmStatus } from '../confirmStatus';
import { useConfirmStatus } from '../useConfirmStatus';

jest.mock('../useConfirmStatus', () => ({
  useConfirmStatus: jest.fn(),
}));

const mockUseConfirmStatus = useConfirmStatus as jest.Mock;

describe('ConfirmStatus', () => {
  beforeEach(() => {
    mockUseConfirmStatus.mockReturnValue({
      navigateToSignInScreen: jest.fn(),
      handleContinueButton: jest.fn(),
      handlePreviousButton: jest.fn(),
      navigateToPrivacyPolicy: jest.fn(),
      navigateToTermsOfUse: jest.fn(),
      navigateToStatementOfUnderstanding: jest.fn(),
      control: {},
      formState: { isValid: true },
      isSuccess: false,
      onAlertButonPress: jest.fn(),
      loading: false,
      isShownAlert: false,
      apiErrorMessage: '',
    });
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <AuthMockContextWrapper>
        <ConfirmStatus />
      </AuthMockContextWrapper>
    );
    expect(getByTestId('auth.signUp.title')).toBeTruthy();
  });

  it('calls navigateToSignInScreen when sign in link is pressed', () => {
    const { getByText } = render(
      <AuthMockContextWrapper>
        <ConfirmStatus />
      </AuthMockContextWrapper>
    );
    const signInLink = getByText('login.title');
    fireEvent.press(signInLink);
    expect(mockUseConfirmStatus().navigateToSignInScreen).toHaveBeenCalled();
  });

  it('calls handleContinueButton when continue button is pressed', () => {
    const { getByText } = render(
      <AuthMockContextWrapper>
        <ConfirmStatus />
      </AuthMockContextWrapper>
    );
    const continueButton = getByText('authentication.continue');
    fireEvent.press(continueButton);
    expect(mockUseConfirmStatus().handleContinueButton).toHaveBeenCalled();
  });

  it('calls handlePreviousButton when previous button is pressed', () => {
    const { getByText } = render(
      <AuthMockContextWrapper>
        <ConfirmStatus />
      </AuthMockContextWrapper>
    );
    const previousButton = getByText('authentication.previous');
    fireEvent.press(previousButton);
    expect(mockUseConfirmStatus().handlePreviousButton).toHaveBeenCalled();
  });

  it('displays error message when form is invalid', () => {
    mockUseConfirmStatus.mockReturnValueOnce({
      ...mockUseConfirmStatus(),
      formState: { isValid: false },
    });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <ConfirmStatus />
      </AuthMockContextWrapper>
    );
    const continueButton = getByText('authentication.continue');
    fireEvent.press(continueButton);
    expect(mockUseConfirmStatus().handleContinueButton).not.toHaveBeenCalled();
  });

  it('displays alert when isShownAlert is true', () => {
    mockUseConfirmStatus.mockReturnValueOnce({
      ...mockUseConfirmStatus(),
      isShownAlert: true,
      isSuccess: true,
    });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <ConfirmStatus />
      </AuthMockContextWrapper>
    );
    expect(getByText('confirmStatus.accountCreated')).toBeTruthy();
  });
});
