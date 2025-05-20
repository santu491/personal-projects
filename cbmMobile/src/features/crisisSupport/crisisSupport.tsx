import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { MemberProfileHeader } from '../../../sdks/menu/src/components/memberProfileHeader/memberProfileHeader';
import { CrisisDetails } from '../../../shared/src/components/crisisDetails/crisisDetails';
import { FullScreenError } from '../../../shared/src/components/fullScreenError/fullScreenError';
import { MainHeaderComponent } from '../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../shared/src/components/progressLoader';
import { H3 } from '../../../shared/src/components/text/text';
import { CrisisSectionData } from '../../models/crisisSupport';
import { crisisStyles } from './crisisSupport.styles';
import { useCrisisSupport } from './useCrisisSupport';

export const CrisisSupport = () => {
  const { t } = useTranslation();
  const { loading, crisisSupportData, isServerError, onPressTryAgain } = useCrisisSupport();

  const renderCrisisContent = ({ item }: { item: CrisisSectionData }) => {
    return (
      <CrisisDetails
        listData={item.crisisSupportDetails}
        title={item.sectionTitle}
        coverageTitle={t('credibleMind.immediateAssistance.coverage')}
        hotlineTitle={t('credibleMind.immediateAssistance.hotline')}
      />
    );
  };

  return (
    <View style={crisisStyles.container}>
      <MainHeaderComponent />
      <ProgressLoader isVisible={loading} />
      <MemberProfileHeader
        title={t('credibleMind.immediateAssistance.crisisHotlinesTitle')}
        titleStyle={crisisStyles.titleStyle}
        testID={'wellness.crisis.title'}
      />

      {!isServerError ? (
        <View style={crisisStyles.listContainer}>
          <FlatList
            data={crisisSupportData}
            style={crisisStyles.sectionListStyle}
            renderItem={(item) => renderCrisisContent(item)}
            // eslint-disable-next-line react/forbid-component-props
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <H3 style={crisisStyles.titleDescription}>
                {t('credibleMind.immediateAssistance.crisisHotlinesDescription')}
              </H3>
            }
            keyExtractor={(item, index) => `${item.sectionTitle}-${index}`}
          />
        </View>
      ) : (
        <FullScreenError onPressTryAgain={onPressTryAgain} />
      )}
    </View>
  );
};
