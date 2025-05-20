import { StyleSheet } from 'react-native';

import { buttonStyles } from '../../../shared/src/overrideStyles/button.styles';
import { appColors } from '../../config';

export const overrideButtonStyles = {
  button: {
    container: {
      marginBottom: 50,
    },
  },
};

export const getStyles = () => {
  return {
    ...buttonStyles,
    ...StyleSheet.create({
      center: {
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 120,
      },
      container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 50,
      },
      contentContainer: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      errorIcon: {
        height: 52,
        width: 52,
        color: appColors.darkGray,
        marginBottom: 16,
      },
      messageText: {
        color: appColors.lightDarkGray,
        textAlign: 'center',
      },
      titleText: {
        color: appColors.darkGray,
        textAlign: 'center',
        marginVertical: 10,
      },
      splashBackground: {
        ...StyleSheet.absoluteFillObject,
      },
      logoContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 50,
      },
    }),
  };
};
