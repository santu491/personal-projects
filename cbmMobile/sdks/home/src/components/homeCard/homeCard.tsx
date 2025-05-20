import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, TouchableOpacity, View } from 'react-native';

import { CardComponent } from '../../../../../shared/src/components/cardComponent';
import { H2, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { HomeCardProps } from '../../model/home';
import { homeCardStyles } from './homeCardStyles';

export const HomeCard: React.FC<HomeCardProps> = (props) => {
  const {
    item,
    navigateToDetails,
    cardStyle,
    backgroundImageStyle,
    showHorizontalLine = true,
    tagTextStyle,
    tagViewStyle,
  } = props;
  const [loading, setLoading] = useState(true);
  return (
    <TouchableOpacity
      style={[homeCardStyles.cardContainer, homeCardStyles.card, cardStyle]}
      onPress={() => navigateToDetails(item)}
      accessible={false}
    >
      {item.imagePath || item.image ? (
        <ImageBackground
          source={item.localImage ? item.imagePath : { uri: item.image }}
          style={[homeCardStyles.backgroundImage, backgroundImageStyle]}
          onLoadEnd={() => setLoading(false)}
          testID="home.homecard.backgroundImage"
        >
          {loading ? (
            <View style={homeCardStyles.loaderView}>
              <ActivityIndicator
                testID={'home.card.activityIndicator'}
                style={homeCardStyles.loader}
                size="large"
                color={appColors.purple}
              />
            </View>
          ) : null}
        </ImageBackground>
      ) : (
        <View style={[homeCardStyles.resourcesImageStyle, homeCardStyles.viewBackground]}>
          {item.icon ? (
            <Image testID={'home.homecard.icon'} source={{ uri: item.icon }} style={homeCardStyles.iconStyle} />
          ) : null}
        </View>
      )}
      <View style={homeCardStyles.homeCardContent}>
        {item.title ? (
          <H2 style={homeCardStyles.titleStyle} numberOfLines={1}>
            {item.title}
          </H2>
        ) : null}
        {item.description ? (
          <RNText style={homeCardStyles.contentDesc} numberOfLines={4}>
            {item.description}
          </RNText>
        ) : null}
      </View>
      {item.tags ? (
        <View style={homeCardStyles.tagsView}>
          {showHorizontalLine ? <View testID="home.horizontalLine" style={homeCardStyles.horizontalLine} /> : null}
          <CardComponent
            cardItems={item.tags}
            mainViewStyle={homeCardStyles.subView}
            subViewStyle={[homeCardStyles.patientsView, tagViewStyle]}
            textStyle={[homeCardStyles.cardTitle, tagTextStyle]}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
