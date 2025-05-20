import { render } from '@testing-library/react-native';
import React from 'react';

import { HoursView } from '../hoursView';

describe('HoursView', () => {
  it('renders correctly with given work hours', () => {
    const mockWorkHoursArray = [{ day: 'Monday', hours: ['9:00 AM - 5:00 PM'] }];

    const { getByText, debug } = render(<HoursView workHoursArray={mockWorkHoursArray} />);
    debug();

    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('9:00 AM - 5:00 PM')).toBeTruthy();
  });
});
