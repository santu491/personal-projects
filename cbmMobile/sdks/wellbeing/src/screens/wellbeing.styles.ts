import { StyleSheet } from 'react-native';

import { appColors } from '../../../../src/config';

export const wellbeingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  subContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardsView: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  itemSeparator: {
    backgroundColor: appColors.paleGray,
    height: 2,
  },
  label: {
    marginBottom: 20,
  },
  imageStyle: {
    height: 175,
    width: 'auto',
    borderRadius: 20,
  },
  viewAll: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 24,
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    color: appColors.lightPurple,
    marginRight: 10,
    fontSize: 16,
    alignSelf: 'center',
  },
});
