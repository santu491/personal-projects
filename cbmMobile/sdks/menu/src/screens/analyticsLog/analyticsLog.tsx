import { TextInput } from '@sydney/motif-components';
import React from 'react';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { RNText } from '../../../../../shared/src/components/text/text';
import { analyticsLogStyles } from './analyticsLog.style';
import { useAnalyticsLog } from './useAnalyticsLog';

export const AnalyticsLog = () => {
  const { onStartAnalyticsSessionButtonPress, sessionURL, onSessionURLChange, onPressLeftArrow } = useAnalyticsLog();

  return (
    <>
      <MainHeaderComponent onPressLeftArrow={onPressLeftArrow} isImmediateAssistanceVisible={false} hideLogin={true} />
      <View style={analyticsLogStyles.container}>
        <RNText>Please enter session URL below and tap on Start Session.</RNText>
        <TextInput
          testID="debug.analytics.session-input"
          style={analyticsLogStyles.input}
          onChangeText={(value) => {
            onSessionURLChange(value);
          }}
          value={sessionURL}
          placeholder={'Url...'}
        />
        <ActionButton
          onPress={onStartAnalyticsSessionButtonPress}
          title={'Start Session'}
          testID={'menu.session.button'}
        />
      </View>
    </>
  );
};
