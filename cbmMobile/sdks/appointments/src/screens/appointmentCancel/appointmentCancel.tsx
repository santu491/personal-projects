import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { ErrorInfoIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RNText } from '../../../../../shared/src/components/text/text';
import { formatDateTime } from '../../../../../shared/src/utils/utils';
import { appColors } from '../../../../../src/config';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { CancelAllComponent } from '../../components/cancelAllComponent/cancelAllComponent';
import { ProviderDetailProps, ProviderDetails } from '../../components/providerDetails/providerDetails';
import { CancelRequestType, CancelScreenType } from '../../constants/constants';
import { AppointmentCurrentStatus } from '../../models/appointments';
import { appointmentCancelRequestStyles } from './appointmentCancel.styles';
import { useAppointmentCancel } from './useAppointmentCancel';

export const AppointmentCancelRequests = () => {
  const { t } = useTranslation();
  const {
    onHandleCancelRequest,
    onHandleConfirmRequest,
    providerDetails,
    onHandleCancelAll,
    isCancelAlert,
    isRequestCanceled,
    onAlertPrimaryButtonPress,
    onAlertSecondaryButtonPress,
    cancelAlertTitle,
    cancelAlertDescription,
    primaryButtonTitle,
    secondaryButtonTitle,
    loading,
    isCancelAll,
    buttonsData,
    selectedProvider,
    cancelRequestType,
    headersData,
    listRef,
    screenType,
    appointmentCurrentStatus,
  } = useAppointmentCancel();

  const renderProviderContent = ({ item }: { item: ProviderDetailProps }) => {
    return (
      <ProviderDetails
        listData={item.listData}
        title={item.title}
        onHandleCancel={onHandleCancelRequest}
        onHandleConfirm={onHandleConfirmRequest}
        providerId={item.providerId}
        status={item.status}
        hasCancel={buttonsData.isCancel}
        hasConfirm={buttonsData.isConfirm}
      />
    );
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={appointmentCancelRequestStyles.container}>
        <ProgressLoader isVisible={loading} />
        <MemberProfileHeader
          titleStyle={appointmentCancelRequestStyles.titleStyle}
          testID={'appointments.confirmed.requests-title'}
          title={headersData.title}
          description={headersData.description}
        />
        {providerDetails ? (
          <FlatList
            style={appointmentCancelRequestStyles.listStyle}
            testID={'appointments.appointmentDetails.providerList'}
            data={providerDetails}
            ref={listRef}
            renderItem={renderProviderContent}
            ListHeaderComponent={
              !isCancelAll && buttonsData.isCancelAll && screenType === CancelScreenType.CANCEL_REQUEST ? (
                <CancelAllComponent onHandleCancelAll={onHandleCancelAll} />
              ) : null
            }
            ListFooterComponent={
              appointmentCurrentStatus === AppointmentCurrentStatus.IS_INITIATED &&
              !isCancelAll &&
              buttonsData.isCancelAll &&
              screenType === CancelScreenType.APPOINTMENT_DETAIL_REQUEST ? (
                <View style={appointmentCancelRequestStyles.footerView}>
                  <View style={appointmentCancelRequestStyles.cancelDescriptionView}>
                    <ErrorInfoIcon color={appColors.gray} />
                    <RNText style={appointmentCancelRequestStyles.cancelAllDescription}>
                      {t('appointments.appointmentDetailsContent.cancelAllDescription')}
                    </RNText>
                  </View>
                  <ActionButton
                    onPress={() => onHandleCancelAll()}
                    title={t('appointments.appointmentDetailsContent.cancelAllAlertTitle')}
                    testID={'appointments.appointmentDetails.cancelAll'}
                  />
                </View>
              ) : null
            }
          />
        ) : null}

        {!loading && (
          <AlertModel
            modalVisible={isCancelAlert || isRequestCanceled}
            onHandlePrimaryButton={onAlertPrimaryButtonPress}
            onHandleSecondaryButton={onAlertSecondaryButtonPress}
            title={cancelAlertTitle()}
            isError={isCancelAlert}
            subTitle={
              isRequestCanceled && cancelRequestType === CancelRequestType.REQUEST_CONFIRMED ? (
                <RNText>
                  {t('appointments.appointmentDetailsContent.requestConfirmedDescription')}
                  {t('common.space')}
                  <RNText style={appointmentCancelRequestStyles.dateTimeStyle}>
                    {formatDateTime(selectedProvider?.providerPrefferedDateAndTime ?? '')}
                    {t('common.dot')}
                  </RNText>
                </RNText>
              ) : (
                cancelAlertDescription()
              )
            }
            secondaryButtonTitle={secondaryButtonTitle()}
            primaryButtonTitle={primaryButtonTitle()}
            errorIndicatorIconColor={
              cancelRequestType !== CancelRequestType.SERVER_ERROR ? appColors.lightDarkGray : appColors.darkRed
            }
          />
        )}
      </View>
    </>
  );
};
