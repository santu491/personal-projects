import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const clinicalQuestionnaireStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  titleStyle: {
    fontWeight: '600',
    fontSize: 28,
    marginVertical: 22,
    marginHorizontal: 20,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  appointmentInfo: {
    borderColor: appColors.paleGray,
    borderWidth: 1,
    padding: 20,
    borderRadius: 24,
    marginTop: 20,
  },
  appointmentInfoTitle: {
    color: appColors.purple,
    fontFamily: appFonts.medium,
    marginBottom: 10,
    fontWeight: '600',
  },
  question: {
    fontFamily: appFonts.medium,
    fontWeight: '600',
    marginVertical: 10,
  },
  itemSeparator: {
    backgroundColor: appColors.paleGray,
    height: 1,
  },
});
