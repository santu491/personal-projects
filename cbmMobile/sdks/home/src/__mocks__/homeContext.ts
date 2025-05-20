import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { HomeContextType } from '../context/home.sdkContext';

export function getMockHomeContext(): Readonly<HomeContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
    exploreMoreCoursesAndResourcesContent: [],
    homeContent: [],
    setExploreMoreCoursesAndResourcesContent: jest.fn(),
    setHomeContent: jest.fn(),
    host: '',
    setHost: jest.fn(),
    setExploreMoreTopics: jest.fn(),
    setTrendingTopics: jest.fn(),
    trendingTopics: undefined,
    exploreMoreTopics: undefined,
  };
}
