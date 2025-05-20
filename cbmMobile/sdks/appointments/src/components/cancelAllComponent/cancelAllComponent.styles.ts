import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
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
  cancelAllDescription: {
    marginLeft: 10,
  },
  cancelDescriptionView: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
