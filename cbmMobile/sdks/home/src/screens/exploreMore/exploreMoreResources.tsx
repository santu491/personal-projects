import React from 'react';
import { SectionList, View } from 'react-native';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H3, RNText } from '../../../../../shared/src/components/text/text';
import { HomeCard } from '../../components/homeCard/homeCard';
import { useHomeContext } from '../../context/home.sdkContext';
import { useHomeView } from '../home/useHome';
import { exploreMoreResourcesStyles as styles } from './exploreMoreResources.styles';

export const ExploreMoreResources = () => {
  const { navigateToDetails } = useHomeView();
  const { exploreMoreCoursesAndResourcesContent } = useHomeContext();

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={styles.exploreContainer}>
        {exploreMoreCoursesAndResourcesContent ? (
          <SectionList
            sections={exploreMoreCoursesAndResourcesContent}
            renderItem={({ item }) => <HomeCard item={item} navigateToDetails={() => navigateToDetails(item)} />}
            renderSectionHeader={({ section }) => (
              <>
                <H3 style={styles.exploreTitle} testID="home.explore.title">
                  {section.title}
                </H3>
                <RNText style={styles.exploreSubTitle} testID="home.explore.subTitle">
                  {section.subTitle}
                </RNText>
              </>
            )}
            stickySectionHeadersEnabled={false}
          />
        ) : null}
      </View>
    </>
  );
};
