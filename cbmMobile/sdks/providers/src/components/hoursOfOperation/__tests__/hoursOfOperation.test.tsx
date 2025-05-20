import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { HoursOfOperation } from '../hoursOfOperation';

describe('HoursOfOperation Component', () => {
  const mockWorkHoursArray = [
    { day: 'Monday', hours: ['9:00 AM - 5:00 PM'] },
    { day: 'Tuesday', hours: ['9:00 AM - 5:00 PM'] },
  ];

  it('should render correctly with initial state', () => {
    const { getByTestId } = render(<HoursOfOperation workHoursArray={mockWorkHoursArray} />);
    expect(getByTestId('hours-title')).toBeTruthy();
    expect(getByTestId('hours-arrow')).toBeTruthy();
  });

  it('should toggle hours view when TouchableOpacity is pressed', () => {
    const { getByTestId, queryByTestId } = render(<HoursOfOperation workHoursArray={mockWorkHoursArray} />);
    const touchable = getByTestId('work-hour');
    fireEvent.press(touchable);
    expect(getByTestId('hours-expand-view')).toBeTruthy();
    fireEvent.press(touchable);
    expect(queryByTestId('hours-expand-view')).toBeNull();
  });

  it('should display sorted work hours', () => {
    const { getByTestId } = render(<HoursOfOperation workHoursArray={mockWorkHoursArray} />);
    const touchable = getByTestId('work-hour');
    fireEvent.press(touchable);
    const hoursView = getByTestId('hours-expand-view');
    expect(hoursView).toBeTruthy();
  });

  it('should display "hours not available" message when no work hours are provided', () => {
    const { getByTestId, getByText } = render(<HoursOfOperation workHoursArray={[]} />);
    const touchable = getByTestId('work-hour');
    fireEvent.press(touchable);
    expect(getByText('providers.hoursNotAvailable')).toBeTruthy();
  });
});
