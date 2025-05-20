import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';

export const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    marginTop: 16,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: appColors.white,
  },
  bar: {
    width: 44,
    height: 4,
    backgroundColor: appColors.lightGray,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 5,
  },
  container: {
    width: '100%',
    backgroundColor: appColors.white,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
