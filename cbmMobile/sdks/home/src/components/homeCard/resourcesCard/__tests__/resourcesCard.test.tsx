import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ResourcesCard } from '../resourcesCard';

describe('ResourcesCard', () => {
  const mockNavigateToDetails = jest.fn();
  const mockItem = {
    title: 'Test Title',
    description: 'Test Description',
    image: 'https://example.com/image.png',
    icon: 'https://example.com/icon.png',
  };
  const mockProps = {
    item: mockItem,
    navigateToDetails: mockNavigateToDetails,
    cardStyle: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title and description when provided', () => {
    const { getByText } = render(<ResourcesCard {...mockProps} />);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('should render the image when item.image is provided', () => {
    const { getByTestId } = render(<ResourcesCard {...mockProps} />);
    expect(getByTestId('home.resource.image')).toBeTruthy();
  });

  it('should render the icon when item.image is not provided', () => {
    const propsWithoutImage = {
      ...mockProps,
      item: { ...mockItem, image: undefined },
    };
    const { getByTestId } = render(<ResourcesCard {...propsWithoutImage} />);
    expect(getByTestId('home.resource.icon')).toBeTruthy();
  });

  it('should call navigateToDetails with the correct item when pressed', () => {
    const { getByTestId } = render(<ResourcesCard {...mockProps} />);
    fireEvent.press(getByTestId('home.resource.card'));
    expect(mockNavigateToDetails).toHaveBeenCalledWith(mockItem);
  });

  it('should not render title or description if not provided', () => {
    const propsWithoutTitleAndDescription = {
      ...mockProps,
      item: { ...mockItem, title: undefined, description: undefined },
    };
    const { queryByText } = render(<ResourcesCard {...propsWithoutTitleAndDescription} />);
    expect(queryByText('Test Title')).toBeNull();
    expect(queryByText('Test Description')).toBeNull();
  });
});
