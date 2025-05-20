import { Dimensions, StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainCardView: {
    marginVertical: 5,
    flexDirection: 'column',
    borderColor: appColors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardInnerView: {
    margin: 18,
  },
  subView: {
    flexDirection: 'row',
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  profileViewStyle: {
    flex: 6,
    marginRight: 6,
  },
  checkBoxViewStyle: {
    height: 32,
    display: 'flex',
    flexDirection: 'row',
  },
  checkBoxImageStyle: {
    width: 20,
    height: 20,
    justifyContent: 'flex-start',
  },
  saveText: {
    marginLeft: 10,
  },
  patientsView: {
    paddingHorizontal: 7,
    borderColor: appColors.lighterGray,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    flexDirection: 'row',
  },
  cardTitle: {
    color: appColors.darkGray,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
    marginLeft: 5,
  },
  hoursTitle: {
    marginVertical: 8,
  },
  checkViewStyle: {
    marginTop: 2,
    marginHorizontal: 4,
  },
  lineView: {
    backgroundColor: appColors.lighterGray,
    height: 1,
    marginVertical: 6,
    width: '100%',
  },
  selectButton: {
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: width * 0.6,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  selectContinueButtonText: {
    color: appColors.lightPurple,
    fontSize: 18,
    fontFamily: appFonts.semiBold,
  },
  selectedButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: width * 0.6,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  selectedButtonText: {
    color: appColors.white,
    fontSize: 18,
    fontFamily: appFonts.semiBold,
  },
  downImageStyle: {
    alignSelf: 'center',
  },
  hoursView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  hoursExpandViewStyle: {
    marginTop: 10,
  },
  disableButton: {
    backgroundColor: appColors.lineGray,
    borderColor: appColors.paleGray,
    borderWidth: 2,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: width * 0.6,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
});
