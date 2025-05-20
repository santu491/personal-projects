import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';
export const styles = StyleSheet.create({
  mapViewContainer: {
    flex: 1,
  },
  listViewLabel: {
    color: appColors.darkGray,
    fontFamily: appFonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    paddingLeft: 8,
  },
  listViewButton: {
    flexDirection: 'row',
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    width: 136,
    height: 44,
    borderWidth: 1,
    paddingLeft: 12,
    zIndex: 1,
    borderRadius: 8,
    marginTop: 34,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 18,
  },
  directionButton: {
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    backgroundColor: appColors.white,
    marginTop: 12,
  },
  providerName: {
    fontFamily: appFonts.semiBold,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  directionButtonText: {
    color: appColors.lightPurple,

    fontWeight: '600',
  },
  contactText: {
    fontSize: 16,
  },
  viewProfileButton: {
    marginTop: 16,
  },
  contactInfoText: {
    fontSize: 16,
    color: appColors.purple,
    lineHeight: 20,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: appColors.white,
    opacity: 0.85,
    borderRadius: 8,
    padding: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.blue,
    borderRadius: 20,
    marginVertical: 5,
  },
  zoomText: {
    color: appColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactView: {
    marginLeft: 8,
  },
});
