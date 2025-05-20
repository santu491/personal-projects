import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { H2, RNText } from '../../../../../../shared/src/components/text/text';
import { HomeCardProps } from '../../../model/home';
import { homeCardStyles } from '../homeCardStyles';

export const ServicesCard: React.FC<HomeCardProps> = (props) => {
  const { item, navigateToDetails, cardStyle } = props;

  return (
    <TouchableOpacity
      style={[homeCardStyles.serviceCard, cardStyle]}
      onPress={() => navigateToDetails(item)}
      accessible={false}
      key={item.title}
      testID={'home.service.card'}
    >
      <View style={homeCardStyles.content}>
        {item.title ? (
          <H2 style={[homeCardStyles.titleStyle, homeCardStyles.serviceTitle]} numberOfLines={2}>
            {item.title}
          </H2>
        ) : null}
        {item.description ? (
          <RNText style={homeCardStyles.contentDesc} numberOfLines={3}>
            {item.description}
          </RNText>
        ) : null}
      </View>
      {item.icon ? (
        <View style={homeCardStyles.iconView}>
          <Image
            testID={'home.servicesCard.image'}
            source={{ uri: item.icon }}
            style={homeCardStyles.iconStyle}
            resizeMode="contain"
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
