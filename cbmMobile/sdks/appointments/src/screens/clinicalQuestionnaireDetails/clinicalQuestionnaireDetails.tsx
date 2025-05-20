import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H2, H3, RNText } from '../../../../../shared/src/components/text/text';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { clinicalQuestionnaireStyles } from './clinicalQuestionnaireDetails.styles';
import { useClinicalQuestionnaireDetails } from './useClinicalQuestionnaireDetails';

export const ClinicalQuestionnaireDetails = () => {
  const { t } = useTranslation();
  const { clinicalQuestionnaireDetails, clinicalInfo } = useClinicalQuestionnaireDetails();

  return (
    <>
      <MainHeaderComponent />
      <View style={clinicalQuestionnaireStyles.container}>
        <ScrollView style={clinicalQuestionnaireStyles.mainContainer}>
          <MemberProfileHeader
            titleStyle={clinicalQuestionnaireStyles.titleStyle}
            testID={'appointments.appointmentDetails.clinicalQuestionnaire'}
            title={t('appointments.appointmentDetailsContent.clinicalQuestionnaire')}
          />
          {clinicalInfo ? (
            <View style={clinicalQuestionnaireStyles.appointmentInfo}>
              <H2 style={clinicalQuestionnaireStyles.appointmentInfoTitle}>
                {t('appointments.appointmentDetailsContent.clinicalQuestionnaire')}
              </H2>
              <View style={clinicalQuestionnaireStyles.itemSeparator} />
              {clinicalQuestionnaireDetails.map((item) => (
                <View key={item.answer}>
                  {item.answer ? (
                    <>
                      <H3 style={clinicalQuestionnaireStyles.question}>{item.question}</H3>
                      <RNText>{item.answer}</RNText>
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <NoRequests />
          )}
        </ScrollView>
      </View>
    </>
  );
};
