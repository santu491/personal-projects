import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CardsData } from '../../../../model/home';
import { TopicCard } from '../topicCard';

const mockData: CardsData[] = [
  {
    description:
      'Learn what it means to truly flourish by focusing on Positive Emotions, Engagement, Relationships, Meaning, and Accomplishment.',
    image:
      'https://anthem-uat2.adobecqms.net/content/dam/careloneap/images/desktop/october-2024/Flourishing-for-1193052039.jpg',
    openURLInNewTab: false,
    path: '/content/dam/careloneap/content-fragments/CredibleMind Monthly Resource/October - 2024/Article/flourishing-for-beginners-five-ways-to-get-started',
    redirectUrl: 'crediblemind:articles/flourishing-for-beginners-five-ways-to-get-started',
    tags: ['Article'],
    title: 'Flourishing for beginners: 5 ways to get started',
    type: 'CardModel',
  },
];

describe('TopicCard', () => {
  it('renders correctly with data', () => {
    const handleNavigateToDetails = jest.fn();
    const { getByText } = render(<TopicCard data={mockData} onPressNavigateToDetails={handleNavigateToDetails} />);
    fireEvent.press(getByText('Flourishing for beginners: 5 ways to get started'));
    expect(handleNavigateToDetails).toHaveBeenCalled();
  });
});
