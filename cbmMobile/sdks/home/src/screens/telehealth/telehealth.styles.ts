import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { selectorStyles } from '../../../../../shared/src/overrideStyles/selector.styles';

export const teleHealthStyles = () => {
  return {
    ...selectorStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      subContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        flex: 1,
      },
      headerStyle: {
        color: appColors.black,
        marginTop: 20,
      },
      headerTextStyle: {
        marginTop: 10,
        color: appColors.darkGray,
      },
    }),
  };
};
