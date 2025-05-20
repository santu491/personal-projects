import React from 'react';
import { ScrollView, View } from 'react-native';

import { ActionButton } from '../../../../../../shared/src/components';
import { CardsData, CardsSectionDataDTO, ExploreMoreTopicsDTO } from '../../../model/home';
import { homeStyles } from '../../../screens/home/home.styles';
import { HomeCard } from '../homeCard';
import { useExploreMoreCard } from './useExploreMoreCard';

interface ExploreMoreProps {
  exploreMoreData: ExploreMoreTopicsDTO[];
  navigateToDetails: (item: CardsData) => void;
}

export const ExploreMoreCard = ({ exploreMoreData, navigateToDetails }: ExploreMoreProps) => {
  const { onPressTab, selectedExploreMoreTopic, selectedExploreMoreTopicIndex } = useExploreMoreCard({
    exploreMoreData,
  });
  return (
    <>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={[homeStyles.rowDirection, homeStyles.exploreMoreTabsView]}
      >
        {exploreMoreData.map((item, index) => (
          <View key={item.title}>
            <ActionButton
              title={item.title || ''}
              onPress={() => onPressTab(index, (item as ExploreMoreTopicsDTO).data)}
              testID={item.title}
              textStyle={[
                homeStyles.tabTextStyle,
                selectedExploreMoreTopicIndex !== index && homeStyles.tabTextInactive,
              ]}
              style={[homeStyles.tabView, selectedExploreMoreTopicIndex !== index && homeStyles.tabViewInactive]}
            />
          </View>
        ))}
      </ScrollView>

      {selectedExploreMoreTopic ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={[homeStyles.rowDirection, homeStyles.resourceView]}
        >
          {selectedExploreMoreTopic[0]?.data?.map((item: CardsSectionDataDTO) => (
            <View key={item.title}>
              <HomeCard
                item={item}
                navigateToDetails={() => navigateToDetails(item)}
                cardStyle={[homeStyles.containerMargin, homeStyles.exploreMoreTopicsList]}
                backgroundImageStyle={homeStyles.backgroundImageStyle}
                showHorizontalLine={false}
                tagTextStyle={homeStyles.tagTextStyle}
                tagViewStyle={homeStyles.tagViewStyle}
              />
            </View>
          ))}
        </ScrollView>
      ) : null}
    </>
  );
};
