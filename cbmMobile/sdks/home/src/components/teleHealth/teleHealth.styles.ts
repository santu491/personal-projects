import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  container: {
    height: 'auto',
    marginTop: 20,
    borderColor: appColors.lightGray,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: appColors.white,
  },
  description: {
    lineHeight: 20,
    color: appColors.mediumGray,
    marginHorizontal: 20,
  },
  label: {
    lineHeight: 20,
    fontSize: 22,
    paddingLeft: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
  cardStyle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 30,
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 20,
    padding: 90,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 30,
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    lineHeight: 26,
    alignContent: 'center',
    alignSelf: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
});
