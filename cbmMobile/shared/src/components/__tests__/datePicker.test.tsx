import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import RNDatePicker from 'react-native-date-picker';

import { DatePicker } from '../datePicker/datePicker';

jest.mock('react-native-date-picker', () => jest.fn());

describe('DatePicker', () => {
  const defaultProps = {
    date: new Date('2023-01-01'),
    editable: true,
    onDateChange: jest.fn(),
    title: 'Select Date',
  };

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<DatePicker {...defaultProps} />);
    expect(getByPlaceholderText('')).toBeTruthy();
  });

  it('shows date picker when text input is focused', () => {
    render(<DatePicker {...defaultProps} />);
    fireEvent(screen.getByPlaceholderText(''), 'focus');
    expect(RNDatePicker).toHaveBeenCalled();
  });

  it('shows date picker when calendar icon is pressed', () => {
    render(<DatePicker {...defaultProps} />);
    fireEvent.press(screen.getByRole('button', { name: 'CalendarIcon' }));
    expect(RNDatePicker).toHaveBeenCalled();
  });

  it('renders with correct initial date', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByDisplayValue('01/01/2023')).toBeTruthy();
  });

  it('displays placeholder text correctly', () => {
    const placeholderText = 'Enter date';
    render(<DatePicker {...defaultProps} placeholderText={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeTruthy();
  });

  it('applies minimum and maximum dates correctly', () => {
    const minimumDate = new Date('2022-01-01');
    const maximumDate = new Date('2024-01-01');
    render(<DatePicker {...defaultProps} minimumDate={minimumDate} maximumDate={maximumDate} />);
    fireEvent.press(screen.getByRole('button', { name: 'CalendarIcon' }));
    expect(RNDatePicker).toHaveBeenCalledWith(
      expect.objectContaining({
        minimumDate,
        maximumDate,
      }),
      expect.anything()
    );
  });
});
