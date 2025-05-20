import React from 'react';
import { Text, View } from 'react-native';

import { WorkHour } from '../../../../sdks/providers/src/model/providerSearchResponse';
import { HoursTextView } from './hoursTextView';
import { styles } from './hoursView.styles';

interface HoursViewProps {
  workHoursArray: WorkHour[];
}

export const HoursView = ({ workHoursArray }: HoursViewProps) => (
  <>
    <View style={styles.container}>
      {workHoursArray.map((item) => (
        <View key={`${item.day}`} style={styles.itemStyle}>
          <HoursTextView viewStyle={styles.dayView} textStyle={styles.dayTitle} text={item.day} />
          <Text style={styles.timeText}>{item.hours}</Text>
        </View>
      ))}
    </View>
  </>
);
