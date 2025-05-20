import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { useUserContext } from '../../../context/auth.sdkContext';
import { PersonalDetails } from '../personalDetails';
import { usePersonalDetails } from '../usePersonalDetails';

const response = {
  status: 201,
  data: {
    isSuccess: true,
    message: 'User exceeded the validation limit. Sorry account will be blocked!!',
  },
};
jest.mock('../usePersonalDetails');
const mockUsePersonalDetails = usePersonalDetails as jest.Mock;

jest.mock('../../../../../../src/util/commonUtils', () => ({
  tokenIntegration: () => Promise.resolve('token'),
  isIOS: () => true,
  isAndroid: () => true,
  dimensionCheck: () => true,
  convertApiResponse: () => Promise.resolve(response),
}));
jest.mock('../../../context/auth.sdkContext');

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

describe('PersonalDetails Screen', () => {
  const personalDetailsWrapper = (
    <AuthMockContextWrapper>
      <PersonalDetails />
    </AuthMockContextWrapper>
  );

  const mockNavigateToSignUpScreen = jest.fn();

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      navigation: { navigate: jest.fn() },
    });
    mockUsePersonalDetails.mockReturnValue({
      navigateToSignUpScreen: mockNavigateToSignUpScreen,
      handleContinueButton: jest.fn(),
      control: {},
      formState: { isValid: true },
      dateOfBirthMaxDate: '12/12/2024',
    });
    jest.clearAllMocks();
  });

  it('should display the sign-up title', async () => {
    const { queryByText } = render(personalDetailsWrapper);
    expect(queryByText('signUp.title')).toBeTruthy();
  });

  it('should navigate to sign-in screen when link is pressed', async () => {
    const { getByText } = render(personalDetailsWrapper);
    const signInLink = getByText('login.title');
    fireEvent.press(signInLink);
    expect(mockNavigateToSignUpScreen).toHaveBeenCalled();
  });

  it('should call onChange when first name input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const firstNameInput = getByPlaceholderText('signUp.firstNamePlaceholder');
    fireEvent(firstNameInput, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when last name input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const lastNameInput = getByPlaceholderText('signUp.lastNamePlaceholder');
    fireEvent(lastNameInput, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when address input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const address = getByPlaceholderText('signUp.addressLineOnePlaceholder');
    fireEvent(address, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when address two input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const addressTwo = getByPlaceholderText('signUp.addressLineTwoPlaceholder');
    fireEvent(addressTwo, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when city input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const addressTwo = getByPlaceholderText('signUp.cityPlaceholder');
    fireEvent(addressTwo, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when zip input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const zip = getByPlaceholderText('signUp.zipcodePlaceholder');
    fireEvent(zip, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });
});
