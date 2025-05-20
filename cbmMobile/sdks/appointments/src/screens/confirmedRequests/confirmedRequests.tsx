import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { FullScreenError } from '../../../../../shared/src/components/fullScreenError/fullScreenError';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { appColors } from '../../../../../shared/src/context/appColors';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { ProviderDetailProps, ProviderDetails } from '../../components/providerDetails/providerDetails';
import { CancelRequestType } from '../../constants/constants';
import { requestStyles } from './confirmedRequests.styles';
import { useConfirmedRequests } from './useConfirmedRequests';

export const ConfirmedRequests = () => {
  const { t } = useTranslation();
  const {
    confirmedRequestsList,
    onHandleCancelRequest,
    isCancelAlert,
    isRequestCanceled,
    onAlertPrimaryButtonPress,
    onAlertSecondaryButtonPress,
    cancelAlertTitle,
    cancelAlertDescription,
    primaryButtonTitle,
    secondaryButtonTitle,
    loading,
    onHandleViewOtherRequests,
    cancelRequestType,
    isServerError,
    onPressTryAgain,
  } = useConfirmedRequests();

  const renderHistoryContent = ({ item }: { item: ProviderDetailProps }) => {
    return (
      <ProviderDetails
        listData={item.listData}
        title={item.title}
        viewOtherRequests={true}
        onHandleViewOtherRequests={onHandleViewOtherRequests}
        onHandleCancel={() => onHandleCancelRequest(item.providerId)}
        status={item.status}
        hasCancel={true}
      />
    );
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={requestStyles.container}>
        <MemberProfileHeader
          titleStyle={requestStyles.titleStyle}
          testID={'appointments.confirmed.requests-title'}
          title={t('appointments.confirmedRequests')}
          description={confirmedRequestsList ? t('appointments.confirmRequestsDescription') : undefined}
        />
        {loading ? (
          <ProgressLoader isVisible={loading} />
        ) : isServerError ? (
          <FullScreenError onPressTryAgain={onPressTryAgain} />
        ) : confirmedRequestsList ? (
          <FlatList
            style={requestStyles.listStyle}
            testID={'appointments.history.list'}
            data={confirmedRequestsList}
            renderItem={renderHistoryContent}
          />
        ) : (
          <NoRequests />
        )}

        <AlertModel
          modalVisible={isCancelAlert || isRequestCanceled}
          onHandlePrimaryButton={onAlertPrimaryButtonPress}
          onHandleSecondaryButton={onAlertSecondaryButtonPress}
          title={cancelAlertTitle()}
          isError={isCancelAlert}
          subTitle={cancelAlertDescription()}
          secondaryButtonTitle={secondaryButtonTitle()}
          primaryButtonTitle={primaryButtonTitle()}
          errorIndicatorIconColor={
            cancelRequestType !== CancelRequestType.SERVER_ERROR ? appColors.lightDarkGray : appColors.darkRed
          }
        />
      </View>
    </>
  );
};
