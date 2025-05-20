import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  appointmentContentView: {
    marginHorizontal: 16,
    flex: 1,
  },
  contentContainer: {
    paddingTop: 28,
    paddingBottom: 38,
  },
  serialNumberView: {
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: appColors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.lightPurple,
  },
  serialNo: {
    lineHeight: 18.24,
  },
  contentView: {
    flexDirection: 'row',
    paddingBottom: 32,
  },
  infoView: {
    paddingLeft: 15,
    paddingTop: 7,
  },
  title: {
    lineHeight: 27.36,
  },
  description: {
    fontWeight: '500',
    lineHeight: 22,
    paddingTop: 9,
    paddingRight: 30,
  },
  continueButton: {
    backgroundColor: appColors.purple,
  },
  textLink: {
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
    fontWeight: '600',
  },
  subtitle: {
    fontWeight: '600',
  },
  continue: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 30,
  },
});
