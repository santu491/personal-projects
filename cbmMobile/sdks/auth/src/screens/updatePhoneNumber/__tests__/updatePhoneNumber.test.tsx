import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AuthMockContextWrapper } from '../../../__mocks__/authMockContextWrapper';
import { UpdatePhoneNumber } from '../updatePhoneNumber';

jest.mock('../../../../../../src/util/commonUtils');

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Controller: jest.fn(),
}));

describe('UpdatePhoneNumber', () => {
  const mockControl = {};
  const mockTrigger = jest.fn();
  const mockGetValues = jest.fn();
  const mockFormState = { errors: { phoneNumber: { message: 'Error message' } } };
  // const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      control: mockControl,
      trigger: mockTrigger,
      getValues: mockGetValues,
      formState: mockFormState,
    });
    // (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  const updatePhoneWrapper = (
    <AuthMockContextWrapper>
      <UpdatePhoneNumber />
    </AuthMockContextWrapper>
  );

  it('renders without crashing', () => {
    render(updatePhoneWrapper);
  });

  it('calls handleContinueButton when continue button is pressed', () => {
    const { getByTestId } = render(updatePhoneWrapper);
    const continueButton = getByTestId('authentication.button.continue');
    const handleContinueButtonMock = jest.fn();
    continueButton.props.onPress = handleContinueButtonMock;
    fireEvent.press(continueButton);
  });

  it('calls handlePreviousButton when previous button is pressed', () => {
    const { getByTestId } = render(updatePhoneWrapper);
    const previousButton = getByTestId('authentication.button.previous');
    const handlePreviousButtonMock = jest.fn();
    previousButton.props.onPress = handlePreviousButtonMock;
    fireEvent.press(previousButton);
  });
});
