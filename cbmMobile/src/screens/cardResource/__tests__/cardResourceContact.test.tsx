import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CardResourceContact } from '../components/cardResourceContact';

describe('CardResourceContact', () => {
  const contact = {
    image: 'https://example.com/image.png',
    description: 'Contact us at',
    number: '123-456-7890',
  };

  it('renders contact information correctly', () => {
    const { getByText } = render(<CardResourceContact contact={contact} />);

    expect(getByText('123-456-7890')).toBeTruthy();
  });

  it('calls onPressContactNo when the number is pressed', () => {
    const onPressContactNo = jest.fn();
    const { getByText } = render(<CardResourceContact contact={contact} onPressContactNo={onPressContactNo} />);

    fireEvent.press(getByText('123-456-7890'));
    expect(onPressContactNo).toHaveBeenCalledWith('123-456-7890');
  });

  it('does not render anything if contact is undefined', () => {
    const { queryByText } = render(<CardResourceContact contact={undefined} />);

    expect(queryByText('Contact us at')).toBeNull();
    expect(queryByText('123-456-7890')).toBeNull();
  });
});
