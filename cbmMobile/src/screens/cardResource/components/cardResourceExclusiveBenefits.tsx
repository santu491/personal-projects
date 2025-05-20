import React from 'react';
import { FlatList, Image, View } from 'react-native';

import { H3, H4 } from '../../../../shared/src/components/text/text';
import { ExclusiveBenefits, ExclusiveBenefitsData } from '../../../models/cardResource';
import { styles } from '../cardResource.styles';

export const CardResourceExclusiveBenefits = ({ exclusiveBenefits }: { exclusiveBenefits?: ExclusiveBenefits }) => {
  const renderExclusiveBenefits = ({ item }: { item: ExclusiveBenefitsData }) => {
    return (
      <View style={styles.exclusiveBenefitsView}>
        <Image source={{ uri: item.image }} style={styles.exclusiveBenefitsImage} resizeMode="contain" />
        <View style={styles.exclusiveBenefitsTitle}>
          <H3>{item.title}</H3>
        </View>
      </View>
    );
  };
  return (
    <>
      <H4 style={[styles.h4, styles.exclusiveBenefitsHeader]}>{exclusiveBenefits?.title}</H4>
      <FlatList
        data={exclusiveBenefits?.data}
        renderItem={renderExclusiveBenefits}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
      />
    </>
  );
};
