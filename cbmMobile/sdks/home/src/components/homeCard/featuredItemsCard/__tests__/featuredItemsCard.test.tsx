import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { mockFeaturedItems } from '../../../../__mocks__/homeContent';
import { FeaturedItemsCard } from '../featuredItemsCard';

describe('FeaturedItemsCard', () => {
  const mockNavigateToDetails = jest.fn();
  const data = mockFeaturedItems.data[0];

  it('renders the title and description', () => {
    const { getByText } = render(<FeaturedItemsCard item={data} navigateToDetails={mockNavigateToDetails} />);

    expect(getByText(data.title)).toBeTruthy();
  });

  it('calls navigateToDetails when the button is pressed', () => {
    const { getByText } = render(<FeaturedItemsCard item={data} navigateToDetails={mockNavigateToDetails} />);

    fireEvent.press(getByText(data.title));
    expect(mockNavigateToDetails).toHaveBeenCalledWith(data);
  });
});
