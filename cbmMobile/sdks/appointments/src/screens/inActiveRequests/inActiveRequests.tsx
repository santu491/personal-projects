import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { FullScreenError } from '../../../../../shared/src/components/fullScreenError/fullScreenError';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { ProviderDetailProps, ProviderDetails } from '../../components/providerDetails/providerDetails';
import { requestStyles } from './inActiveRequests.styles';
import { useInActiveRequests } from './useInActiveRequests';

export const InActiveRequests = () => {
  const { t } = useTranslation();
  const { inActiveRequestsList, loading, isServerError, onPressTryAgain } = useInActiveRequests();

  const renderHistoryContent = ({ item }: { item: ProviderDetailProps }) => {
    return <ProviderDetails listData={item.listData} title={item.title} status={item.status} />;
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} />

      <View style={requestStyles.container}>
        <MemberProfileHeader
          titleStyle={requestStyles.titleStyle}
          testID={'appointments.inActive.requests.title'}
          title={t('appointments.inactiveRequests')}
        />
        {loading ? (
          <ProgressLoader isVisible={true} />
        ) : isServerError ? (
          <FullScreenError onPressTryAgain={onPressTryAgain} />
        ) : inActiveRequestsList.length > 0 ? (
          <FlatList
            style={requestStyles.listStyle}
            testID={'appointments.inActive.list'}
            data={inActiveRequestsList}
            renderItem={renderHistoryContent}
          />
        ) : (
          <NoRequests />
        )}
      </View>
    </>
  );
};
