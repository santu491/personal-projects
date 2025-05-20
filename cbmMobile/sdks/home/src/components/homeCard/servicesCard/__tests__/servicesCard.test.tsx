import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ServicesCard } from '../servicesCard';

describe('ServicesCard', () => {
  const mockNavigateToDetails = jest.fn();
  const mockItem = {
    title: 'Test Title',
    description: 'Test Description',
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

  it('should render the title when item.title is provided', () => {
    const { getByText } = render(<ServicesCard {...mockProps} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should not render the title when item.title is not provided', () => {
    const { queryByText } = render(<ServicesCard {...mockProps} item={{ ...mockItem, title: '' }} />);
    expect(queryByText('Test Title')).toBeNull();
  });

  it('should render the description when item.description is provided', () => {
    const { getByText } = render(<ServicesCard {...mockProps} />);
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('should not render the description when item.description is not provided', () => {
    const { queryByText } = render(<ServicesCard {...mockProps} item={{ ...mockItem, description: '' }} />);
    expect(queryByText('Test Description')).toBeNull();
  });

  it('should render the icon when item.icon is provided', () => {
    const { getByTestId } = render(<ServicesCard {...mockProps} />);
    expect(getByTestId('home.servicesCard.image')).toBeTruthy();
  });

  it('should not render the icon when item.icon is not provided', () => {
    const { queryByTestId } = render(<ServicesCard {...mockProps} item={{ ...mockItem, icon: '' }} />);
    expect(queryByTestId('home.servicesCard.image')).toBeNull();
  });

  it('should call navigateToDetails with item when pressed', () => {
    const { getByTestId } = render(<ServicesCard {...mockProps} />);
    fireEvent.press(getByTestId('home.service.card'));
    expect(mockNavigateToDetails).toHaveBeenCalledWith(mockItem);
  });
});
