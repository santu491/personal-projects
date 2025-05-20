import { StyleSheet } from 'react-native';

import { radioStyles } from '../../../../../shared/src/overrideStyles/radio.styles';
import { appColors } from '../../../../../src/config';

export const overrideRadioStyles = {
  radio: {
    itemContainer: {
      paddingVertical: 7,
    },
    itemRow: {
      borderWidth: 1,
      paddingLeft: 24,
      paddingRight: 14,
      borderRadius: 8,
      borderColor: appColors.lightGray,
      backgroundColor: appColors.thinGray,
      paddingVertical: 16,
    },
    itemLabel: {
      fontSize: 16,
      lineHeight: 18.24,
      fontWeight: '500',
    },
    dot: {
      dotOuter: {
        width: 22,
        height: 22,
        borderRadius: 20,
        borderColor: appColors.lightPurple,
      },
      dotInner: {
        marginTop: 0.5,
        width: 12,
        height: 12,
        borderRadius: 12,
        backgroundColor: appColors.lightPurple,
        alignSelf: 'center',
      },
    },
  },
};

export const counselorSettingStyles = () => {
  return {
    ...radioStyles,
    ...StyleSheet.create({
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
        marginBottom: 19,
      },
      continue: {
        width: '100%',
        paddingHorizontal: 15,
        marginBottom: 20,
      },
      editCounselor: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 15,
      },
      editCounselorLabel: {
        fontWeight: '500',
        lineHeight: 22,
        color: appColors.lightPurple,
        textDecorationLine: 'underline',
        paddingLeft: 8,
      },
    }),
  };
};
