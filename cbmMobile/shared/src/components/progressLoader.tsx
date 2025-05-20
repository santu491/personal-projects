// ProgressLoader.js
import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

import { APP_IMAGES } from '../../../src/config';
import { appStyles } from '../context/appStyles';

interface ProgressLoaderProps {
  backdropOpacity?: number;
  isVisible: boolean;
  showLoaderImage?: boolean;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  isVisible,
  showLoaderImage = true,
  backdropOpacity = 0.7,
}) => {
  return isVisible ? (
    <Modal
      testID={'progress-modal'}
      isVisible={isVisible}
      style={appStyles.loaderContainer}
      backdropOpacity={backdropOpacity}
    >
      {showLoaderImage ? (
        <FastImage style={appStyles.image} source={APP_IMAGES.LOADER_IMAGE} resizeMode={FastImage.resizeMode.contain} />
      ) : null}
      <View />
    </Modal>
  ) : null;
};
