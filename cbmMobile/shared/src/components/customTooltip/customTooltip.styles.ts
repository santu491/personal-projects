import { StyleSheet } from 'react-native';

import { appColors } from '../../../../src/config';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: appColors.overlay,
  },
});
