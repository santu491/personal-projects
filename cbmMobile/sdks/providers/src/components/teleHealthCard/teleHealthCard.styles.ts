import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  mainCardView: {
    marginVertical: 5,
    flexDirection: 'column',
    borderColor: appColors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    width: 108,
    height: 60,
  },
  visitWebSite: {
    color: appColors.purple,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  visitButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    flexWrap: 'nowrap',
  },
  descriptionContainer: {
    justifyContent: 'flex-start',
  },
  descriptionSubContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  title: {
    fontWeight: '500',
    fontSize: 22,
    marginBottom: 10,
  },
  multiDes: {
    marginLeft: 3,
  },
});
