import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';
const PROFILE_IMAGE_SIZE = 70;

export const profileStyles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    flex: 1,
  },
  itemSeparatorStyle: {
    borderBottomColor: appColors.mediumDarkGray,
    borderBottomWidth: 0.4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  profileViewStyle: {
    paddingLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: appColors.lightPurple,
  },
  text: {
    fontSize: PROFILE_IMAGE_SIZE / 2.5,
    color: appColors.white,
    lineHeight: PROFILE_IMAGE_SIZE / 2,
  },
  nameText: {
    fontSize: 20,
  },
  title: {
    marginTop: 12,
    fontSize: 24,
    paddingHorizontal: 16,
  },
  detailPractitionTitle: {
    color: appColors.lightDarkGray,
    marginTop: 5,
  },

  actionButton: {
    borderColor: appColors.lightPurple,
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    marginBottom: 30,
  },
  actionButtonText: {
    color: appColors.lightPurple,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
  },
});
