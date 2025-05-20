import React from 'react';
import { Modal, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

import { styles } from './customTooltip.styles';

interface CustomTooltipProps {
  popoverContainerStyle: ViewStyle;
  popoverPosition: { right: number; top: number };
  setVisible?: (visble: boolean) => void;
  tooltipView?: React.ReactNode;
  visible: boolean;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  tooltipView,
  popoverPosition,
  visible,
  setVisible,
  popoverContainerStyle,
}) => {
  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible?.(false)}
        accessible={false}
      >
        <TouchableWithoutFeedback testID="modal-overlay" onPress={() => setVisible?.(false)} accessible={false}>
          <View style={styles.modalOverlay}>
            <View style={[popoverContainerStyle, { top: popoverPosition.top, right: popoverPosition.right }]}>
              {tooltipView}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
