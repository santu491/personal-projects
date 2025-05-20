import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  settingsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  settingsInfo: {
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 26,
  },
  continue: {
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  daySelected: {
    backgroundColor: appColors.thinPurple,
    borderColor: appColors.lightPurple,
  },
  daysList: {
    flexDirection: 'row',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 16,
    marginTop: 29,
  },
  gridItem: {
    width: '29%',
    marginRight: 15,
    marginBottom: 20,
  },
  dayButton: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: appColors.thinGray,
    borderColor: appColors.thickerGray,
    paddingVertical: 11,
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: appColors.darkGray,
    textAlign: 'left',
    paddingLeft: 12,
  },
});
