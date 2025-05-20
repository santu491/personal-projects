import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SelectDays } from '../selectDays';
import { useSelectedDays } from '../useSelectedDays';

// Mock the useSelectedDays hook
jest.mock('../useSelectedDays', () => ({
  useSelectedDays: jest.fn(),
}));

describe('SelectDays', () => {
  const mockUseSelectedDays = useSelectedDays as jest.Mock;

  beforeEach(() => {
    mockUseSelectedDays.mockReturnValue({
      daysInfo: [
        { value: 'monday', day: 'Monday', isSelected: false },
        { value: 'tuesday', day: 'Tuesday', isSelected: true },
      ],
      isContinueButtonEnabled: true,
      onPressContinue: jest.fn(),
      onPressCloseIcon: jest.fn(),
      onPressDay: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<SelectDays />);
    expect(getByText('appointment.selectedDays.title')).toBeTruthy();
    expect(getByText('appointment.selectedDays.description')).toBeTruthy();
  });

  it('renders AppointmentHeader with correct title and description', () => {
    const { getByText } = render(<SelectDays />);
    expect(getByText('appointment.selectedDays.title')).toBeTruthy();
    expect(getByText('appointment.selectedDays.description')).toBeTruthy();
  });

  it('renders days correctly', () => {
    const { getByText } = render(<SelectDays />);
    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('Tuesday')).toBeTruthy();
  });

  it('calls onPress handlers correctly', () => {
    const { getByText } = render(<SelectDays />);
    const continueButton = getByText('appointment.continue');
    const mondayButton = getByText('Monday');

    fireEvent.press(continueButton);
    fireEvent.press(mondayButton);

    expect(mockUseSelectedDays().onPressContinue).toHaveBeenCalled();
    expect(mockUseSelectedDays().onPressDay).toHaveBeenCalledWith('monday');
  });
});
