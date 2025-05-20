import { t } from 'i18next';
import React from 'react';
import { View } from 'react-native';

import { ActionButton } from '../../../../../../shared/src/components';
import { RNText } from '../../../../../../shared/src/components/text/text';
import { callNumber } from '../../../../../../shared/src/utils/utils';
import { HomeCardProps } from '../../../model/home';
import { homeCardStyles } from '../homeCardStyles';

export const CriticalEventCard: React.FC<HomeCardProps> = ({ item, navigateToDetails }) => {
  const description = item.description?.split('{:supportNumber}')[0];
  const onPressContactNo = () => {
    if (item.supportNumber) {
      callNumber(item.supportNumber);
    }
  };
  return (
    <View style={homeCardStyles.criticalEvent} key={item.title}>
      <View style={homeCardStyles.criticalSubContainer}>
        <RNText style={homeCardStyles.criticalEventDescription}>
          {description}
          <RNText style={homeCardStyles.criticalEventSupportNumber} onPress={onPressContactNo}>
            {item.supportNumber}
          </RNText>
        </RNText>
        <ActionButton
          onPress={() => navigateToDetails(item)}
          title={t('home.learnMore')}
          style={homeCardStyles.learnMoreButton}
          textStyle={homeCardStyles.actionButtonText}
          testID={'homeCard.learn.button'}
        />
      </View>
    </View>
  );
};
