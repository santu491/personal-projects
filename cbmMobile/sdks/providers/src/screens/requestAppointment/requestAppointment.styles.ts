import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';

export const requestAppointmentStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  readyToSubmitTextContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  readyToSubmitTitle: {
    color: appColors.purple,
    marginBottom: 10,
  },
  continue: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  readyToSubmitDescription: {
    marginVertical: 15,
  },
  secondaryButton: {
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    marginBottom: 10,
  },
  secondaryButtonTextStyle: {
    color: appColors.lightPurple,
  },
});
