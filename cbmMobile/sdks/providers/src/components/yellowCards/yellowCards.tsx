import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import {
  AcceptingNewPatientsIcon,
  NotAvailableIcon,
  PublicTransportationIcon,
  WheelChairIcon,
} from '../../../../../shared/src/assets/icons/icons';
import { YellowCardIcons, YellowLabels } from '../../model/providerSearchResponse';
import { styles } from './yellowCards.styles';

export const yellowImages = {
  [YellowCardIcons.ACCEPTING_NEW_PATIENTS]: <AcceptingNewPatientsIcon />,
  [YellowCardIcons.WHEEL_CHAIR_ACCESS]: <WheelChairIcon />,
  [YellowCardIcons.PUBLIC_TRANSPORTATION]: <PublicTransportationIcon />,
};

interface YellowCardProps {
  cardItems?: YellowLabels[];
  mainViewStyle?: StyleProp<ViewStyle>;
  subViewStyle?: StyleProp<ViewStyle>;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
}

export const YellowCards: React.FC<YellowCardProps> = ({
  cardItems,
  mainViewStyle,
  subViewStyle,
  textStyle,
  testID,
}) => {
  return (
    <View style={mainViewStyle} testID={testID}>
      {cardItems?.map((item) => (
        <View key={item.label ?? item.icon} style={subViewStyle}>
          {item.notAvailable ? (
            <View style={styles.imageStyle}>
              <NotAvailableIcon />
            </View>
          ) : null}
          {item.icon ? yellowImages[item.icon as keyof typeof yellowImages] : null}
          {item.label ? <Text style={textStyle}>{item.label}</Text> : null}
        </View>
      ))}
    </View>
  );
};
