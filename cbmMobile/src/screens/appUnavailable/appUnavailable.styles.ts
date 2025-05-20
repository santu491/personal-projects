import { StyleSheet } from 'react-native';

import { buttonStyles } from '../../../shared/src/overrideStyles/button.styles';
import { appColors } from '../../config';

export const appUnavailableStyles = () => {
  return {
    ...buttonStyles,
    ...StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: appColors.purple,
      },
      safeContainer: { flex: 1 },
      contentContainer: {
        paddingHorizontal: 20,
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      },
      logoContainer: {
        marginTop: 42,
        alignSelf: 'center',
      },
      descriptionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
      errorText: {
        paddingHorizontal: 20,
        color: appColors.white,
        textAlign: 'center',
        paddingVertical: 10,
      },
      errorMessage: {
        paddingHorizontal: 20,
        color: appColors.white,
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 14,
      },
      buttonContainer: {
        marginTop: 30,
      },
      center: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 100,
      },
      contentWithOutLoader: {
        paddingHorizontal: 20,
        flex: 1,
        alignSelf: 'center',
        top: 100,
      },
      version: {
        alignSelf: 'center',
        color: appColors.white,
        paddingBottom: 5,
      },
    }),
  };
};
