import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { H2, RNText } from '../../../../../../shared/src/components/text/text';
import { HomeCardProps } from '../../../model/home';
import { homeCardStyles } from '../homeCardStyles';

export const ResourcesCard: React.FC<HomeCardProps> = (props) => {
  const { item, navigateToDetails, cardStyle } = props;

  return (
    <TouchableOpacity
      style={[homeCardStyles.resourseCard, homeCardStyles.cardContainer, cardStyle]}
      onPress={() => navigateToDetails(item)}
      accessible={false}
      key={item.title}
      testID={'home.resource.card'}
    >
      {item.image ? (
        <Image testID={'home.resource.image'} source={{ uri: item.image }} style={homeCardStyles.resourcesImageStyle} />
      ) : (
        <View style={[homeCardStyles.resourcesImageStyle, homeCardStyles.viewBackground]}>
          <Image testID={'home.resource.icon'} source={{ uri: item.icon }} style={homeCardStyles.iconStyle} />
        </View>
      )}
      <View style={homeCardStyles.resourceCardContent}>
        {item.title ? (
          <H2 style={homeCardStyles.titleStyle} numberOfLines={2}>
            {item.title}
          </H2>
        ) : null}
        {item.description ? (
          <RNText numberOfLines={4} style={homeCardStyles.contentDesc}>
            {item.description}
          </RNText>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
