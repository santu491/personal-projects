import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: appColors.blackOpacity90,
  },
  container: {
    backgroundColor: appColors.white,
    flex: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    marginTop: 44,
  },
  distanceContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  distanceBoxContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  distanceView: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: appColors.lightGray,

    marginRight: 6,
    borderRadius: 8,
  },
  distanceLabelFirstBox: {
    width: 89,
  },
  distanceLabelBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  selectedDistanceLabelBox: {
    backgroundColor: `${appColors.lightPurple}10`,
    borderColor: appColors.lightPurple,
  },
  distanceLabel: {
    textAlign: 'center',
  },
  upArrowIcon: {
    marginRight: -6,
  },
  safeAreaView: {
    flex: 1,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingLeft: 24,
  },
  headerTitleView: {
    paddingLeft: 20,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  emptySpace: {
    width: 100,
  },
  filterOptionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  hr: {
    height: 1,
    backgroundColor: appColors.lighterGray,
  },
  filterTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 12,
    paddingRight: 21,
    backgroundColor: appColors.white,
  },
  filterOptionView: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 12,
  },
  filterOptionLabel: {
    paddingLeft: 8,
  },
  countLabel: {
    color: appColors.neutralGray,
  },
  resultsView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  resultViewPadding: {
    paddingVertical: 24,
  },
  iosResultPadding: {
    paddingBottom: 15,
  },
  resultButtonView: {
    paddingHorizontal: 50,
    backgroundColor: appColors.lightGray,
  },
  resultsButton: {
    backgroundColor: appColors.lightPurple,
    paddingVertical: 7,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  resultsTitle: {
    fontFamily: appFonts.regular,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: appColors.white,
  },
  space: { height: 17 },
  hrMargin: {
    marginBottom: 17,
  },
});
