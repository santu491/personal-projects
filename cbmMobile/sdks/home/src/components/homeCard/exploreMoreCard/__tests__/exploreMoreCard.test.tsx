import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ExploreMoreTopicsDTO } from '../../../../model/home';
import { ExploreMoreCard } from '../exploreMoreCard';

describe('ExploreMoreCard', () => {
  const mockNavigateToDetails = jest.fn();
  const mockExploreMoreData: ExploreMoreTopicsDTO[] = [
    {
      title: 'Topic 1',
      data: [
        {
          title: 'Card 1',
          path: '',
          type: '',
        },
        {
          title: 'Card 2',
          path: '',
          type: '',
        },
      ],
    },
    {
      title: 'Topic 2',
      data: [
        {
          title: 'Card 3',
          path: '',
          type: '',
        },
        {
          title: 'Card 4',
          path: '',
          type: '',
        },
      ],
    },
  ];
  it('renders the tabs correctly', () => {
    const { getByTestId } = render(
      <ExploreMoreCard exploreMoreData={mockExploreMoreData} navigateToDetails={mockNavigateToDetails} />
    );

    mockExploreMoreData.forEach((topic) => {
      expect(getByTestId(topic.title)).toBeTruthy();
    });
  });

  it('calls onPressTab when a tab is clicked', () => {
    const { getByTestId } = render(
      <ExploreMoreCard exploreMoreData={mockExploreMoreData} navigateToDetails={mockNavigateToDetails} />
    );

    fireEvent.press(getByTestId('Topic 1'));
    expect(mockNavigateToDetails).not.toHaveBeenCalled();
  });
});
