import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { FlowName } from '../../../config/constants/auth';
import { useUserContext } from '../../../context/auth.sdkContext';
import { useVerifyPersonalDetails } from '../useVerifyPersonalDetails';
import { VerifyPersonalDetails } from '../verifyPersonalDetails';

const response = {
  status: 201,
  data: {
    isSuccess: true,
    message: 'User exceeded the validation limit. Sorry account will be blocked!!',
  },
};

jest.mock('../useVerifyPersonalDetails');

jest.mock('../../../../../../src/util/commonUtils', () => ({
  tokenIntegration: () => Promise.resolve('token'),
  isIOS: () => true,
  isAndroid: () => true,
  dimensionCheck: () => true,
  convertApiResponse: () => Promise.resolve(response),
}));
jest.mock('../../../context/auth.sdkContext');

describe('verifyPersonalDetails Screen', () => {
  const mockUseVerifyPersonalDetails = useVerifyPersonalDetails as jest.Mock;
  const verifyPersonalDetails = {
    isShownErrorAlert: true,
    apiError: 'Some error occurred',
    flowName: FlowName.FORGOT_SECRET,
    formState: { isValid: true },
    updateApiError: jest.fn(),
    handleContinueButton: jest.fn(),
  };
  mockUseVerifyPersonalDetails.mockReturnValue(verifyPersonalDetails);

  const personalDetailsWrapper = (
    <AuthMockContextWrapper>
      <VerifyPersonalDetails />
    </AuthMockContextWrapper>
  );

  beforeEach(() => {
    global.fetch = jest.fn();
    (useUserContext as jest.Mock).mockReturnValue({
      navigation: { navigate: jest.fn() },
    });
  });

  it('should display the verify Personal details title', async () => {
    const { getByTestId } = render(personalDetailsWrapper);
    expect(getByTestId('auth.verifyPersonalDetails.title')).toBeTruthy();
  });

  it('should render first name input field', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    expect(getByPlaceholderText('signUp.firstNamePlaceholder')).toBeTruthy();
  });

  it('should render last name input field', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    expect(getByPlaceholderText('signUp.lastNamePlaceholder')).toBeTruthy();
  });

  it('should render date of birth picker', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    expect(getByPlaceholderText('signUp.dateOfBirthPlaceholder')).toBeTruthy();
  });

  it('should render email input field', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    expect(getByPlaceholderText('accountSetUp.emailPlaceholder')).toBeTruthy();
  });

  it('should render continue button and be disabled initially', async () => {
    const { getByText } = render(personalDetailsWrapper);
    const continueButton = getByText('authentication.continue');
    expect(continueButton).toBeTruthy();
  });

  it('should show error alert when isShownErrorAlert is true', async () => {
    (useUserContext as jest.Mock).mockReturnValue({
      navigation: { navigate: jest.fn() },
      isShownErrorAlert: true,
      apiError: 'Some error occurred',
      flowName: FlowName.FORGOT_SECRET,
    });
    const { getByText } = render(personalDetailsWrapper);
    expect(getByText('Some error occurred')).toBeTruthy();
  });

  it('should render the progress header with correct steps', async () => {
    mockUseVerifyPersonalDetails.mockReturnValue({
      ...verifyPersonalDetails,
      loading: true,
    });
    const { getByTestId } = render(personalDetailsWrapper);
    expect(getByTestId('progress-modal')).toBeTruthy();
  });

  it('should call handleContinueButton when continue button is pressed', async () => {
    const { getByText } = render(personalDetailsWrapper);
    const continueButton = getByText('authentication.continue');
    fireEvent.press(continueButton);
    expect(mockUseVerifyPersonalDetails().handleContinueButton).toHaveBeenCalled();
  });

  it('should update apiError when first name input changes', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const firstNameInput = getByPlaceholderText('signUp.firstNamePlaceholder');
    fireEvent.changeText(firstNameInput, 'John');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should update apiError when last name input changes', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const lastNameInput = getByPlaceholderText('signUp.lastNamePlaceholder');
    fireEvent.changeText(lastNameInput, 'Doe');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should update apiError when date of birth changes', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const dateOfBirthPicker = getByPlaceholderText('signUp.dateOfBirthPlaceholder');
    fireEvent.changeText(dateOfBirthPicker, '2000-01-01');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should update apiError when email input changes', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const emailInput = getByPlaceholderText('accountSetUp.emailPlaceholder');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should call onPressErrorAlert when error alert primary button is pressed', async () => {
    mockUseVerifyPersonalDetails.mockReturnValue({
      ...verifyPersonalDetails,
      isShownErrorAlert: true,
      onPressErrorAlert: jest.fn(),
    });
    const { getByText } = render(personalDetailsWrapper);
    const tryAgainButton = getByText('authErrors.tryAgainButton');
    fireEvent.press(tryAgainButton);
    expect(mockUseVerifyPersonalDetails().onPressErrorAlert).toHaveBeenCalled();
  });

  it('should call updateApiError when first name input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const firstNameInput = getByPlaceholderText('signUp.firstNamePlaceholder');
    fireEvent(firstNameInput, 'blur');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should call updateApiError when last name input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const lastNameInput = getByPlaceholderText('signUp.lastNamePlaceholder');
    fireEvent(lastNameInput, 'blur');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should call updateApiError when email input loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const emailInput = getByPlaceholderText('accountSetUp.emailPlaceholder');
    fireEvent(emailInput, 'blur');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });

  it('should call updateApiError when date of birth picker loses focus', async () => {
    const { getByPlaceholderText } = render(personalDetailsWrapper);
    const dateOfBirthPicker = getByPlaceholderText('signUp.dateOfBirthPlaceholder');
    fireEvent(dateOfBirthPicker, 'blur');
    expect(mockUseVerifyPersonalDetails().updateApiError).toHaveBeenCalled();
  });
});
