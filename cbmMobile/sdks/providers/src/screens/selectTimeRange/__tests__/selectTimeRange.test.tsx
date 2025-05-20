import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SelectTimeRange } from '../selectTimeRange';
import { useSelectTimeRange } from '../useSelectTimeRange';

jest.mock('../useSelectTimeRange', () => ({
  useSelectTimeRange: jest.fn(),
}));

describe('SelectTimeRange', () => {
  const mockUseSelectTimeRange = useSelectTimeRange as jest.Mock;

  beforeEach(() => {
    mockUseSelectTimeRange.mockReturnValue({
      timeRange: [
        { label: 'Morning', value: 'morning' },
        { label: 'Afternoon', value: 'afternoon' },
      ],
      onChangeTimeRange: jest.fn(),
      onPressContinue: jest.fn(),
      selectedTimeRange: null,
      onPressCloseIcon: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<SelectTimeRange />);
    expect(getByText('appointment.selectTimeRange.title')).toBeTruthy();
    expect(getByText('appointment.selectTimeRange.description')).toBeTruthy();
  });

  it('disables continue button when no time range is selected', () => {
    const { getByText } = render(<SelectTimeRange />);
    expect(getByText('appointment.continue')).toBeDisabled();
  });

  it('enables continue button when a time range is selected', () => {
    mockUseSelectTimeRange.mockReturnValueOnce({
      ...mockUseSelectTimeRange(),
      selectedTimeRange: 'morning',
    });
    const { getByText } = render(<SelectTimeRange />);
    expect(getByText('appointment.continue')).not.toBeDisabled();
  });

  it('calls onPressContinue when continue button is clicked', () => {
    const onPressContinue = jest.fn();
    mockUseSelectTimeRange.mockReturnValueOnce({
      ...mockUseSelectTimeRange(),
      selectedTimeRange: 'morning',
      onPressContinue,
    });
    const { getByText } = render(<SelectTimeRange />);
    fireEvent.press(getByText('appointment.continue'));
    expect(onPressContinue).toHaveBeenCalled();
  });
});
