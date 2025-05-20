import React, { useMemo, useState } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { HomeContext, HomeContextType } from './context/home.sdkContext';
import { CardsSectionData, ExploreMoreTopicsDTO, TrendingTopics } from './model/home';

export const HomeSDK = ({ children }: { children: React.ReactNode }) => {
  const appContext = useAppContext();
  const [homeContent, setHomeContent] = useState<CardsSectionData[] | undefined>();
  const [exploreMoreCoursesAndResourcesContent, setExploreMoreCoursesAndResourcesContent] = useState<
    CardsSectionData[] | undefined
  >();
  const [exploreMoreTopics, setExploreMoreTopics] = useState<ExploreMoreTopicsDTO | undefined>();
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopics | undefined>();

  const context: HomeContextType = useMemo(() => {
    return {
      ...appContext,
      homeContent,
      setHomeContent,
      exploreMoreCoursesAndResourcesContent,
      setExploreMoreCoursesAndResourcesContent,
      exploreMoreTopics,
      setExploreMoreTopics,
      trendingTopics,
      setTrendingTopics,
    };
  }, [appContext, exploreMoreCoursesAndResourcesContent, exploreMoreTopics, homeContent, trendingTopics]);

  return (
    <>
      <HomeContext.Provider value={context}>{children}</HomeContext.Provider>
    </>
  );
};
