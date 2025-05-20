import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { ClinicalQuestionnaire } from '../clinicalQuestionnaire';
import { useClinicalQuestionnaire } from '../useClinicalQuestionnaire';

jest.mock('../useClinicalQuestionnaire');

describe('ClinicalQuestionnaire', () => {
  const mockUseClinicalQuestionnaire = useClinicalQuestionnaire as jest.Mock;

  beforeEach(() => {
    mockUseClinicalQuestionnaire.mockReturnValue({
      isLoading: false,
      control: {},
      formState: { isValid: true },
      problemInfo: [{ label: 'Problem 1', value: 'problem1' }],
      daysOption: [{ label: '1 day', value: '1' }],
      onPressContinue: jest.fn(),
      watch: jest.fn().mockReturnValue({}),
      onChangeValue: jest.fn(),
      onPressCloseIcon: jest.fn(),
      appointmentFlowStatus: false,
      showError: false,
      handleTryAgain: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<ClinicalQuestionnaire />);
    expect(getByText('appointment.clinicalQuestionnaire.title')).toBeTruthy();
    expect(getByText('appointment.clinicalQuestionnaire.description')).toBeTruthy();
  });

  it('calls onPressContinue when continue button is pressed', () => {
    const { getByText } = render(<ClinicalQuestionnaire />);
    const continueButton = getByText('appointment.continue');
    fireEvent.press(continueButton);
    expect(mockUseClinicalQuestionnaire().onPressContinue).toHaveBeenCalled();
  });

  it('displays error alert when showError is true', () => {
    mockUseClinicalQuestionnaire.mockReturnValueOnce({
      ...mockUseClinicalQuestionnaire(),
      showError: true,
    });
    const { getByText } = render(<ClinicalQuestionnaire />);
    expect(getByText('appointments.errors.title')).toBeTruthy();
  });

  it('calls handleTryAgain when try again button is pressed in error alert', async () => {
    mockUseClinicalQuestionnaire.mockReturnValueOnce({
      ...mockUseClinicalQuestionnaire(),
      showError: true,
    });
    const { getByText } = render(<ClinicalQuestionnaire />);
    const tryAgainButton = getByText('appointments.errors.tryAgainButton');
    fireEvent.press(tryAgainButton);
    await waitFor(() => {
      expect(mockUseClinicalQuestionnaire().handleTryAgain).toHaveBeenCalled();
    });
  });
});
