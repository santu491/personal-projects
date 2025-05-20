import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

const PROFILE_IMAGE_SIZE = 80;

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTitle: {
    color: appColors.purple,
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  detailProfessionTitle: {
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  detailPractitionTitle: {
    color: appColors.lightDarkGray,
    marginTop: 5,
  },
  professionTitle: {
    marginTop: 10,
  },
  practitionerTitle: {
    color: appColors.lightDarkGray,
    marginTop: 2,
    marginBottom: 8,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: appColors.lightPurple,
    marginRight: 16,
  },
  text: {
    fontFamily: appFonts.semiBold,
    fontSize: PROFILE_IMAGE_SIZE / 2.5,
    color: appColors.white,
    lineHeight: PROFILE_IMAGE_SIZE / 2,
  },
});
