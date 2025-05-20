import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { PhoneNumberLink } from '../phoneNumberLink';

describe('PhoneNumberLink', () => {
  const mockPhoneNumberTapped = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the text correctly', () => {
    const { getByText } = render(
      <PhoneNumberLink text="Call 888-888-8888 for support." phoneNumberTapped={mockPhoneNumberTapped} />
    );
    expect(getByText('Call 888-888-8888 for support.')).toBeTruthy();
  });

  it('renders the phone number as a link', () => {
    const { getByText } = render(
      <PhoneNumberLink text="Call 888-888-8888 for support." phoneNumberTapped={mockPhoneNumberTapped} />
    );
    const phoneNumberLink = getByText('888-888-8888');
    expect(phoneNumberLink).toBeTruthy();
  });

  it('calls phoneNumberTapped when the phone number link is pressed', () => {
    const { getByText } = render(
      <PhoneNumberLink text="Call 888-888-8888 for support." phoneNumberTapped={mockPhoneNumberTapped} />
    );
    const phoneNumberLink = getByText('888-888-8888');
    fireEvent.press(phoneNumberLink);
    expect(mockPhoneNumberTapped).toHaveBeenCalled();
  });

  it('renders multiple phone numbers as links', () => {
    const { getByText } = render(
      <PhoneNumberLink text="Call 888-888-8888 or 8888888888 for support." phoneNumberTapped={mockPhoneNumberTapped} />
    );
    const phoneNumberLink1 = getByText('888-888-8888');
    const phoneNumberLink2 = getByText('8888888888');
    expect(phoneNumberLink1).toBeTruthy();
    expect(phoneNumberLink2).toBeTruthy();
  });

  it('calls phoneNumberTapped with the correct phone number when multiple links are pressed', () => {
    const { getByText } = render(
      <PhoneNumberLink text="Call 888-888-8888 or 8888888888 for support." phoneNumberTapped={mockPhoneNumberTapped} />
    );
    const phoneNumberLink1 = getByText('888-888-8888');
    const phoneNumberLink2 = getByText('8888888888');
    fireEvent.press(phoneNumberLink1);
    fireEvent.press(phoneNumberLink2);
    expect(mockPhoneNumberTapped).toHaveBeenCalledTimes(2);
  });
});
