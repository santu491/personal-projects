import { StyleSheet } from 'react-native';

import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../src/config';

export const timeRangeStyles = () => {
  return {
    ...fieldStyles,
    ...textInputStyles,
    ...StyleSheet.create({
      container: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      scrollView: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      selector: {
        paddingHorizontal: 16,
        paddingTop: 21,
      },
      continue: {
        width: '100%',
        paddingHorizontal: 15,
        marginBottom: 20,
      },
    }),
  };
};
