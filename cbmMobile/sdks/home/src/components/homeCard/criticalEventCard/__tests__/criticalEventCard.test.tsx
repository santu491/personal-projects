import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { homeCardStyles } from '../../homeCardStyles';
import { CriticalEventCard } from '../criticalEventCard';

describe('CriticalEventCard', () => {
  const mockNavigateToDetails = jest.fn();
  const item = {
    title: 'Critical Event',
    description: 'This is a critical event description',
  };

  it('renders the description', () => {
    const { getByText } = render(<CriticalEventCard item={item} navigateToDetails={mockNavigateToDetails} />);

    expect(getByText(item.description)).toBeTruthy();
  });

  it('calls navigateToDetails when the button is pressed', () => {
    const { getByTestId } = render(<CriticalEventCard item={item} navigateToDetails={mockNavigateToDetails} />);

    fireEvent.press(getByTestId('homeCard.learn.button'));
    expect(mockNavigateToDetails).toHaveBeenCalledWith(item);
  });

  it('applies the correct styles to the learn more button', () => {
    const { getByTestId } = render(<CriticalEventCard item={item} navigateToDetails={mockNavigateToDetails} />);
    const buttonElement = getByTestId('homeCard.learn.button');

    expect(buttonElement.props.style).toEqual({ ...homeCardStyles.learnMoreButton, ...{ opacity: 1 } });
  });
});
