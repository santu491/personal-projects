import { render } from '@testing-library/react-native';
import React from 'react';

import { AppointmentHeader } from '../appointmentHeader';

describe('AppointmentHeader', () => {
  it('renders title and description correctly', () => {
    const { getByText } = render(<AppointmentHeader title="Test Title" description="Test Description" />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });
});
