import React from 'react';
import { View } from 'react-native';

import { ActionButton } from '../../../../shared/src/components';
import { PhoneNumberLink } from '../../../../shared/src/components/phoneNumberLink';
import { RNText } from '../../../../shared/src/components/text/text';
import { ChatOfflineIcon } from '../assets/icons/icons';
import { styles } from './chatOffline.styles';
import { useChatOffline } from './useChatOffline';

export const ChatOfflineComponent = () => {
  const { naviagteToHomeScreen, t, phoneNumberTapped, genesysChat } = useChatOffline();

  return (
    <View style={styles.container}>
      <View style={styles.searchIconView}>
        <ChatOfflineIcon />
      </View>
      <RNText style={styles.description}>{genesysChat?.closedHeader}</RNText>
      <PhoneNumberLink text={genesysChat?.closedSupportAssistance ?? ''} phoneNumberTapped={phoneNumberTapped} />
      <View style={styles.homeButtonView}>
        <ActionButton
          onPress={naviagteToHomeScreen}
          title={t('chat.home')}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          testID={'chat.offline.homeButton'}
        />
      </View>
    </View>
  );
};
