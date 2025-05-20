import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ClientConfirmation } from '../clientConfirmation/clientConfirmation';

describe('ClientConfirmation', () => {
  const mockOnPressContinueButton = jest.fn();
  const mockOnPressPreviousButton = jest.fn();

  const defaultProps = {
    onPressContinueButton: mockOnPressContinueButton,
    onPressPreviousButton: mockOnPressPreviousButton,
    clientName: 'Test Client',
    imagePath: 'test-image-path',
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<ClientConfirmation {...defaultProps} />);
    const clientConfirmationModel = getByTestId('client.bottomsheet.model');
    expect(clientConfirmationModel).toBeTruthy();
  });

  it('calls onPressContinueButton when continue button is pressed', () => {
    const { getByTestId } = render(<ClientConfirmation {...defaultProps} />);
    const continueButton = getByTestId('client.bottomsheet.continue');
    fireEvent.press(continueButton);
    expect(mockOnPressContinueButton).toHaveBeenCalled();
  });

  it('calls onPressPreviousButton when previous button is pressed', () => {
    const { getByTestId } = render(<ClientConfirmation {...defaultProps} />);
    const previousButton = getByTestId('client.bottomsheet.previous');
    fireEvent.press(previousButton);
    expect(mockOnPressPreviousButton).toHaveBeenCalled();
  });
});
