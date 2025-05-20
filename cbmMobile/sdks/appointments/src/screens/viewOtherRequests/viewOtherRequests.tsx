import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { ProviderDetailProps, ProviderDetails } from '../../components/providerDetails/providerDetails';
import { useViewOtherRequests } from './useViewOtherRequests';
import { requestStyles } from './viewOtherRequests.styles';

export const ViewOtherRequests = () => {
  const { t } = useTranslation();
  const { otherRequestList, dateOfInitiation } = useViewOtherRequests();

  const renderHistoryContent = ({ item }: { item: ProviderDetailProps }) => {
    return <ProviderDetails listData={item.listData} title={item.title} status={item.status} />;
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={requestStyles.container}>
        <MemberProfileHeader
          titleStyle={requestStyles.titleStyle}
          testID={'appointments.other.requests.title'}
          title={
            otherRequestList && otherRequestList.length > 0
              ? `${t('appointments.otherRequests')} (0${otherRequestList.length})`
              : t('appointments.otherRequests')
          }
          description={
            otherRequestList && otherRequestList.length > 0
              ? `${t('appointments.sentOn')} ${dateOfInitiation}`
              : undefined
          }
        />
        {otherRequestList && otherRequestList.length > 0 ? (
          <FlatList
            style={requestStyles.listStyle}
            testID={'appointments.other.requests.history.list'}
            data={otherRequestList}
            renderItem={renderHistoryContent}
          />
        ) : (
          <NoRequests />
        )}
      </View>
    </>
  );
};
