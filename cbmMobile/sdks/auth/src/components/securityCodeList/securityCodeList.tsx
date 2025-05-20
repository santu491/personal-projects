import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { H3, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../shared/src/context/appColors';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { CircleSelectedIcon, CircleUnSelectedIcon } from '../../assets/icons/authIcons';
import { ChannelContact } from '../../models/mfa';
import { styles } from './securityCodeList.styles';

interface SecurityCodeListProps {
  handlePress: (item: ChannelContact) => void;
  mfaOptions: ChannelContact[];
  selectedMfa?: ChannelContact;
  testID?: string;
}
export const SecurityCodeList = ({ mfaOptions, handlePress, selectedMfa, testID }: SecurityCodeListProps) => (
  <>
    <View>
      {mfaOptions.map((item) => (
        <View
          key={item.channel}
          testID={testID}
          style={[
            styles.containerView,
            item.channel === selectedMfa?.channel ? styles.containerViewSelcted : styles.containerView,
          ]}
        >
          <TouchableOpacity testID={'auth.mfa.security.option'} onPress={() => handlePress(item)}>
            <View style={styles.innerRowView}>
              <Image source={item.image} style={styles.imageStyle} />
              <H3 testID={'auth.mfa.security.title'} style={styles.titleStyle}>
                {toPascalCase(item.channel)}
              </H3>
              <View style={styles.radioImageStyle}>
                {item.channel === selectedMfa?.channel ? <CircleSelectedIcon /> : <CircleUnSelectedIcon />}
              </View>
            </View>
            <RNText style={{ color: appColors.lightDarkGray }}>{item.description}</RNText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </>
);
