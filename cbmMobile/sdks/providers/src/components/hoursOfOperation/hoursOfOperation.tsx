import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { DownArrowIcon, UpArrowIcon } from '../../../../../shared/src/assets/icons/icons';
import { HoursView } from '../../../../../shared/src/components/hoursView/hoursView';
import { H3, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { sortDays } from '../../../../../src/util/commonUtils';
import { WorkHour } from '../../model/providerSearchResponse';
import { styles } from './hoursOfOperation.styles';

interface HoursViewProps {
  workHoursArray?: WorkHour[];
}

export const HoursOfOperation = (props: HoursViewProps) => {
  const [isHoursView, setIsHoursView] = useState(false);
  const displayHoursData = () => {
    setIsHoursView((previousState) => !previousState);
  };
  const sortedWorkHoursArray = props.workHoursArray ? sortDays(props.workHoursArray) : [];
  const { t } = useTranslation();
  return (
    <View>
      <TouchableOpacity onPress={displayHoursData} style={styles.hoursView} testID={'work-hour'}>
        <H3 style={styles.hoursTitle} testID={'hours-title'}>
          {t('providers.hoursOfOperation')}
        </H3>
        <View style={styles.downImageStyle} testID={'hours-arrow'}>
          {isHoursView ? (
            <UpArrowIcon width={12} height={12} color={appColors.darkGray} />
          ) : (
            <DownArrowIcon width={12} height={12} color={appColors.darkGray} />
          )}
        </View>
      </TouchableOpacity>
      {props.workHoursArray && props.workHoursArray.length > 0 && isHoursView ? (
        <View style={styles.hoursExpandViewStyle} testID={'hours-expand-view'}>
          <HoursView workHoursArray={sortedWorkHoursArray} />
        </View>
      ) : (
        isHoursView && <RNText style={styles.hoursUnavailable}>{t('providers.hoursNotAvailable')}</RNText>
      )}
    </View>
  );
};
