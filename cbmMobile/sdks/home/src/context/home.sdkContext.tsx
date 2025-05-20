import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { CardsSectionData, ExploreMoreTopicsDTO, TrendingTopics } from '../model/home';
import { HomeNavigationProp } from '../navigation/home.navigationTypes';

export interface HomeContextType extends AppContextType {
  exploreMoreCoursesAndResourcesContent: CardsSectionData[] | undefined;
  exploreMoreTopics: ExploreMoreTopicsDTO | undefined;
  homeContent: CardsSectionData[] | undefined;
  setExploreMoreCoursesAndResourcesContent: React.Dispatch<React.SetStateAction<CardsSectionData[] | undefined>>;
  setExploreMoreTopics: React.Dispatch<React.SetStateAction<ExploreMoreTopicsDTO | undefined>>;
  setHomeContent: React.Dispatch<React.SetStateAction<CardsSectionData[] | undefined>>;
  setTrendingTopics: React.Dispatch<React.SetStateAction<TrendingTopics | undefined>>;
  trendingTopics: TrendingTopics | undefined;
}

const HomeContext = React.createContext<HomeContextType | null>(null);

const useHomeContextOnly = (): HomeContextType => {
  const context = React.useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

export function useHomeContext(): WithNavigation<HomeNavigationProp, HomeContextType> {
  return useWithNavigation<HomeNavigationProp, HomeContextType>(useHomeContextOnly());
}

export { HomeContext };
