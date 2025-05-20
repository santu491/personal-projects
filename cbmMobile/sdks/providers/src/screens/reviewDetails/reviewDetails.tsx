import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { H2, H3, RNText } from '../../../../../shared/src/components/text/text';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { reviewDetailsStyles } from './reviewDetails.styles';
import { useReviewDetails } from './useReviewDetails';

export const ReviewDetails = () => {
  const { t } = useTranslation();
  const { reviewDetails, onPressContinue, onPressCloseIcon } = useReviewDetails();
  return (
    <>
      <ProgressBarHeader
        leftArrow={true}
        totalStepsCount={3}
        progressStepsCount={3}
        onPressCloseIcon={onPressCloseIcon}
      />
      <View style={reviewDetailsStyles.container}>
        <ScrollView style={reviewDetailsStyles.mainContainer}>
          <AppointmentHeader
            title={t('appointment.reviewDetails.title')}
            description={t('appointment.reviewDetails.description')}
          />
          <View style={reviewDetailsStyles.itemSeparator} />
          <View style={reviewDetailsStyles.appointmentInfo}>
            <H2 style={reviewDetailsStyles.appointmentInfoTitle}>{t('appointment.reviewDetails.yourInformation')}</H2>
            <View style={reviewDetailsStyles.itemSeparator} />
            {reviewDetails.map((item) => (
              <View key={item.answer}>
                {item.answer ? (
                  <>
                    <H3 style={reviewDetailsStyles.question}>{item.question}</H3>
                    <RNText>{item.answer}</RNText>
                  </>
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={reviewDetailsStyles.continue}>
          <ActionButton onPress={onPressContinue} title={t('appointment.continue')} disabled={false} />
        </View>
      </View>
    </>
  );
};
