import React from 'react';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { ProfileTitleComponent } from '../../../../../shared/src/components/profileTitle/profileTitleComponent';
import { appColors } from '../../../../../shared/src/context/appColors';
import { SearchProvider } from '../../model/providerSearchResponse';
import { ContactComponent } from '../contact/contactComponent';
import { HoursOfOperation } from '../hoursOfOperation/hoursOfOperation';
import { Specialties } from '../specialties/specialties';
import { YellowCards } from '../yellowCards/yellowCards';
import { styles } from './providerList.styles';
import { useProviderListComponent } from './useProviderListComponent';

type ProviderListComponentProps = {
  hasEditCounselor?: boolean;
  onHandleSelectProvider: (findIndex: number) => void;
  onPress: (id: string) => void;
  providerInfo: SearchProvider;
};

export const ProviderListComponent: React.FC<ProviderListComponentProps> = ({
  onPress,
  providerInfo,
  onHandleSelectProvider,
  hasEditCounselor = false,
}) => {
  const { selectedProviders, t, findIndex } = useProviderListComponent(providerInfo);

  const renderSelect = () => {
    let buttonTitle = t('providers.select');
    if (selectedProviders?.length === 0) {
      buttonTitle = t('providers.requestAppointmentText');
    } else if (findIndex > -1) {
      buttonTitle = t('providers.selected');
    }
    return (
      <ActionButton
        title={buttonTitle}
        style={findIndex > -1 ? styles.selectedButton : styles.selectButton}
        textStyle={findIndex > -1 ? styles.selectedButtonText : styles.selectContinueButtonText}
        onPress={() => onHandleSelectProvider(findIndex)}
        testID={'provider.selectButton'}
      />
    );
  };

  return (
    <View
      style={[
        styles.mainCardView,
        {
          borderColor: findIndex > -1 ? appColors.lightPurple : appColors.lightGray,
        },
      ]}
      testID={'mainCardView'}
    >
      <ProfileTitleComponent viewStyle={styles.profileViewStyle} profileTitleData={providerInfo} onPress={onPress} />
      <View style={styles.lineView} />
      <ContactComponent providerInfo={providerInfo} hasAccordionView={hasEditCounselor} />
      <View style={styles.lineView} />
      <Specialties specialties={providerInfo.specialties} />
      <View style={styles.lineView} />
      <HoursOfOperation workHoursArray={providerInfo.workHours} />
      <View style={styles.lineView} />
      <YellowCards
        cardItems={providerInfo.yellowLabels}
        mainViewStyle={styles.subView}
        subViewStyle={styles.patientsView}
        textStyle={styles.cardTitle}
        testID="provider.yellowcards"
      />
      <View style={styles.lineView} />
      {providerInfo.onlineAppointmentScheduleFlag ? <View>{renderSelect()}</View> : null}
    </View>
  );
};
