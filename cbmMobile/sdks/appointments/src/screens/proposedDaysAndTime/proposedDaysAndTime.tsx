import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H2, H3, RNText } from '../../../../../shared/src/components/text/text';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { proposedDaysAndTimeStyles } from './proposedDaysAndTime.styles';
import { useProposedDaysAndTime } from './useProposedDaysAndTime';

export const ProposedDaysAndTime = () => {
  const { t } = useTranslation();
  const { days, time, clinicalInfo } = useProposedDaysAndTime();

  return (
    <>
      <MainHeaderComponent />
      <View style={proposedDaysAndTimeStyles.container}>
        <View style={proposedDaysAndTimeStyles.mainContainer}>
          <MemberProfileHeader
            titleStyle={proposedDaysAndTimeStyles.titleStyle}
            testID={'appointments.appointmentDetails.proposedDaysAndTime'}
            title={t('appointments.appointmentDetailsContent.proposedDaysAndTime')}
          />
          {clinicalInfo ? (
            <View style={proposedDaysAndTimeStyles.counselorSettings}>
              <H2 style={proposedDaysAndTimeStyles.counselorSettingsTitle}>
                {t('appointments.appointmentDetailsContent.proposedDaysAndTime')}
              </H2>
              <View style={proposedDaysAndTimeStyles.itemSeparator} />
              <View>
                <H3 style={proposedDaysAndTimeStyles.question}>{t('appointment.reviewDetails.preferredSlot')}</H3>
                <RNText>{t('appointment.reviewDetails.appliesToText')}</RNText>
                {days.length === 0 && (
                  <View style={[proposedDaysAndTimeStyles.roundButton, proposedDaysAndTimeStyles.counselorView]}>
                    <RNText>{t('appointment.counselorSetting.availablePerCounselor')}</RNText>
                  </View>
                )}
                <View style={proposedDaysAndTimeStyles.daysView}>
                  {days.map((day) => (
                    <View key={day} style={proposedDaysAndTimeStyles.roundButton}>
                      <RNText style={proposedDaysAndTimeStyles.roundButtonText}>{day}</RNText>
                    </View>
                  ))}
                </View>
                <View style={proposedDaysAndTimeStyles.timeView}>
                  {time ? (
                    <View style={proposedDaysAndTimeStyles.roundButton}>
                      <RNText style={proposedDaysAndTimeStyles.roundButtonText}>{time}</RNText>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ) : (
            <NoRequests />
          )}
        </View>
      </View>
    </>
  );
};
