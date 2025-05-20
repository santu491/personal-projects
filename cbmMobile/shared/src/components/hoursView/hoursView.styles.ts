import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemStyle: {
    flexDirection: 'column',
    marginBottom: 15,
    width: '45%',
  },
  dayView: {
    backgroundColor: appColors.lighterGray,
    borderRadius: 14,
    padding: 5,
  },
  dayTitle: {
    fontSize: 12,
    fontFamily: appFonts.medium,
    textAlign: 'center',
    color: appColors.darkGray,
    lineHeight: 14,
    // textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: appFonts.regular,
    textAlign: 'center',
    color: appColors.lightDarkGray,
    lineHeight: 20,
  },
});
