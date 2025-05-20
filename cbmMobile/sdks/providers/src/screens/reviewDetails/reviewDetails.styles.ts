import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const reviewDetailsStyles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: appColors.white,
    flex: 1,
  },
  itemSeparator: {
    backgroundColor: appColors.paleGray,
    height: 1,
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
  continue: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
});
