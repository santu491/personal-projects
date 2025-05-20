import React from 'react';
import { Switch, View } from 'react-native';

import { H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../shared/src/context/appColors';
import { isAndroid } from '../../../../../src/util/commonUtils';
import { notificationStyles } from './labeledSwitch.styles';

interface LabeledSwitchProps {
  disabled?: boolean;
  isToggleEnabled: boolean;
  onValueChange: () => void;
  testID?: string;
  title: string;
}
export const LabeledSwitch = ({ isToggleEnabled, testID, onValueChange, title, disabled }: LabeledSwitchProps) => (
  <>
    <View style={notificationStyles.titleView}>
      <H4 style={notificationStyles.title}>{title}</H4>
      <View style={notificationStyles.switchView}>
        <Switch
          testID={testID}
          style={notificationStyles.switchStyle}
          disabled={disabled}
          trackColor={{
            true: appColors.purple,
            false: isAndroid() ? appColors.mediumLightGray : appColors.white,
          }}
          thumbColor={!isToggleEnabled ? (isAndroid() ? appColors.white : appColors.purple) : appColors.white}
          ios_backgroundColor={appColors.white}
          onValueChange={onValueChange}
          value={isToggleEnabled}
          accessibilityLabel={title}
          accessibilityRole="switch"
          accessible={true}
        />
      </View>
    </View>
  </>
);
