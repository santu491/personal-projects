import { StyleSheet } from 'react-native';

import { appColors } from '../../config';

export const styles = StyleSheet.create({
  chatIcon: {
    backgroundColor: appColors.darkPurple,
    width: 46,
    height: 46,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatView: {
    position: 'absolute',
    alignItems: 'flex-end',
    marginVertical: 20,
    marginRight: 20,
    zIndex: 1,
    bottom: 100,
    right: 10,
  },
});
