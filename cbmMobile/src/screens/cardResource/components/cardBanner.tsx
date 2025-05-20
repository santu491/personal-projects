import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

import { ActionButton } from '../../../../shared/src/components';
import { H4 } from '../../../../shared/src/components/text/text';
import { appColors } from '../../../config';
import { BannerButtonsData, CardBannerInfo } from '../../../models/cardResource';
import { styles } from '../cardResource.styles';

export const CardBanner = ({
  data,
  bannerButtons,
  onPressBannerButton,
}: {
  bannerButtons?: BannerButtonsData[];
  data?: CardBannerInfo;
  onPressBannerButton: (item: BannerButtonsData) => void;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.bannerContainer}>
      {data?.image ? (
        <>
          <Image
            source={{
              uri: data.image,
            }}
            style={[styles.image, loading && styles.imageOnLoading]}
            resizeMode="cover"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

          {loading ? (
            <View style={styles.loaderView}>
              <ActivityIndicator style={styles.loader} size="large" color={appColors.purple} />
            </View>
          ) : null}
        </>
      ) : null}

      <H4 style={[styles.h4, styles.bannerTitle]}>{data?.title}</H4>
      {data?.description ? <Text style={styles.description}>{data.description}</Text> : null}

      {(bannerButtons?.length ?? 0) > 0 &&
        bannerButtons?.map((item: BannerButtonsData) => {
          return item.enabled && item.label ? (
            <ActionButton
              title={item.label}
              testID={`cardBanner.${item.label}`}
              onPress={() => onPressBannerButton(item)}
              style={styles.button}
            />
          ) : null;
        })}
    </View>
  );
};
