import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const appointmentCancelRequestStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  listContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  itemSeparatorStyle: {
    borderBottomColor: appColors.lighterGray,
    borderBottomWidth: 2,
  },
  titleStyle: {
    color: appColors.mediumGray,
    fontWeight: '600',
    fontSize: 28,
    marginVertical: 22,
    marginHorizontal: 20,
  },
  listStyle: {
    marginTop: 20,
  },
  footerView: {
    margin: 20,
  },
  cancelAllDescription: {
    marginBottom: 20,
    marginLeft: 5,
  },
  cancelDescriptionView: {
    flex: 1,
    flexDirection: 'row',
  },
  pending: {
    backgroundColor: appColors.paleYellow,
  },
  approved: {
    backgroundColor: appColors.paleTurquoise,
  },
  rejected: {
    backgroundColor: appColors.paleRed,
  },
  dateTimeStyle: {
    fontSize: 14,
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    color: appColors.purple,
  },
  cancelViewContainer: {
    borderColor: appColors.lightGray,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: appColors.white,
    marginHorizontal: 15,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  headerCancelAllDescription: {
    marginLeft: 10,
  },
  headerCancelDescriptionView: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
