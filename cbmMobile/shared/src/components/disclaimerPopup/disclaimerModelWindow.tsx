import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

import { APP_CONTENT } from '../../../../src/config';
import { CloseIcon } from '../../assets/icons/icons';
import { source } from '../../assets/providerSearchDisclaimerText';
import { appColors } from '../../context/appColors';
import { ActionButton } from '../actionButton';
import { styles } from './disclaimer.styles';

type DisclaimersModelProps = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
};

export const DisclaimerModelWindow = ({ modalVisible, setModalVisible }: DisclaimersModelProps) => {
  const { width } = useWindowDimensions();

  const closeWindow = () => {
    setModalVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modelBackgroundStyle}>
        <View style={styles.transparentViewStyle}>
          <View style={styles.containerStyle}>
            <View style={styles.headerContainerStyle}>
              <Text style={styles.titleStyle} testID={'copy-rights-model-title'}>
                {APP_CONTENT.FOOTER.COPYRIGHT_MODEL_TITLE}
              </Text>
              <TouchableOpacity onPress={closeWindow} style={styles.closeView}>
                <CloseIcon color={appColors.darkGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.copyRightsDesriptionViewStyle}>
              <ScrollView>
                <RenderHTML contentWidth={width} source={source} />
              </ScrollView>
            </View>

            <View style={styles.disclaimerBottomContainer}>
              <ActionButton
                title={APP_CONTENT.FOOTER.COPYRIGHTS_OK_BUTTON}
                style={styles.disclaimerOkButtonStyle}
                textStyle={styles.disclaimerOkButtonText}
                onPress={closeWindow}
                testID={'copyrights-ok-button'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
