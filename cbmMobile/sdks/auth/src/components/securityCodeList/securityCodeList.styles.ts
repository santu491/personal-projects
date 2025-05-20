import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';

export const styles = StyleSheet.create({
  containerView: {
    borderColor: appColors.thickerGray,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 20,
  },
  containerViewSelcted: {
    borderColor: appColors.lightPurple,
  },
  innerRowView: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  imageStyle: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  radioImageStyle: {
    alignSelf: 'flex-end',
    height: 20,
    marginLeft: 'auto',
    width: 20,
  },
  titleStyle: {
    color: appColors.mediumGray,
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 15,
    fontWeight: '600',
  },
});
