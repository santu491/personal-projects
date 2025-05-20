import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { SMSIcon } from '../../../shared/src/assets/icons/icons';
import { ProgressLoader } from '../../../shared/src/components/progressLoader';
import { useChatInit } from '../../hooks/useChatInit';
import { styles } from './chatInit.styles';

export const ChatInit = () => {
  const { checkChatAvailability, loading } = useChatInit();

  return (
    <>
      <ProgressLoader isVisible={loading} />
      <View style={styles.chatView}>
        <TouchableOpacity testID={'chat-icon'} onPress={checkChatAvailability} style={styles.chatIcon}>
          <SMSIcon />
        </TouchableOpacity>
      </View>
    </>
  );
};
