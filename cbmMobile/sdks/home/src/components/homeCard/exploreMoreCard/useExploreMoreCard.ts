import { useEffect, useState } from 'react';

import { ExploreMoreTopicsDataDTO, ExploreMoreTopicsDTO } from '../../../model/home';

export const useExploreMoreCard = ({ exploreMoreData }: { exploreMoreData: ExploreMoreTopicsDTO[] }) => {
  const [selectedExploreMoreTopic, setSelectedExploreMoreTopic] = useState<ExploreMoreTopicsDataDTO[] | undefined>();
  const [selectedExploreMoreTopicIndex, setSelectedExploreMoreTopicIndex] = useState(0);

  useEffect(() => {
    const defaultExploreMoreTopic = exploreMoreData[0]?.data;
    setSelectedExploreMoreTopic(defaultExploreMoreTopic);
  }, [exploreMoreData]);

  const onPressTab = (selectedIndex: number, item?: ExploreMoreTopicsDataDTO[]) => {
    setSelectedExploreMoreTopicIndex(selectedIndex);
    setSelectedExploreMoreTopic(item);
  };

  return {
    selectedExploreMoreTopic,
    selectedExploreMoreTopicIndex,
    onPressTab,
  };
};
