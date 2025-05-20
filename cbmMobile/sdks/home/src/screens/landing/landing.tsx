import React from 'react';
import { ImageBackground, View } from 'react-native';

import { GetStarted } from '../../../../../shared/src/components/getStarted/getStarted';
import { APP_IMAGES } from '../../../../client/src/constants/images';
import { styles } from './landing.styles';
import { useLanding } from './useLanding';

export const Landing = () => {
  const { onPressContinueAsGuest, navigateToLogin, navigateToSignUp } = useLanding();
  return (
    <ImageBackground source={APP_IMAGES.EAP_BENEFITS} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.bar} />
        <GetStarted
          onPressPrimaryButton={navigateToSignUp}
          onPressSecondaryButton={navigateToLogin}
          onPressLink={onPressContinueAsGuest}
        />
      </View>
    </ImageBackground>
  );
};
