import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { ActionButton } from '../../../../../shared/src/components/actionButton';
import { FullScreenError } from '../../../../../shared/src/components/fullScreenError/fullScreenError';
import { LinkButton } from '../../../../../shared/src/components/linkButton/linkButton';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { ProviderDetails } from '../../components/providerDetails/providerDetails';
import { requestStyles } from './pendingRequests.styles';
import { usePendingRequests } from './usePendingRequests';

export const PendingRequests = () => {
  const { t } = useTranslation();
  const { pendingRequestsList, loading, onPressTryAgain, onPressContinueButton, onPressCancelRequest, isServerError } =
    usePendingRequests();

  return (
    <>
      <MainHeaderComponent leftArrow={true} />

      <View style={requestStyles.container}>
        <MemberProfileHeader
          titleStyle={requestStyles.titleStyle}
          testID={'appointments.pending.requests.title'}
          title={t('appointments.pendingRequests')}
          description={pendingRequestsList ? t('appointments.pendingRequestDescription') : undefined}
        />
        {loading ? (
          <ProgressLoader isVisible={loading} />
        ) : isServerError ? (
          <FullScreenError onPressTryAgain={onPressTryAgain} />
        ) : pendingRequestsList ? (
          <ScrollView style={requestStyles.listStyle}>
            <ProviderDetails
              listData={pendingRequestsList.listData}
              title={pendingRequestsList.title}
              status={pendingRequestsList.status}
              requestCount={pendingRequestsList.requestCount}
              providerId={pendingRequestsList.providerId}
            />
            <ActionButton
              onPress={onPressContinueButton}
              title={t('appointment.continue')}
              style={requestStyles.continueActionButton}
              textStyle={requestStyles.continueActionButtonText}
              testID={'appointments.pending.continue'}
            />
            <LinkButton
              onPress={onPressCancelRequest}
              textStyle={requestStyles.linkButtonTitle}
              title={t('appointments.cancelRequest')}
            />
          </ScrollView>
        ) : (
          <NoRequests />
        )}
      </View>
    </>
  );
};
