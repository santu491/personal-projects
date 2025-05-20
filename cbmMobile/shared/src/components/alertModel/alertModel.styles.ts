import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: appColors.lightModalGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertViewStyle: {
    width: '100%',
  },
  innerViewStyle: {
    flexDirection: 'column',
    marginHorizontal: 20,
    backgroundColor: appColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
  },
  titleStyle: {
    fontFamily: appFonts.medium,
    textAlign: 'center',
  },
  descriptionStyle: {
    fontSize: 14,
    fontFamily: appFonts.medium,
  },
  imageStyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 10,
  },
  errorImage: {
    paddingTop: 2,
    paddingRight: 5,
  },
  subViewStyle: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderRadius: 24,
    padding: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    marginTop: 8,
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
  },
  secondaryActionButton: {
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    padding: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: appColors.lightPurple,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
  },
});
