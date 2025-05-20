import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const wellnessTopicStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  subContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  descText: {
    marginVertical: 20,
  },
  flexStyle: { flexDirection: 'column' },
  viewAllTopics: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: appFonts.medium,
    color: appColors.lightPurple,
    marginRight: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },
  subView: {
    flexDirection: 'row',
    marginTop: 15,
  },
  patientsView: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: appColors.thickerGray,
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 8,
    flexDirection: 'row',
  },
  topics: {
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  autoComplete: {
    zIndex: 1,
  },
  footerButtons: {
    paddingHorizontal: 20,
  },
});
