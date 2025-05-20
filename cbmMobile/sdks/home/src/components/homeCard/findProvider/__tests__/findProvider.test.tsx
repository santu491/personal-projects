import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { FindProviderCard } from '../findProvider';

describe('FindProviderCard', () => {
  const mockNavigateToDetails = jest.fn();
  const mockItem = {
    title: 'Test Provider',
    image: 'https://example.com/image.png',
    buttonText: 'Find Provider',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with an image and button', () => {
    const { getByTestId } = render(<FindProviderCard item={mockItem} navigateToDetails={mockNavigateToDetails} />);

    expect(getByTestId('home.provider.image')).toBeTruthy();
    expect(getByTestId('home.find.button')).toBeTruthy();
  });

  it('should call navigateToDetails when the card is pressed', () => {
    const { getByTestId } = render(<FindProviderCard item={mockItem} navigateToDetails={mockNavigateToDetails} />);

    fireEvent.press(getByTestId('home.provider.image'));
    expect(mockNavigateToDetails).toHaveBeenCalledWith(mockItem);
  });

  it('should show the loader while the image is loading', () => {
    const { getByTestId } = render(<FindProviderCard item={mockItem} navigateToDetails={mockNavigateToDetails} />);

    expect(getByTestId('home.provider.activityIndicator')).toBeTruthy();
  });

  it('should hide the loader after the image loads', async () => {
    const { queryByTestId, getByTestId } = render(
      <FindProviderCard item={mockItem} navigateToDetails={mockNavigateToDetails} />
    );

    fireEvent(getByTestId('home.provider.image'), 'onLoadEnd');
    expect(queryByTestId('home.provider.activityIndicator')).toBeNull();
  });

  it('should not render the button if buttonText is not provided', () => {
    const itemWithoutButtonText = { ...mockItem, buttonText: undefined };
    const { queryByTestId } = render(
      <FindProviderCard item={itemWithoutButtonText} navigateToDetails={mockNavigateToDetails} />
    );

    expect(queryByTestId('home.find.button')).toBeNull();
  });
});
