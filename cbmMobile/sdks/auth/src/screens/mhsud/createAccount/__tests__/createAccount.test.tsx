import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../../__mocks__/authMockContextWrapper';
import { CreateAccountMhsud } from '../createAccount';
import { useCreateAccount } from '../useCreateAccount';

jest.mock('../useCreateAccount', () => ({
  useCreateAccount: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockOnChange = jest.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn().mockReturnValue({
    control: {},
    handleSubmit: jest.fn(),
    formState: {
      errors: {
        firstName: { message: 'First name is required' },
      },
    },
  }),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Controller: jest.fn(({ render: renderFn }) =>
    renderFn({
      field: { onChange: mockOnChange, onBlur: jest.fn(), value: '' },
      fieldState: { isTouched: true, error: { message: 'First name is required' } },
    })
  ),
}));

describe('CreateAccountMhsud Component', () => {
  const mockUseCreateAccount = {
    handleContinueButton: jest.fn(),
    control: {},
    formState: { isValid: false },
    dateOfBirthMaxDate: new Date(),
    isChecked: false,
    handleCheckboxChange: jest.fn(),
    onCloseVerifyEmailPopup: jest.fn(),
    onPressResendVerification: jest.fn(),
    isVerifyEmailPopupVisible: false,
    isResendVerificationPopupVisible: false,
    isLoading: false,
    onCloseError: jest.fn(),
    isError: false,
  };

  beforeEach(() => {
    (useCreateAccount as jest.Mock).mockReturnValue(mockUseCreateAccount);
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <AuthMockContextWrapper>
        <CreateAccountMhsud />
      </AuthMockContextWrapper>
    );
    expect(getByText('mhsud.createAccount.title')).toBeTruthy();
  });

  it('should call handleContinueButton when continue button is pressed', () => {
    (useCreateAccount as jest.Mock).mockReturnValue({
      ...mockUseCreateAccount,
      formState: { isValid: true },
      isChecked: true,
    });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <CreateAccountMhsud />
      </AuthMockContextWrapper>
    );
    const continueButton = getByText('mhsud.login.continue');
    fireEvent.press(continueButton);
    expect(mockUseCreateAccount.handleContinueButton).toHaveBeenCalled();
  });

  it('should call handleCheckboxChange when the checkbox is pressed', () => {
    const { getByLabelText } = render(
      <AuthMockContextWrapper>
        <CreateAccountMhsud />
      </AuthMockContextWrapper>
    );
    const checkbox = getByLabelText('mhsud.createAccount.accept');
    fireEvent.press(checkbox);
    expect(mockUseCreateAccount.handleCheckboxChange).toHaveBeenCalled();
  });

  it('should render the verify email popup when isVerifyEmailPopupVisible is true', () => {
    (useCreateAccount as jest.Mock).mockReturnValue({
      ...mockUseCreateAccount,
      isVerifyEmailPopupVisible: true,
    });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <CreateAccountMhsud />
      </AuthMockContextWrapper>
    );
    expect(getByText('mhsud.createAccount.verifyEmailAddress')).toBeTruthy();
  });

  it('should render the error popup when isError is true', () => {
    (useCreateAccount as jest.Mock).mockReturnValue({
      ...mockUseCreateAccount,
      isError: true,
    });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <CreateAccountMhsud />
      </AuthMockContextWrapper>
    );
    expect(getByText('mhsud.createAccount.error.somethingWentWrong')).toBeTruthy();
  });

  it('should render the resend verification popup when isResendVerificationPopupVisible is true', () => {
    (useCreateAccount as jest.Mock).mockReturnValue({
      ...mockUseCreateAccount,
      isResendVerificationPopupVisible: true,
    });
    const { getByText } = render(
      <AuthMockContextWrapper>
        <CreateAccountMhsud />
      </AuthMockContextWrapper>
    );
    expect(getByText('mhsud.createAccount.emailResent')).toBeTruthy();
  });
});
