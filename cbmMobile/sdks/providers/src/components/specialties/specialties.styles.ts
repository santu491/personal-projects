import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  specialtiesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  specialtiesTitle: {
    marginVertical: 8,
    fontWeight: '600',
    fontSize: 18,
    color: appColors.darkGray,
  },
  downImageStyle: {
    alignSelf: 'center',
  },
  specialtiesExpandViewStyle: {
    flex: 1,
    marginTop: 10,
  },
  specialtyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotView: {
    width: 4,
    height: 4,
    backgroundColor: appColors.turquoise,
    lineHeight: 16,
    fontSize: 16,
    marginRight: 8,
  },
  nameView: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    color: appColors.darkGray,
    margin: 4,
  },
});
