import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const notificationViewStyles = StyleSheet.create({
  notificationView: {
    flex: 1,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: appColors.paleLavender,
  },
  notificationList: {
    backgroundColor: appColors.white,
    marginBottom: 30,
  },
  headerStyle: {
    color: appColors.black,
    padding: 10,
  },
  mainContainer: {
    backgroundColor: appColors.white,
    flex: 1,
  },
  linkButtonStyle: {
    fontSize: 16,
    lineHeight: 22,
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
  },
  linkButtonDisable: {
    color: appColors.placeholderText,
  },
  subHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.paleLavender,
  },
  subViewContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  dotView: {
    width: 12,
    height: 12,
    marginTop: 5,
    borderRadius: 6,
    backgroundColor: appColors.lightPurple,
    marginRight: -10,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 20,
    width: '85%',
  },
  title: {
    fontFamily: appFonts.medium,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 18,
    color: appColors.darkGray,
    marginBottom: 10,
  },
  description: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: appColors.darkGray,
    marginBottom: 10,
  },
  actionButton: {
    height: 32,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: appFonts.regular,
    fontWeight: '500',
    justifyContent: 'center',
    alignContent: 'center',
  },
  timeStamp: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: appColors.darkGray,
    justifyContent: 'flex-start',
    width: 50,
  },
  recentView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  badgeView: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: appColors.lightPurple,
    marginLeft: 10,
    alignItems: 'center',
  },
  notificationCount: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 20,
    color: appColors.white,
    textAlign: 'center',
  },
  emptyView: {
    backgroundColor: appColors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    marginTop: 15,
  },
  loader: {
    alignSelf: 'center',
  },
  loaderViewStyle: {
    marginVertical: 20,
  },
  flatListContentContainer: {
    paddingBottom: '10%',
  },
});
