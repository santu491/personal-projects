import React from 'react';
import { FlatList, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { CardsData } from '../../../model/home';
import { HomeCard } from '../homeCard';

export interface TopicCardProps {
  backgroundImageStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  data: CardsData[];
  enableHorizontalScroll?: boolean;
  onPressNavigateToDetails: (item: CardsData) => void;
  showHorizontalLine?: boolean;
  tagTextStyle?: StyleProp<TextStyle>;
  tagViewStyle?: StyleProp<ViewStyle>;
}

export const TopicCard: React.FC<TopicCardProps> = (props) => {
  const {
    data,
    onPressNavigateToDetails,
    showHorizontalLine = true,
    enableHorizontalScroll = true,
    tagTextStyle,
    tagViewStyle,
    backgroundImageStyle,
    cardStyle,
  } = props;
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => {
        return (
          <HomeCard
            item={item}
            navigateToDetails={() => onPressNavigateToDetails(item)}
            cardStyle={cardStyle}
            backgroundImageStyle={backgroundImageStyle}
            showHorizontalLine={showHorizontalLine}
            tagTextStyle={tagTextStyle}
            tagViewStyle={tagViewStyle}
          />
        );
      }}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      horizontal={enableHorizontalScroll}
    />
  );
};
