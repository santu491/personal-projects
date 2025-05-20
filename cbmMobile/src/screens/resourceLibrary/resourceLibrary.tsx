import React from 'react';
import { ScrollView, SectionList, TouchableOpacity, View } from 'react-native';

import { CardComponent } from '../../../shared/src/components/cardComponent';
import { MainHeaderComponent } from '../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H1, H2, H3, H4, RNText } from '../../../shared/src/components/text/text';
import { BannerButtonPage, BannerButtonPageDataData, BannerButtonPageSectionData } from '../../models/cardResource';
import { styles } from './resourceLibrary.styles';
import { useResourceLibrary } from './useResourceLibrary';

export const ResourceLibrary = ({ resourceLibraryData }: { resourceLibraryData: BannerButtonPage }) => {
  const { onPressCard, data, wpoRedirectUrl } = useResourceLibrary({ resourceLibraryData });

  const renderSectionHeader = (section: BannerButtonPageSectionData) => {
    return <H4 style={[styles.h4, styles.bannerTitle]}>{section.title}</H4>;
  };

  const renderItem = (item: BannerButtonPageDataData) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPressCard(item, wpoRedirectUrl)}
        testID={`resourceLibraryCard.${item.title}`}
      >
        {item.title ? <H2 style={styles.titleStyle}>{item.title}</H2> : null}
        {item.description ? <RNText style={styles.contentDesc}>{item.description}</RNText> : null}
        {item.tags ? (
          <>
            <View style={styles.horizontalLine} />
            <CardComponent
              cardItems={item.tags}
              mainViewStyle={styles.subView}
              subViewStyle={[styles.patientsView]}
              textStyle={[styles.cardTitle]}
            />
          </>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MainHeaderComponent />
      <ScrollView style={styles.container}>
        <H1 style={styles.h1}>{resourceLibraryData.title}</H1>
        <H3 style={styles.h3}>{resourceLibraryData.description}</H3>
        <SectionList
          sections={data}
          renderSectionHeader={({ section }: { section: BannerButtonPageSectionData }) => renderSectionHeader(section)}
          renderItem={({ item }: { item: BannerButtonPageDataData }) => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </>
  );
};
