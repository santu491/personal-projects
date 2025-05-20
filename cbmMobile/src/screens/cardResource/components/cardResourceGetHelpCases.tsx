import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

import { H4 } from '../../../../shared/src/components/text/text';
import { GetHelpCases, GetHelpCasesData } from '../../../models/cardResource';
import { styles } from '../cardResource.styles';

export const CardResourceGetHelpCases = ({ getHelpCases }: { getHelpCases?: GetHelpCases }) => {
  const renderGetHelpCases = ({ item }: { item: GetHelpCasesData }) => {
    return (
      <View style={styles.getHelpCases}>
        <View style={styles.getHelpCasesImageView}>
          <Image source={{ uri: item.image }} style={styles.getHelpCasesImage} />
        </View>
        <Text style={styles.getHelpCasesDescription}>{item.title}</Text>
      </View>
    );
  };
  return (
    <>
      <H4 style={styles.h4}>{getHelpCases?.title}</H4>
      <FlatList
        data={getHelpCases?.data}
        renderItem={renderGetHelpCases}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        scrollEnabled={false}
      />
    </>
  );
};
