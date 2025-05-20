import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CardType } from '../../../config/constants/home';
import { CardsData } from '../../../model/home';
import { HomeCard } from '../homeCard';

const mockNavigateToDetails = jest.fn();

const mockItem: CardsData = {
  title: 'Test Title',
  localImage: true,
  image: 'https://example.com/test-image.png',
  criticalEvent: true,
  description: 'Test Description',
  buttonText: 'Test Button Text',
};

describe('HomeCard', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<HomeCard item={mockItem} navigateToDetails={mockNavigateToDetails} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should test navigate to details', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: true,
      image: 'https://example.com/test-image.png',
      description: 'Test Description',
      buttonText: 'Test Button Text',
    };

    const { getByText } = render(
      <HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} showHorizontalLine={false} />
    );
    fireEvent.press(getByText('Test Title'));
    expect(mockNavigateToDetails).toHaveBeenCalledTimes(1);
  });

  it('should test  CardType.FEATURED_ITEMS', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: true,
      image: 'https://example.com/test-image.png',
      description: 'Test Description',
      buttonText: 'Test Button Text',
      type: CardType.FEATURED_ITEMS,
    };

    const { getByText } = render(<HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders loading indicator when image is loading', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: true,
      image: 'https://example.com/test-image.png',
      description: 'Test Description',
      buttonText: 'Test Button Text',
    };

    const { getByTestId } = render(<HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} />);

    expect(getByTestId('home.card.activityIndicator')).toBeTruthy();
  });

  it('renders tags when provided', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: true,
      image: 'https://example.com/test-image.png',
      description: 'Test Description',
      buttonText: 'Test Button Text',
      tags: ['Tag1', 'Tag2'],
    };

    const { getByText } = render(<HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} />);

    expect(getByText('Tag1')).toBeTruthy();
    expect(getByText('Tag2')).toBeTruthy();
  });

  it('does not render horizontal line when showHorizontalLine is false', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: true,
      image: 'https://example.com/test-image.png',
      description: 'Test Description',
      buttonText: 'Test Button Text',
      tags: ['Tag1', 'Tag2'],
    };

    const { queryByTestId } = render(
      <HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} showHorizontalLine={false} />
    );

    expect(queryByTestId('home.horizontalLine')).toBeNull();
  });

  it('renders icon when provided', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: false,
      icon: 'https://example.com/test-icon.png',
      description: 'Test Description',
      buttonText: 'Test Button Text',
    };

    const { getByTestId } = render(<HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} />);

    expect(getByTestId('home.homecard.icon')).toBeTruthy();
  });

  it('does not render image or icon when neither is provided', () => {
    const updateMockItem: CardsData = {
      title: 'Test Title',
      localImage: false,
      description: 'Test Description',
      buttonText: 'Test Button Text',
    };

    const { queryByTestId } = render(<HomeCard item={updateMockItem} navigateToDetails={mockNavigateToDetails} />);

    expect(queryByTestId('home.homecard.backgroundImage')).toBeNull();
    expect(queryByTestId('home.homecard.icon')).toBeNull();
  });
});
