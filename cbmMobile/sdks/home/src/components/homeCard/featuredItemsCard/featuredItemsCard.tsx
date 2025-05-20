import React from 'react';
import { TouchableOpacity } from 'react-native';

import { H2, RNText } from '../../../../../../shared/src/components/text/text';
import { HomeCardProps } from '../../../model/home';
import { homeCardStyles } from '../homeCardStyles';

export const FeaturedItemsCard: React.FC<HomeCardProps> = ({ item, navigateToDetails, cardStyle }) => {
  return (
    <TouchableOpacity
      style={[homeCardStyles.featuredCard, cardStyle]}
      onPress={() => navigateToDetails(item)}
      accessible={false}
      key={item.title}
    >
      <H2 style={homeCardStyles.featuredTitle}>{item.title}</H2>
      <RNText>{item.description}</RNText>
    </TouchableOpacity>
  );
};
