import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import { CalendarIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components/actionButton';
import { LinkButton } from '../../../../../shared/src/components/linkButton/linkButton';
import { H1, H2, RNText } from '../../../../../shared/src/components/text/text';
import { APP_IMAGES, appColors } from '../../../../../src/config';
import { getStatusTextStyle, getStatusViewStyle, showCancelOption, showConfirmOption } from '../../config/util/utils';
import { ListDataItem, ProviderItemData, RequestLabels } from '../../models/appointments';
import { providerStyles } from './providerDetails.styles';

export interface ProviderDetailProps {
  hasCancel?: boolean;
  hasConfirm?: boolean;
  listData: ProviderItemData[];
  onHandleCancel?: (providerId?: string) => void;
  onHandleConfirm?: (providerId?: string) => void;
  onHandleViewOtherRequests?: () => void;
  providerId?: string;
  requestCount?: string;
  status: string;
  title: string;
  viewOtherRequests?: boolean;
}

export const ProviderDetails: React.FC<ProviderDetailProps> = ({
  listData,
  title,
  onHandleCancel,
  onHandleConfirm,
  onHandleViewOtherRequests,
  viewOtherRequests,
  requestCount,
  providerId,
  status,
  hasCancel,
  hasConfirm,
}) => {
  const { t } = useTranslation();
  const isCancel = !showCancelOption(status) && hasCancel;
  const isConfirm = showConfirmOption(status) && hasConfirm;

  return (
    <View style={providerStyles.container}>
      <H2 style={providerStyles.title}>{title}</H2>
      <View style={providerStyles.itemSeparatorStyle} />
      {listData.map((info: ListDataItem) => (
        <View key={info.label} style={providerStyles.cardStyle}>
          <H1 style={providerStyles.label}>{info.label}</H1>
          {info.label.toLowerCase() === RequestLabels.STATUS ? (
            <View style={[providerStyles.statusContainer, getStatusViewStyle(status)]}>
              <RNText style={[providerStyles.statusValue, getStatusTextStyle(status)]}>{info.value}</RNText>
            </View>
          ) : info.label.toLowerCase() === RequestLabels.DATE_TIME ? (
            <View style={providerStyles.dateTimeContainer}>
              <View style={providerStyles.dateContainer}>
                <CalendarIcon color={appColors.black} />
                <RNText style={providerStyles.timeValue}>{info.value.split('//')[0]}</RNText>
              </View>
              {info.value.split('//')[1] ? (
                <View style={providerStyles.dateContainer}>
                  <Image source={APP_IMAGES.CLOCK} style={providerStyles.icon} />
                  <RNText style={providerStyles.timeDescriptionValue}>{info.value.split('//')[1]}</RNText>
                </View>
              ) : null}
            </View>
          ) : info.label.toLowerCase() === RequestLabels.COUNSELORS && requestCount ? (
            <View style={providerStyles.counselorsContainer}>
              <RNText style={providerStyles.value}>{info.value}</RNText>

              <View style={providerStyles.requestCountContainer}>
                <RNText style={providerStyles.statusValue}>{requestCount}</RNText>
              </View>
            </View>
          ) : (
            <RNText style={providerStyles.value}>{info.value}</RNText>
          )}
        </View>
      ))}
      {isCancel || isConfirm ? (
        <View style={providerStyles.actionButtonView}>
          {isCancel ? (
            <ActionButton
              onPress={() => onHandleCancel?.(providerId)}
              title={t('appointments.cancel')}
              style={providerStyles.cancelActionButton}
              textStyle={providerStyles.cancelButtonText}
              testID={'appointments.history.cancel'}
            />
          ) : null}
          {isConfirm ? (
            <ActionButton
              onPress={() => onHandleConfirm?.(providerId)}
              title={t('appointments.confirm')}
              style={providerStyles.confirmActionButton}
              textStyle={providerStyles.confirmActionButtonText}
              testID={'appointments.history.confirm'}
            />
          ) : null}
        </View>
      ) : null}
      {viewOtherRequests ? (
        <View style={providerStyles.otherRequestsView}>
          <Image source={APP_IMAGES.SHOW_HIDE} style={providerStyles.icon} />
          <LinkButton
            onPress={() => onHandleViewOtherRequests?.()}
            title={t('appointments.viewOtherRequests')}
            testID={'appointments.link.viewOtherRequests'}
            textStyle={providerStyles.linkButtonStyle}
          />
        </View>
      ) : null}
    </View>
  );
};
