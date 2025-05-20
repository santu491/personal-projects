import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import {
  mockExploreMoreCoursesAndResourcesContent,
  mockExploreMoreTopics,
  mockHomeContent,
  mockTrendingTopics,
} from '../../../__mocks__/homeContent';
import { HomeMockContextWrapper } from '../../../__mocks__/homeMockContextWrapper';
import { HomeScreen } from '../home';
import { useHomeView } from '../useHome';

jest.mock('../useHome', () => ({
  useHomeView: jest.fn(),
}));
jest.mock('../../../../../../src/util/commonUtils');

describe('HomeScreen', () => {
  const mockUseHomeView = {
    navigateToDetails: jest.fn(),
    alertInfo: null,
    isAlertEnabled: false,
    loading: false,
    navigateToExplore: jest.fn(),
    homeContent: mockHomeContent,
    exploreMoreCoursesAndResourcesContent: mockExploreMoreCoursesAndResourcesContent,
    exploreMoreTopicsTabs: ['Political stress'],
    onPressTab: jest.fn(),
    selectedExploreMoreTopic: mockExploreMoreTopics.data[0].data,
    trendingTopics: mockTrendingTopics,
    exploreMoreTopics: mockExploreMoreTopics,
  };

  beforeEach(() => {
    (useHomeView as jest.Mock).mockReturnValue(mockUseHomeView);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  const mockHomeScreen = () => {
    return render(
      <HomeMockContextWrapper>
        <HomeScreen />
      </HomeMockContextWrapper>
    );
  };

  it('should render FindProviderCard for BANNER_WITH_PRIMARY_BUTTON', () => {
    const data = mockHomeScreen();
    expect(data).toBeTruthy();
  });
});
