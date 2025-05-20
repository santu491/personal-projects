import React from 'react';
import { ScrollView } from 'react-native';

import { MainHeaderComponent } from '../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../shared/src/components/progressLoader';
import { H1, H3 } from '../../../shared/src/components/text/text';
import { BannerButtonPage } from '../../models/cardResource';
import { styles } from './cardResource.styles';
import { CardBanner } from './components/cardBanner';
import { CardResourceContact } from './components/cardResourceContact';
import { CardResourceExclusiveBenefits } from './components/cardResourceExclusiveBenefits';
import { CardResourceGetHelpCases } from './components/cardResourceGetHelpCases';
import { useCardResource } from './useCardResource';

export const CardResource = ({
  path,
  navigateToCredibleMind,
  navigateToResourceLibrary,
}: {
  navigateToCredibleMind: (url: string) => void;
  navigateToResourceLibrary: (data: BannerButtonPage) => void;
  path: string;
}) => {
  const { contentInfo, loading, bannerButtons, onPressBannerButton, onPressContactNo } = useCardResource({
    path,
    navigateToCredibleMind,
    navigateToResourceLibrary,
  });
  const page = contentInfo?.page;

  return (
    <>
      <MainHeaderComponent />
      <ProgressLoader isVisible={loading} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <H1 style={styles.h1}>{page?.title}</H1>
        <H3 style={styles.h3}>{page?.subtitle}</H3>
        <CardBanner
          data={page?.cards?.banner}
          bannerButtons={bannerButtons}
          onPressBannerButton={onPressBannerButton}
        />
        {page?.cards?.contact?.number ? (
          <CardResourceContact contact={page.cards.contact} onPressContactNo={onPressContactNo} />
        ) : null}
        <CardResourceGetHelpCases getHelpCases={page?.cards?.getHelpCases} />
        <CardResourceExclusiveBenefits exclusiveBenefits={page?.cards?.exclusiveBenefits} />
      </ScrollView>
    </>
  );
};
