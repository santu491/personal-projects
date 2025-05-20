import React, { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';

import { ActionButton } from '../../../../../../shared/src/components';
import { appColors } from '../../../../../../src/config';
import { HomeCardProps } from '../../../model/home';
import { homeStyles } from '../../../screens/home/home.styles';
import { homeCardStyles } from '../homeCardStyles';

export const FindProviderCard: React.FC<HomeCardProps> = ({ item, navigateToDetails }) => {
  const [loading, setLoading] = useState(true);
  return (
    <TouchableOpacity
      style={homeStyles.providerContainer}
      onPress={() => navigateToDetails(item)}
      accessible={false}
      key={item.title}
    >
      {item.image ? (
        <>
          <Image
            source={{ uri: item.image }}
            style={homeCardStyles.providerImage}
            onLoadEnd={() => setLoading(false)}
            testID="home.provider.image"
          />
          {loading ? (
            <View style={homeCardStyles.loaderView}>
              <ActivityIndicator
                style={homeCardStyles.loader}
                size="large"
                color={appColors.purple}
                testID="home.provider.activityIndicator"
              />
            </View>
          ) : null}
          {item.buttonText ? (
            <ActionButton
              onPress={() => navigateToDetails(item)}
              title={item.buttonText}
              style={homeCardStyles.providerSearchButton}
              textStyle={[homeCardStyles.actionButtonText, homeCardStyles.searchButtonTextColor]}
              testID={'home.find.button'}
            />
          ) : null}
        </>
      ) : null}
    </TouchableOpacity>
  );
};
