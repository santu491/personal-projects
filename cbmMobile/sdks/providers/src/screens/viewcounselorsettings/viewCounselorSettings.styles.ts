import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const viewCounselorSettingStyles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  container: {
    backgroundColor: appColors.white,
    flex: 1,
  },
  itemSeparator: {
    backgroundColor: appColors.paleGray,
    height: 1,
  },
  counselorSettings: {
    borderColor: appColors.lightGray,
    borderWidth: 1,
    padding: 20,
    borderRadius: 24,
    marginTop: 20,
  },
  counselorSettingsTitle: {
    color: appColors.purple,
    fontFamily: appFonts.medium,
    marginBottom: 5,
    fontWeight: '600',
  },
  question: {
    fontFamily: appFonts.medium,
    fontWeight: '600',
    marginVertical: 5,
  },
  continue: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  roundButton: {
    borderRadius: 22,
    borderWidth: 1,
    height: 30,
    paddingHorizontal: 12,
    backgroundColor: appColors.thinPurple,
    borderColor: appColors.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
  },
  roundButtonText: {
    color: appColors.purple,
    fontFamily: appFonts.regular,
    fontWeight: '500',
    fontSize: 12,
  },
  daysView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  timeView: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  counselorView: {
    marginTop: 20,
  },
  editCounselor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 15,
  },
  editCounselorLabel: {
    fontWeight: '500',
    lineHeight: 22,
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
    paddingLeft: 8,
  },
});
